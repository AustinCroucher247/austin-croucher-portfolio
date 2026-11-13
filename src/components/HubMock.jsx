import { useState } from 'react';

/*
 * A coded miniature of Household HQ. The real app sits behind a login and
 * holds private data, so this shows its shape with sample content instead.
 * Three of its ideas are live here: the in-place grocery list, the
 * mine / shared / theirs budget split, and the movie-night picker.
 */

const tiles = [
  { id: 'budget', name: 'Budget', note: 'Sort a statement', icon: 'M4 7h16v11H4zM4 10h16M15 14h2' },
  { id: null, name: 'What’s on', note: '2 this week', icon: 'M5 6h14v13H5zM5 10h14M9 4v4M15 4v4' },
  { id: 'movies', name: 'Movie Night', note: 'Pick for us', icon: 'M4 6h16v12H4zM8 6v12M16 6v12M4 12h4M16 12h4' },
  { id: 'list', name: 'The List', note: 'Shared, live', icon: 'M9 7h10M9 12h10M9 17h10M5 7h.01M5 12h.01M5 17h.01' },
  { id: null, name: 'Recipe Bank', note: 'Ask the assistant', icon: 'M6 4h11a1 1 0 0 1 1 1v15H7a1 1 0 0 1-1-1zM10 9h5M10 13h5' },
  { id: null, name: 'Stretches', note: '10 minutes', icon: 'M12 3.5v.01M5 9l7-1 7 1M12 8v7M8 20l4-5 4 5' },
];

const starterList = [
  { id: 1, store: 'Costco', name: 'Coffee beans', done: true },
  { id: 2, store: 'Costco', name: 'Paper towel', done: false },
  { id: 3, store: 'Grocery', name: 'Lemons', done: false },
  { id: 4, store: 'Grocery', name: 'Oat milk', done: true },
  { id: 5, store: 'Grocery', name: 'Eggs', done: false },
];

const starterPurchases = [
  { id: 1, name: 'Grocery store', amount: 84.2, who: 'shared' },
  { id: 2, name: 'Hydro bill', amount: 112.0, who: 'shared' },
  { id: 3, name: 'Game store', amount: 39.99, who: 'a' },
  { id: 4, name: 'Bookshop', amount: 27.5, who: 'b' },
  { id: 5, name: 'Pet supplies', amount: 46.3, who: 'shared' },
];
const owners = [
  { id: 'a', label: 'A' },
  { id: 'shared', label: 'Both' },
  { id: 'b', label: 'B' },
];

const films = ['The heist one', 'The space one', 'The slow French one', 'The animated one', 'The one with the dog'];

const money = (value) => `$${value.toFixed(2)}`;

function GroceryList() {
  const [items, setItems] = useState(starterList);
  const done = items.filter((item) => item.done).length;
  const toggle = (id) =>
    setItems((list) => list.map((item) => (item.id === id ? { ...item, done: !item.done } : item)));

  return (
    <>
      <div className="hub__phone-head">
        <strong>The List</strong>
        <span>
          {done} of {items.length}
        </span>
      </div>
      <div className="hub__progress" aria-hidden="true">
        <i style={{ width: `${(done / items.length) * 100}%` }} />
      </div>
      {['Costco', 'Grocery'].map((store) => (
        <div key={store} className="hub__group">
          <p>{store}</p>
          {items
            .filter((item) => item.store === store)
            .map((item) => (
              <label key={item.id} className={item.done ? 'is-done' : undefined}>
                <input type="checkbox" checked={item.done} onChange={() => toggle(item.id)} />
                <span>{item.name}</span>
              </label>
            ))}
        </div>
      ))}
    </>
  );
}

function BudgetSplit() {
  const [rows, setRows] = useState(starterPurchases);
  const assign = (id, who) => setRows((list) => list.map((row) => (row.id === id ? { ...row, who } : row)));

  // Each person pays for their own purchases plus half of everything shared.
  const total = (person) =>
    rows.reduce((sum, row) => sum + (row.who === person ? row.amount : row.who === 'shared' ? row.amount / 2 : 0), 0);

  return (
    <>
      <div className="hub__phone-head">
        <strong>Budget</strong>
        <span>Who pays what</span>
      </div>
      <ul className="hub__rows">
        {rows.map((row) => (
          <li key={row.id}>
            <span>
              {row.name}
              <em>{money(row.amount)}</em>
            </span>
            <span className="hub__seg" role="group" aria-label={`Who is ${row.name} for`}>
              {owners.map((owner) => (
                <button
                  key={owner.id}
                  type="button"
                  aria-pressed={row.who === owner.id}
                  onClick={() => assign(row.id, owner.id)}
                >
                  {owner.label}
                </button>
              ))}
            </span>
          </li>
        ))}
      </ul>
      <dl className="hub__totals">
        <div>
          <dt>A pays</dt>
          <dd>{money(total('a'))}</dd>
        </div>
        <div>
          <dt>B pays</dt>
          <dd>{money(total('b'))}</dd>
        </div>
      </dl>
    </>
  );
}

function MoviePick() {
  const [pick, setPick] = useState(null);
  const [spinning, setSpinning] = useState(false);

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    let ticks = 0;
    const timer = setInterval(() => {
      ticks += 1;
      setPick(Math.floor(Math.random() * films.length));
      if (ticks >= 12) {
        clearInterval(timer);
        setSpinning(false);
      }
    }, 90);
  };

  return (
    <>
      <div className="hub__phone-head">
        <strong>Movie Night</strong>
        <span>Watchlist</span>
      </div>
      <ul className="hub__films">
        {films.map((film, i) => (
          <li key={film} className={pick === i ? 'is-picked' : undefined}>
            {film}
          </li>
        ))}
      </ul>
      <button type="button" className="hub__spin" onClick={spin} disabled={spinning}>
        {spinning ? 'Picking…' : pick === null ? 'Pick for us' : 'Pick again'}
      </button>
    </>
  );
}

const views = { list: GroceryList, budget: BudgetSplit, movies: MoviePick };

export default function HubMock() {
  const [view, setView] = useState('list');
  const View = views[view];

  return (
    <figure className="hub">
      <div className="hub__stage">
        <div className="hub__screen">
          <div className="hub__bar">
            <span className="hub__brand">Household HQ</span>
            <span className="hub__sync">
              <i aria-hidden="true" /> Synced
            </span>
          </div>
          <p className="hub__greeting">Good evening.</p>
          <ul className="hub__tiles">
            {tiles.map((tile) => {
              const body = (
                <>
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d={tile.icon} />
                  </svg>
                  <strong>{tile.name}</strong>
                  <span>{tile.note}</span>
                </>
              );
              return (
                <li key={tile.name}>
                  {tile.id ? (
                    <button
                      type="button"
                      className="hub__tile"
                      aria-pressed={view === tile.id}
                      onClick={() => setView(tile.id)}
                    >
                      {body}
                    </button>
                  ) : (
                    <div className="hub__tile hub__tile--static">{body}</div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        <div className="hub__phone" aria-live="polite">
          <View />
        </div>
      </div>

      <figcaption className="hub__caption">
        A working miniature with sample data, since the real app is private. Open Budget, Movie Night or The
        List and try them.
      </figcaption>
    </figure>
  );
}
