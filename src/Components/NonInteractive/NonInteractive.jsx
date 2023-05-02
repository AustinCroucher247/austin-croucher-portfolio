// import ProfileNoBack from '../../assets-portfolio/ProfilePicNoBack.png'
import Header from '../Header/Header';
import './NonInteractive.scss'
import RetroRumble from '../../assets-portfolio/RetroNoBlue.jpg'
import PlanetJumper from '../../assets-portfolio/PlanetJumper.jpg'
import ArcadeMachine from '../../assets-portfolio/Arcade.avif'
import Astronaut from '../../assets-portfolio/SpaceAvatarWithWhite.jpg'
import React, { useState } from 'react';
import { Element } from 'react-scroll';
import { useInView } from 'react-intersection-observer';
import HTML from '../../assets-portfolio/html-5.png'
import CSS from '../../assets-portfolio/css-3.png'
import JavaScript from '../../assets-portfolio/js.png'
import Node from '../../assets-portfolio/nodejs.png'
import ReactImg from '../../assets-portfolio/react.png'
import SASS from '../../assets-portfolio/sass.png'
import MySQL from '../../assets-portfolio/mysql.png'
import Git from '../../assets-portfolio/git.png'
import ProfilePic from '../../assets-portfolio/ProfilePic.jpg'
import { scroller } from 'react-scroll';
import DownArrow from '../../assets-portfolio/downarrow.png'
import LinkedIn from '../../assets-portfolio/LinkedIn.png'
import gmail from '../../assets-portfolio/Gmail.png'
import github from '../../assets-portfolio/gitHub.png'



function NonInteractive() {
    const [ref, inView] = useInView({ threshold: 0.5 });


    // const handleSubmit = (event) => {
    //     event.preventDefault();

    //     // Get form data
    //     const name = document.getElementById("name").value;
    //     const email = document.getElementById("email").value;
    //     const message = document.getElementById("message").value;

    //     // Prepare data to send
    //     const data = {
    //         name,
    //         email,
    //         message
    //     };

    //     // Make an HTTP request to your server-side script (e.g., PHP)
    //     fetch("send-email.php", {
    //         method: "POST",
    //         headers: {
    //             "Content-Type": "application/json"
    //         },
    //         body: JSON.stringify(data)
    //     })
    //         .then((response) => response.json())
    //         .then((response) => {
    //             if (response.success) {
    //                 alert("Message sent successfully!");
    //             } else {
    //                 alert("Error: " + response.error);
    //             }
    //         })
    //         .catch((error) => {
    //             console.error("Error:", error);
    //         });
    // };

    const handleProfilePicClick = () => {
        scroller.scrollTo("section2", {
            duration: 800,
            delay: 0,
            smooth: "easeInOutQuart",
        });
    };
    const handleArrowClick = () => {
        scroller.scrollTo("projects", {
            duration: 800,
            delay: 0,
            smooth: "easeInOutQuart",
        });
    };


    const handleArrowClickContact = () => {
        scroller.scrollTo("contact", {
            duration: 800,
            delay: 0,
            smooth: "easeInOutQuart",
        });
    };
    // eslint-disable-next-line
    const [showModal, setShowModal] = useState(false);
    const handleCardClick = (e, url) => {
        e.preventDefault();
        setShowModal(true);
        // setTimeout(() => {
        window.location.href = url;
        // }, 1000);
    };
    return (
        <>  <div className='header--container'>
            <Header />
        </div>
            <h1 className='about-me-text'>console.log(About_Me)</h1>
            <div className='text--profile--container'>
                <div class="wrapper">
                    <img
                        alt='profile'
                        src={ProfilePic}
                        class="image--cover"
                        onClick={handleProfilePicClick}
                    />
                    <h1 className='clickProfile'>Click Profile Picture!</h1>
                </div>

                <Element name="section2">

                    <div className='section2'>
                        <div className='about--me--text--container'>
                            <p className='about--me--text'>
                                My name is Austin Croucher and I am a graduate of both the Philosophy and History programs
                                at York University with a certificate in conflict resolution and dispute management. After
                                graduating I started moving up in the restaurant industry until I reached the position of General Manager.
                                After a few years in this position I realized I wanted to challenge myself more intellectually and given
                                my pre-existing interest in the tech industry, it seemed a shift into software engineering would be a good
                                fit. I made the decision to leave and pursued an
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
                    <div>
                        <h1 className='about-me-text'>
                            Skillsets
                        </h1>
                        <div className='skill--icon--container'>
                            <img src={HTML} className='skill--image' alt='HTML' />
                            <img src={CSS} className='skill--image' alt='CSS' />
                            <img src={JavaScript} className='skill--image' alt='Javascript' />
                            <img src={ReactImg} className='skill--image' alt='React' />
                            <img src={Node} className='skill--image' alt='Node' />
                            <img src={SASS} className='skill--image' alt='SASS' />
                            <img src={Git} className='skill--image' alt='Git' />
                            <img src={MySQL} className='skill--image' alt='MySQL' />

                        </div>
                        <div className='arrow--container'>
                            <img src={DownArrow} className='down--arrow' alt="" onClick={handleArrowClick} />
                        </div>
                    </div>
                </Element>

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


            </div>
            <Element name='projects'>
                <div ref={ref} className={`projects-container ${inView ? 'fade-in' : ''}`}>

                    <h1 className='projects-text'>Projects</h1>

                    <div className='card--container--non--interactive'>
                        <ul class="cards">
                            <div className='card1-nonInteractive'>
                                <li>
                                    <a href="https://retrorumble.netlify.app/" class="card" onClick={(e) => handleCardClick(e, 'https://retrorumble.netlify.app/')}>
                                        <img className='card--img--retrorumble' src={RetroRumble} alt="" />
                                        <div class="card__overlay">
                                            <div class="card__header">
                                                <svg class="card__arc" xmlns="http://www.w3.org/2000/svg"><path /></svg>
                                                <img class="card__thumb" src={ArcadeMachine} alt="" />
                                                <div class="card__header-text">
                                                    <h3 class="card__title">Retro Rumble</h3>
                                                    <span class="card__status">April 12, 2023</span>
                                                </div>
                                                <div>
                                                </div>
                                            </div>
                                            <p class="card__description">Retro Rumble, features classic arcade games like Space Invaders and Tetris. The Website includes leaderboard functionality so you can compete against other gamers from around the world to see who's the best.</p>
                                        </div>
                                    </a>
                                </li>
                            </div>
                            <li>
                                <a href="https://planetjumper.netlify.app/" class="card" onClick={(e) => handleCardClick(e, 'https://planetjumper.netlify.app/')}>
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
                        </ul>
                    </div>
                </div>
            </Element>
            <div className='arrow--container'>
                <img src={DownArrow} className='down--arrow' alt="" onClick={handleArrowClickContact} />
            </div>
            <Element name='contact'>
                <div className='container--whole'>
                    <div className='contact--container'>
                        <h1 className='contact--text'>Contact Me</h1>
                    </div>

                    <div>
                        <a href="https://www.linkedin.com/in/austincroucher/">
                            <img className='linkedin--contact' src={LinkedIn} alt="" />
                        </a>
                        <a href="mailto:austin.croucher@gmail.com">
                            <img className='gmail--contact' src={gmail} alt="" />
                        </a>
                        <a href="https://github.com/AustinCroucher247">
                            <img className='linkedin--contact' src={github} alt="" />
                        </a>
                    </div>
                </div>

                {/* <div className='form--container'>
                    <form id="contact-form" onSubmit={handleSubmit}>
                        <label htmlFor="name">Name:</label>
                        <input type="text" id="name" name="name" required />

                        <label htmlFor="email">Email:</label>
                        <input type="email" id="email" name="email" required />

                        <label htmlFor="message">Message:</label>
                        <textarea id="message" name="message" required></textarea>

                        <button type="submit">Submit</button>
                    </form>
                </div> */}
            </Element>

        </>
    );
}

export default NonInteractive;

