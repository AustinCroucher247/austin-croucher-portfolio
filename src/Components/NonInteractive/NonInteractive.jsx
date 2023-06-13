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
import github from '../../assets-portfolio/gitHub-removebg-preview.png'
import DPSC from '../../assets-portfolio/WoodshopThumbnail.png'
import DPSCLogo from '../../assets-portfolio/logo.png'



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
                                I'm Austin Croucher, a unique fusion of Philosophy and History graduate from York University,
                                seasoned restaurant industry professional turned aspiring software engineer. Passionate about life's complexities,
                                I've mastered the art of conflict resolution and dispute management, honed the skills of general management in the
                                culinary world, and navigated the intellectual rigors of software engineering at BrainStation.

                                My journey is unique, but it's the testament to my adaptability and thirst for knowledge. Transitioning
                                from the restaurant industry to software engineering may seem unusual, but it was a challenge I faced head-on.
                                This highlights my aptitude to learn quickly and adapt, as demonstrated by my successful completion of the intensive
                                bootcamp at BrainStation where I was able to aquire a diverse set of skills including HTML, CSS, JavaScript, React, Angular, Vue, Node,
                                Express, PHP, SASS, Git, MySQL, and Agile methodology, with a proficient command of JIRA..
                                <br />                                <br />
                                <br />
                                <br />
                                <p>
                                    I believe my diverse background will be a valuable asset to any tech team. Throughout my time managing restaurants,
                                    I've fostered a knack for team collaboration, empathy, and dynamic problem-solving - skills that I believe are as crucial
                                    in software development as they are in the restaurant industry.

                                    Furthermore, my philosophical training instilled in me a logical and analytical mindset, aligning naturally with
                                    the procedural logic required in programming. I am confident that my unique combination of experience, skills, and intellectual curiosity equips me to make significant contributions to the tech world.

                                    In essence, I am more than my resume. I am a story of curiosity, intellectual growth, adaptability, and a strong
                                    determination. I'm excited to bring these qualities to your team, to learn from you, and to solve the complexities
                                    of the tech industry together. </p>

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
                                                    <br></br>
                                                    <span class="card__status">React, socket.io, HTML5 Canvas/Javascript, Node, Express, REST API, MySQL</span>

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
                                                <br></br>
                                                <span class="card__status">React, REST API, Node, Express, Javascript</span>
                                            </div>
                                        </div>
                                        <p class="card__description">An interactive space education tool where users can flip between different planets and use spacebar to make the astronaut jump relative to the currently selected planets gravity</p>
                                    </div>
                                </a>
                            </li>
                            <li>
                                <a href="https://croucherwoodshop.netlify.app/" class="card" onClick={(e) => handleCardClick(e, 'https://croucherwoodshop.netlify.app/')}>
                                    <img className='card--img--planetJumper' src={DPSC} class="card__image" alt="" />
                                    <div class="card__overlay">
                                        <div class="card__header">
                                            <svg class="card__arc" xmlns="http://www.w3.org/2000/svg"><path /></svg>
                                            <img class="card__thumb" src={DPSCLogo} alt="" />
                                            <div class="card__header-text">
                                                <h3 class="card__title">Croucher Woodshop</h3>
                                                <span class="card__status">May 15th, 2023</span>
                                                <br></br>
                                                <span class="card__status">React, CMS -- Strapi, Node, Express, Javascript</span>
                                            </div>
                                        </div>
                                        <p class="card__description">A portfolio website built in React utilizing Strapi CMS for backend content management. Client of project can upload and delete pictures themsevles.</p>
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

                    <div className='icons'>
                        <div className='icons--row'>
                            <a className='icons--individual' href="https://www.linkedin.com/in/austincroucher/">
                                <img className='linkedin--contact' src={LinkedIn} alt="" />
                            </a>
                            <a className='icons--individual' href="mailto:austin.croucher@gmail.com">
                                <img className='gmail--contact' src={gmail} alt="" />
                            </a>
                            <a className='icons--individual' href="https://github.com/AustinCroucher247">
                                <img className='git--contact' src={github} alt="" />
                            </a>
                        </div>
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

