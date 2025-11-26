import "./LandingPage.scss";
import ProfilePic from "../../assets-portfolio/ProfilePic.jpg";
import { Link } from "react-router-dom";
import LinkedIn from "../../assets-portfolio/LinkedIn.png";
import gmail from "../../assets-portfolio/Gmail.png";
import github from "../../assets-portfolio/gitHub-removebg-preview.png";

function LandingPage() {
  return ( 
    <div className="landing">
      <div className="landing-hero">
        <div className="landing-photo"> 
          <img src={ProfilePic} alt="Austin Croucher" />
        </div>

        <h1 className="landing-title">
          Hello World! I'm <span>Austin Croucher</span>
        </h1>

        <p className="landing-subtitle">
          Full-Stack Developer • Problem Solver • Builder
        </p>

        <div className="landing-buttons">
          <Link to="/NonInteractive" className="landing-btn">
            Non-Interactive Portfolio
          </Link>

          <Link to="/Interactive" className="landing-btn secondary">
            Interactive Portfolio
          </Link>
        </div>
      </div>

      <div className="landing-contact">
        <h2>Contact</h2>

        <div className="contact-grid">
          <a href="https://www.linkedin.com/in/austincroucher/" target="_blank">
            <img src={LinkedIn} alt="LinkedIn" />
          </a>
          <a href="mailto:austin.croucher@gmail.com">
            <img src={gmail} alt="Email" />
          </a>
          <a href="https://github.com/AustinCroucher247" target="_blank">
            <img src={github} alt="GitHub" />
          </a>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
