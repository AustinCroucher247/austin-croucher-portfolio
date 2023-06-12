import ProfilePic from '../../assets-portfolio/ProfilePic.jpg'
import './LandingPage2.scss'


function LandingPage2() {
    return (
        <>
            <div className='landing--top--l2'>
                <h1 className='landing-page-text--l2'>Hello World! My Name is <span className='landing-page-text-name'> Austin Croucher</span></h1>
                <img className='profile--pic--l2' src={ProfilePic} alt="profile" />
            </div>
            <div className='button--container--l2'>
                {/* <button> </button> */}
            </div>
        </>
    );
}

export default LandingPage2;