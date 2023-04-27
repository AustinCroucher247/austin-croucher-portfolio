import GameComponent from '../InteractiveGameComp/GameMount';
import './Interactive.scss'

function Interactive() {
    const reloadPage = () => {
        window.scrollTo(0, window.scrollY + 5 * window.innerHeight / 100);
        window.location.reload();
    };



    return (
        <div>
            <button className='button--reload' onClick={reloadPage}>Start Game</button>
            <GameComponent />
        </div>
    );
}

export default Interactive;