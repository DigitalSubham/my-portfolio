import { ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const About = () => {
  return (
    <section id="about" className="py-20 bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">About Me</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-purple-600 to-pink-600 mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Get to know me better
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="relative rounded-2xl overflow-hidden shadow-xl h-96 group">
            <Image
              src="/shubham.png?height=600&width=800"
              alt="About Subham Kumar"
              width={800}
              height={600}
              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
              <div className="p-6">
                <h3 className="text-white text-xl font-bold">Subham Kumar</h3>
                <p className="text-gray-200">Full Stack Developer</p>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <h3 className="text-2xl font-bold">Who am I?</h3>
            <p className="text-gray-600 dark:text-gray-400">
              I'm a passionate Full Stack Developer with over 1.5 years of
              experience in building web applications. I specialize in
              JavaScript, React, Node.js, and modern web technologies.
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              My journey in web development started when I was in college, and
              since then, I've worked on various projects ranging from small
              business websites to complex enterprise applications.
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              When I'm not coding, you can find me hiking, reading, or
              experimenting with new technologies. I'm always eager to learn and
              grow in this ever-evolving field.
            </p>
            <div className="pt-4">
              <Link
                href="/resume.pdf"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition-colors shadow-lg hover:shadow-xl"
              >
                Download Resume
                <ExternalLink className="ml-2 w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
