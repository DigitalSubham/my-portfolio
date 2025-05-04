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
import WorkExperience from "@/components/portfolio/WorkExperience";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-900 text-gray-800 dark:text-gray-100">
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <Hero />

      {/* About Section */}
      <About />

      {/* Work Experience Section */}
      <section id="experience" className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Work Experience
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-purple-600 to-pink-600 mx-auto mb-6"></div>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              My professional journey
            </p>
          </div>

          <WorkExperience />
        </div>
      </section>

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
