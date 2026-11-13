export default function SectionHead({ index, label, title, children }) {
  return (
    <header className="section-head" data-reveal>
      <p className="eyebrow">
        <span className="eyebrow__index">{index}</span> {label}
      </p>
      <h2 className="section-head__title">{title}</h2>
      {children ? <p className="section-head__note">{children}</p> : null}
    </header>
  );
}
