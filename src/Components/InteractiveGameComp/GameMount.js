import game from "../../Components/InteractiveGameComp/Game";
import { useEffect, useRef } from 'react';
import './canvas.scss'
import { Header } from "react-fullpage";

const GameComponent = props => {
    const canvasRef = useRef();

    useEffect(() => {
        // eslint-disable-next-line
        game.mount(canvasRef.current);

        // eslint-disable-next-line
    }, []);

    return (
        <>
            <div className="body">
                <Header />
                <script src="../src/Components/InteractiveGameComp/Sprite.js"></script>
                <div className="canvas--container">
                    <canvas ref={canvasRef} />
                </div>
            </div>
        </>
    );
};

export default GameComponent;