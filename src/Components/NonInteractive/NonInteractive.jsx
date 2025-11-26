import React, { useState } from "react";
import "./NonInteractive.scss";

import Header from "../Header/Header";
import { Element, scroller } from "react-scroll";

// Images
import ProfilePic from "../../assets-portfolio/ProfilePic.jpg";

import HTML from "../../assets-portfolio/html-5.png";
import CSS from "../../assets-portfolio/css-3.png";
import JavaScript from "../../assets-portfolio/js.png";
import ReactImg from "../../assets-portfolio/react.png";
import Node from "../../assets-portfolio/nodejs.png";
import SASS from "../../assets-portfolio/sass.png";
import Git from "../../assets-portfolio/git.png";
import MySQL from "../../assets-portfolio/mysql.png";
import cms from "../../assets-portfolio/headless-cms-bnr-img.png";
import strapi from "../../assets-portfolio/strapi.png";
import sanity from "../../assets-portfolio/sanity.svg";
import php from "../../assets-portfolio/PHP.png";
// import tailwind from "../../assets-portfolio/tailwind-white1.png";

import RetroRumble from "../../assets-portfolio/RetroNoBlue.jpg";
import PlanetJumper from "../../assets-portfolio/PlanetJumper.jpg";
import DPSC from "../../assets-portfolio/WoodshopThumbnail.png";

// import ArcadeMachine from "../../assets-portfolio/Arcade.avif";
// import Astronaut from "../../assets-portfolio/SpaceAvatarWithWhite.jpg";
// import DPSCLogo from "../../assets-portfolio/logo.png";

// import DownArrow from "../../assets-portfolio/downarrow.png";

import LinkedIn from "../../assets-portfolio/LinkedIn.png";
import gmail from "../../assets-portfolio/Gmail.png";
import github from "../../assets-portfolio/gitHub-removebg-preview.png";

// Videos
import retrovideodemo from "../../assets-portfolio/RetroRumbleVid.mp4";
import planetdemo from "../../assets-portfolio/planetVideo.mp4";
import woodshopdemo from "../../assets-portfolio/woodshopVideo.mp4";

// Modal + ReactPlayer
import Modal from "react-modal";
import ReactPlayer from "react-player";

Modal.setAppElement("#root");

function NonInteractive() {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [videoURL, setVideoURL] = useState("");

  const openModal = (url) => {
    setVideoURL(url);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const scrollTo = (target) => {
    scroller.scrollTo(target, {
      duration: 800,
      smooth: "easeInOutQuart",
    });
  };

  return (
    <>
      <Header />

      {/* =============================
          HERO SECTION
      ============================= */}
      <section className="hero">
        <h1 className="hero-title">Austin Croucher</h1>
        <p className="hero-subtitle">Full-Stack Developer & Problem Solver</p>

        <div
          className="hero-profile"
          onClick={() => scrollTo("about")}
        >
          <img src={ProfilePic} alt="Profile" />
        </div>

        <div className="hero-tags">
          <span>JavaScript</span>
          <span>React</span>
          <span>Node</span>
          <span>PHP</span>
          <span>MySQL</span>
          <span>Full-Stack</span>
        </div>

        {/* <img
          src={DownArrow}
          alt="arrow"
          className="hero-arrow"
          onClick={() => scrollTo("about")}
        /> */}
      </section>

      {/* =============================
          ABOUT SECTION
      ============================= */}
      <Element name="about">
        <section className="about">
          <div className="about-wrapper">
            <div className="about-images">
              <div><img src={ProfilePic} alt="" /></div>
              <div><img src={RetroRumble} alt="" /></div>
              <div><img src={PlanetJumper} alt="" /></div>
              <div><img src={DPSC} alt="" /></div>
            </div>

            <div className="about-text">
              <p>
                I'm Austin Croucher, a former restaurant GM turned software
                developer. My background blends philosophy, leadership,
                conflict-resolution, and real-world team coordination with modern
                software engineering.
              </p>

              <p>
                After completing BrainStation’s development bootcamp, I dove
                into full-stack work: React, Node, Express, MySQL, PHP, CMS
                systems, and agency-level production projects.
              </p>

              <p>
                I take pride in building clean, scalable systems — from contests
                and rebates to learning modules, dashboards, and full CMS-driven
                websites.
              </p>
            </div>
          </div>
        </section>
      </Element>

      {/* =============================
          SKILLS SECTION (TIMELINE)
      ============================= */}
      <Element name="skills">
        <section className="skills">
          <h2 className="skills-title">Skills</h2>

          <div className="skills-list">
            <div className="skill-item">
              <img src={HTML} alt="HTML" />
              <span>HTML5</span>
            </div>

            <div className="skill-item">
              <img src={CSS} alt="CSS" />
              <span>CSS3</span>
            </div>

            <div className="skill-item">
              <img src={JavaScript} alt="JS" />
              <span>JavaScript</span>
            </div>

            <div className="skill-item">
              <img src={ReactImg} alt="React" />
              <span>React</span>
            </div>

            <div className="skill-item">
              <img src={Node} alt="Node" />
              <span>Node & Express</span>
            </div>

            <div className="skill-item">
              <img src={MySQL} alt="MySQL" />
              <span>MySQL</span>
            </div>

            <div className="skill-item">
              <img src={php} alt="PHP" />
              <span>PHP</span>
            </div>

            <div className="skill-item">
              <img src={Git} alt="Git" />
              <span>Git & Version Control</span>
            </div>

            <div className="skill-item">
              <img src={cms} alt="CMS" />
              <span>Headless CMS</span>
            </div>

            <div className="skill-item">
              <img src={strapi} alt="Strapi" />
              <span>Strapi</span>
            </div>

            <div className="skill-item">
              <img src={sanity} alt="Sanity" />
              <span>Sanity</span>
            </div>

            <div className="skill-item">
              <img src={SASS} alt="SASS" />
              <span>SASS</span>
            </div>
          </div>
        </section>
      </Element>

      {/* =============================
          PROJECTS — HORIZONTAL SCROLL
      ============================= */}
      <Element name="projects">
        <section className="projects">
          <h2 className="projects-title">Projects</h2>

          <div className="projects-scroll">

            {/* Retro Rumble */}
            <div className="project-card">
              <img src={RetroRumble} alt="" className="project-img" />
              <div className="project-info">
                <h3>Retro Rumble</h3>
                <p>
                  A multiplayer retro gaming platform featuring Space Invaders
                  and Tetris with leaderboards.
                </p>
                <button onClick={() => openModal(retrovideodemo)}>
                  Watch Demo
                </button>
              </div>
            </div>

            {/* Planet Jumper */}
            <div className="project-card">
              <img src={PlanetJumper} alt="" className="project-img" />
              <div className="project-info">
                <h3>Planet Jumper</h3>
                <p>
                  An interactive space education game adjusting gravity based on
                  planets.
                </p>
                <button onClick={() => openModal(planetdemo)}>
                  Watch Demo
                </button>
              </div>
            </div>

            {/* Woodshop */}
            <div className="project-card">
              <img src={DPSC} alt="" className="project-img" />
              <div className="project-info">
                <h3>Croucher Woodshop</h3>
                <p>
                  A clean portfolio website powered by a Strapi CMS backend for
                  easy content management.
                </p>
                <button onClick={() => openModal(woodshopdemo)}>
                  Watch Demo
                </button>
              </div>
            </div>
          </div>
        </section>
      </Element>

      {/* =============================
          CONTACT — TILE GRID
      ============================= */}
      <Element name="contact">
        <section className="contact">
          <h2 className="contact-title">Contact</h2>

          <div className="contact-tiles">
            <a
              className="contact-tile"
              href="https://www.linkedin.com/in/austincroucher/"
              target="_blank"
              rel="noreferrer"
            >
              <img src={LinkedIn} alt="LinkedIn" />
              <span>LinkedIn</span>
            </a>

            <a className="contact-tile" href="mailto:austin.croucher@gmail.com">
              <img src={gmail} alt="Gmail" />
              <span>Email</span>
            </a>

            <a
              className="contact-tile"
              href="https://github.com/AustinCroucher247"
              target="_blank"
              rel="noreferrer"
            >
              <img src={github} alt="GitHub" />
              <span>GitHub</span>
            </a>
          </div>
        </section>
      </Element>

      {/* =============================
          VIDEO MODAL
      ============================= */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className="modal-video"
        overlayClassName="modal-overlay"
      >
        <ReactPlayer
          url={videoURL}
          playing
          controls
          width="100%"
          height="100%"
        />
        <button className="modal-close" onClick={closeModal}>
          Close
        </button>
      </Modal>
    </>
  );
}

export default NonInteractive; 
