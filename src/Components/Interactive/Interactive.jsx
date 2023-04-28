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
        window.scrollTo(0, window.scrollY + 5 * window.innerHeight / 100);
        window.location.reload();
    };

    return (
        <div className='button--contai'>
            {showButton && <img src={PlayButton} className='play--button' alt="" onClick={handleClick} />}
            <GameComponent />
        </div>
    );
}

export default Interactive;