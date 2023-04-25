import game from "../../Components/InteractiveGameComp/Game";
import { useEffect, useRef } from 'react';

const GameComponent = props => {
    const canvasRef = useRef();

    useEffect(() => {
        // eslint-disable-next-line
        game.mount(canvasRef.current);

        // eslint-disable-next-line
    }, []);

    return (
        <>
            <script src="../src/Components/InteractiveGameComp/Sprite.js"></script>

            <canvas ref={canvasRef} />
        </>
    );
};

export default GameComponent;