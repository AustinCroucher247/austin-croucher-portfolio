// import ProfileNoBack from '../../assets-portfolio/ProfilePicNoBack.png'
import Header from '../Header/Header';
import './NonInteractive.scss'
import RetroRumble from '../../assets-portfolio/RetroNoBlue.jpg'
import PlanetJumper from '../../assets-portfolio/PlanetJumper.jpg'
import ArcadeMachine from '../../assets-portfolio/Arcade.avif'
import Astronaut from '../../assets-portfolio/SpaceAvatarWithWhite.jpg'
import React, { useState } from 'react';
import ProfilePic from '../../assets-portfolio/ProfilePic.jpg'



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
            <h1 className='about-me-text'>About Me</h1>
            <div className='text--profile--container'>
                <div class="wrapper">
                    <img src={ProfilePic} class="image--cover" />
                </div>
                <div className='about--me--text--container'>
                    <p className='about--me--text'>
                        My name is Austin Croucher and I am a graduate of both the Philosophy and History programs
                        at York University with a certificate in conflict resolution and dispute management. After
                        graduating I started moving up in the restaurant industry until I reached the position of General Manager.
                        After a few years in this position I realized I wanted to challenge myself more intellectually and given
                        my pre-existing interest in the tech industry, it seemed a shift into software engineering would be a good
                        fit. I made the decision to leave and pursued an
                    </p>
                    <p className='about--me--text'>
                        education in software engineering through BrainStation.
                        I believe that my educational background as well as my professional background will work together for a
                        seamless transition into the tech industry. My interpersonal skills learned throughout my time in the
                        restaurant industry will make working as part of a team effortless and on top of this my logical and
                        analytical thought processes formed throughout my philosophy degree will transition well into programming
                        given the innate logical nature of coding.
                    </p>
                </div>
            </div>
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            v
            <div className='card--container--non--interactive'>
                <h1 className='projects-text'>Projects</h1>
                <ul class="cards">
                    <div className='card1-nonInteractive'>
                        <li>
                            <a href="https://calm-dasik-5c6551.netlify.app/" class="card" onClick={(e) => handleCardClick(e, 'https://calm-dasik-5c6551.netlify.app/')}>
                                <img className='card--img--retrorumble' src={RetroRumble} alt="" />
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
                    </div>
                    <li>
                        <a href="" class="card">
                            <img className='card--img--planetJumper' src={PlanetJumper} class="card__image" alt="" />
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

