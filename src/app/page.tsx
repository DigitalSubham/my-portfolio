import Hero from "@/components/portfolio/Hero";
import About from "@/components/portfolio/About";
import Projects from "@/components/portfolio/Projects";
import Skills from "@/components/portfolio/Skills";
import Blogs from "@/components/portfolio/Blogs";
import Notes from "@/components/portfolio/Notes";
import Certificates from "@/components/portfolio/Certificates";
import Contact from "@/components/portfolio/Contact";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import WorkExperience from "@/components/portfolio/WorkExperience";
import SectionHeading from "@/components/portfolio/SectionHeading";
import { getPortfolioData } from "@/lib/db";

export default async function Home() {
  const data = await getPortfolioData();

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f7f7f5] text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      <Navbar site={data.site} navItems={data.navItems} />
      <Hero hero={data.hero} socials={data.socials} />
      <About about={data.about} />

      {data.workExperiences.length > 0 && (
        <section id="experience" className="border-y border-gray-200 bg-white py-24 dark:border-gray-800 dark:bg-gray-950">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="Experience"
              title="Products I have helped ship"
              description="A practical timeline of production work across enterprise ERP, government mobile apps, education platforms, dashboards, and SEO-sensitive React apps."
            />
            <WorkExperience workExperiences={data.workExperiences} />
          </div>
        </section>
      )}

      <Projects projects={data.projects} />
      <Skills groups={data.skillGroups} delivery={data.deliveryStrengths} />
      <Notes />
      <Blogs posts={data.blogPosts} />
      <Certificates certificates={data.certificates} />
      <Contact channels={data.contactChannels} />
      <Footer site={data.site} socials={data.socials} />
    </div>
  );
}
