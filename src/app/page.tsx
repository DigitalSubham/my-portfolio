import Hero from "@/components/portfolio/Hero";
import About from "@/components/portfolio/About";
import Projects from "@/components/portfolio/Projects";
import Skills from "@/components/portfolio/Skills";
import Blogs from "@/components/portfolio/Blogs";
import Certificates from "@/components/portfolio/Certificates";
import Notes from "@/components/portfolio/Notes";
import Contact from "@/components/portfolio/Contact";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-900 text-gray-800 dark:text-gray-100">
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <Hero />

      {/* About Section */}
      <About />

      {/* Projects Section */}
      <Projects />

      {/* Skills Section - Completely Redesigned */}
      <Skills />

      {/* Blog Section - New */}
      <Blogs />

      {/* Certificates Section - New */}
      <Certificates />

      {/* Notes Section - New */}
      <Notes />

      {/* Contact Section */}
      <Contact />

      {/* Footer */}
      <Footer />
    </div>
  );
}
