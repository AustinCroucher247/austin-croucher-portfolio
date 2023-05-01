import './Header.scss'
import { Link } from 'react-router-dom';
function Header() {
    const handleNavClick = () => {
        document.body.classList.toggle('shifted');
    };

    return (
        <>
            <div>
                <nav>
                    <div class="navbar">
                        <div class="container nav-container">
                            <input class="checkbox" type="checkbox" name="" id="" onClick={handleNavClick} />
                            <div class="hamburger-lines">
                                <span class="line line1"></span>
                                <span class="line line2"></span>
                                <span class="line line3"></span>
                            </div>
                            <div class="logo">
                                <h1>Austin Croucher</h1>
                                <h1>Full-Stack Developer</h1>
                            </div>
                            <div class="menu-items">

                                <Link to={'/'}> <li><a href="/"> Go Home</a></li></Link>
                                {/* <li><a href="/">about</a></li>
                                <li><a href="/">blogs</a></li>
                                <li><a href="/">portfolio</a></li>
                                <li><a href="/">contact</a></li> */}
                            </div>
                        </div>
                    </div>
                </nav>
            </div>
        </>
    );
}

export default Header;