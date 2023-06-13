import './LandingPage.scss'
import ProfilePic from '../../assets-portfolio/ProfilePic.jpg'
import GitHub from '../../assets-portfolio/GitHub-logo.png'
import { Link } from 'react-router-dom';
import LinkedIn from '../../assets-portfolio/LinkedIn.png'
import gmail from '../../assets-portfolio/Gmail.png'
import github from '../../assets-portfolio/gitHub-removebg-preview.png'
// import coding1 from '../../assets-portfolio/coding1.png'


function LandingPage() {
    const openGitHubProfile = () => {
        window.open("https://github.com/AustinCroucher247", "_blank");
    }

    return (
        <>
            <body className='landing-page'>
                <div className="landing-page-container">
                    <h1 className='landing-page-text'>Hello World! My Name is <span className='landing-page-text-name'> Austin Croucher</span></h1>
                    <div className='test'>
                        <div className='profile-picture-container'>
                            <img className='profile-picture-landing-page' src={ProfilePic} alt="Profile" />
                            <img
                                className='github-logo'
                                src={GitHub}
                                alt="GitHub Profile"
                                onClick={openGitHubProfile}
                                style={{ cursor: 'pointer' }}
                            />
                        </div>
                        <div className="profile-picture-back"></div>
                    </div>
                    <hr className='line-under-picture' />
                </div>
                <div className="container">
                    <Link to={'./NonInteractive'}>
                        <button className="button" style={{ '--color': '#EAC055' }}>
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                            Non-Interactive Portfolio
                        </button>
                    </Link>

                    {/* <Link to={'./AboutMe'}>
                        <button className="button" style={{ '--color': '#EAC055' }}>
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                            About Me
                        </button>
                    </Link> */}
                    <Link to={'./Interactive'}>
                        <button className="button" style={{ '--color': '#EAC055' }}>
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                            Interactive Portfoilio
                        </button>
                    </Link>

                </div>
                {/* <div className='coding--carousel'>
                    <img className='coding--picture' src={coding1} alt="" />
                </div> */}
                <div className='container--whole--landing'>
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
            </body>

        </>
    );
}

export default LandingPage;