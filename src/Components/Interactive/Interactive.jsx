import GameComponent from '../InteractiveGameComp/GameMount';
import { useEffect } from 'react';

function Interactive() {
    useEffect(() => {
        window.scrollBy(0, 5 * window.innerHeight / 100);
    }, []);

    return (
        <div>
            <GameComponent />
        </div>
    );
}

export default Interactive;
