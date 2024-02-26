import Contact from "./Contact";
import About from "./components/About";
import Blogs from "./components/Blogs";
import Experience from "./components/Experience";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import Portfolio from "./components/Portfolio";
import SocialLinks from "./components/SocialLinks";

function App() {
  return (
    <>
      <Navbar />
      <Home />
      <About />
      <Portfolio />
      <Blogs />
      <Experience />
      <Contact />
      <SocialLinks />
    </>
  );
}

export default App;
