import LandingPage from "./Components/LandingPage/LandingPage";
import './global.scss'
import NonInteractive from "./Components/NonInteractive/NonInteractive";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AboutMe from "./Components/AboutMe/AboutMe";
import Interactive from "./Components/AboutMe/AboutMe";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/nonInteractive" element={<NonInteractive />} />
        <Route path="/AboutMe" element={<AboutMe />} />
        <Route path="/Interactive" element={<Interactive />} />

      </Routes>
    </BrowserRouter>

  );
}

export default App;