// import ProfileNoBack from '../../assets-portfolio/ProfilePicNoBack.png'
import Header from '../Header/Header';
import './NonInteractive.scss'
import RetroRumble from '../../assets-portfolio/RetroNoBlue.jpg'
import PlanetJumper from '../../assets-portfolio/PlanetJumper.jpg'
import ArcadeMachine from '../../assets-portfolio/Arcade.avif'
import Astronaut from '../../assets-portfolio/SpaceAvatarWithWhite.jpg'
import React, { useState } from 'react';


function NonInteractive() {

    const [showModal, setShowModal] = useState(false);
    const handleCardClick = (e, url) => {
        e.preventDefault();
        setShowModal(true);
        setTimeout(() => {
            window.location.href = url;
        }, 3000);
    };
    return (
        <>
            <Header />
            <div className='card--container--non--interactive'>
                <h1 className='card--title'>Projects</h1>
                <ul class="cards">
                    <li>
                        <a href="https://calm-dasik-5c6551.netlify.app/" class="card" onClick={(e) => handleCardClick(e, 'https://calm-dasik-5c6551.netlify.app/')}>
                            <img src={RetroRumble} className='card--img--retrorumble' alt="" />
                            <div class="card__overlay">
                                <div class="card__header">
                                    <svg class="card__arc" xmlns="http://www.w3.org/2000/svg"><path /></svg>
                                    <img class="card__thumb" src={ArcadeMachine} alt="" />
                                    <div class="card__header-text">
                                        <h3 class="card__title">Retro Rumble</h3>
                                        <span class="card__status">April 12, 2023</span>
                                    </div>
                                </div>
                                <p class="card__description">Retro Rumble, features classic arcade games like Space Invaders and Tetris. The Website includes leaderboard functionality so you can compete against other gamers from around the world to see who's the best.</p>
                            </div>
                        </a>
                    </li>
                    <li>
                        <a href="" class="card">
                            <img src={PlanetJumper} class="card__image" alt="" />
                            <div class="card__overlay">
                                <div class="card__header">
                                    <svg class="card__arc" xmlns="http://www.w3.org/2000/svg"><path /></svg>
                                    <img class="card__thumb" src={Astronaut} alt="" />
                                    <div class="card__header-text">
                                        <h3 class="card__title">Planet Jumper</h3>
                                        <span class="card__status">March 20th, 2023</span>
                                    </div>
                                </div>
                                <p class="card__description">An interactive space education tool where users can flip between different planets and use spacebar to make the astronaut jump relative to the currently selected planets gravity</p>
                            </div>
                        </a>
                    </li>
                    {/* <li>
                        <a href="" class="card">
                            <img src="https://i.imgur.com/oYiTqum.jpg" class="card__image" alt="" />
                            <div class="card__overlay">
                                <div class="card__header">
                                    <svg class="card__arc" xmlns="http://www.w3.org/2000/svg"><path /></svg>
                                    <img class="card__thumb" src="https://i.imgur.com/7D7I6dI.png" alt="" />
                                    <div class="card__header-text">
                                        <h3 class="card__title">Jessica Parker</h3>
                                        <span class="card__tagline">Lorem ipsum dolor sit amet consectetur</span>
                                        <span class="card__status">1 hour ago</span>
                                    </div>
                                </div>
                                <p class="card__description">Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores, blanditiis?</p>
                            </div>
                        </a>
                    </li>
                    <li>
                        <a href="" class="card">
                            <img src="https://i.imgur.com/2DhmtJ4.jpg" class="card__image" alt="" />
                            <div class="card__overlay">
                                <div class="card__header">
                                    <svg class="card__arc" xmlns="http://www.w3.org/2000/svg"><path /></svg>
                                    <img class="card__thumb" src="https://i.imgur.com/sjLMNDM.png" alt="" />
                                    <div class="card__header-text">
                                        <h3 class="card__title">kim Cattrall</h3>
                                        <span class="card__status">3 hours ago</span>
                                    </div>
                                </div>
                                <p class="card__description">Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores, blanditiis?</p>
                            </div>
                        </a>
                    </li> */}
                </ul>
            </div>
            {/* <div class="center">
                <div class="article-card">
                    <div class="content">
                        <p class="date">April 12, 2023</p>
                        <p class="title">Retro Rumble!</p>
                    </div>
                    <img className='planetJumper' src={PlanetJumper} alt="Retro Rumble" />
                </div>
            </div> */}
        </>
    );
}

export default NonInteractive;

