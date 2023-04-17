import './LandingPage.scss'
import ProfilePic from '../../assets-portfolio/ProfilePic.jpg'

function LandingPage() {


    return (
        <>
            <body className='landing-page'>
                <div className="landing-page-container">
                    <h1 className='landing-page-text'>Hello World! My Name is <span className='landing-page-text-name'> Austin Croucher</span></h1>
                    <img className='profile-picture-landing-page' src={ProfilePic} alt="Profile" />
                    <hr className='line-under-picture' />
                </div>
                <div className="container">
                    <a className="button" href="#" style={{ '--color': '#EAC055' }}>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        Non-Interactive Portfolio
                    </a>
                    <a className="button" href="#" style={{ '--color': '#EAC055' }}>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        About Me
                    </a>
                    <a className="button" href="#" style={{ '--color': '#EAC055' }}>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        Interactive Portfoilio
                    </a>
                </div>
            </body>

        </>
    );
}

export default LandingPage;