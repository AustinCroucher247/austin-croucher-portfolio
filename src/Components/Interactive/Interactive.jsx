import GameComponent from '../InteractiveGameComp/GameMount';
import './Interactive.scss';
import PlayButton from '../../assets-portfolio/Assets-Interactive/assets/PlayButton.png';
import { useState } from 'react';

function Interactive() {
    const [showButton, setShowButton] = useState(true);

    const handleClick = () => {
        setShowButton(false);
        reloadPage();
    };

    const reloadPage = () => {
        window.location.reload();

        window.scrollTo(0, window.scrollY + 15 * window.innerHeight / 100);
    };

    return (

        <div className='button--contai'>
            <h1 className='desktop-text'>Only available on desktop!</h1>
            {showButton && <img src={PlayButton} className='play--button' alt="" onClick={handleClick} />}
            <GameComponent />
        </div>
    );
}

export default Interactive;