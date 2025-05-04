import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Github, Linkedin, Mail, ChevronDown } from "lucide-react";
const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 flex items-center min-h-screen">
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-[40%] -right-[60%] w-[140%] h-[140%] rounded-full bg-gradient-to-br from-purple-50/40 to-pink-50/40 dark:from-purple-900/10 dark:to-pink-900/10 blur-3xl"></div>
        <div className="absolute -bottom-[40%] -left-[60%] w-[140%] h-[140%] rounded-full bg-gradient-to-br from-blue-50/40 to-cyan-50/40 dark:from-blue-900/10 dark:to-cyan-900/10 blur-3xl"></div>
      </div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 text-center md:text-left">
            <div className="space-y-2">
              <h2 className="text-2xl font-medium text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                {`Hello, I'm`}
              </h2>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                <span className="block">Subham Kumar</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mt-2">
                Full Stack Developer
              </p>
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-lg mx-auto md:mx-0">
              {`I build exceptional digital experiences with modern technologies.
              Focused on creating intuitive and high-performance web
              applications.`}
            </p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <Link
                href="#contact"
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition-all shadow-lg hover:shadow-xl"
              >
                Contact Me
              </Link>
              <Link
                href="#projects"
                className="px-6 py-3 border border-gray-300 dark:border-gray-700 hover:border-purple-600 dark:hover:border-purple-400 rounded-lg transition-colors"
              >
                View My Work
              </Link>
            </div>
            <div className="flex gap-6 justify-center md:justify-start">
              <Link
                href="https://github.com/DigitalSubham"
                target="_blank"
                className="text-gray-600 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 transition-colors"
              >
                <Github className="w-6 h-6" />
                <span className="sr-only">GitHub</span>
              </Link>
              <Link
                href="https://www.linkedin.com/in/subham-kr/"
                target="_blank"
                className="text-gray-600 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 transition-colors"
              >
                <Linkedin className="w-6 h-6" />
                <span className="sr-only">LinkedIn</span>
              </Link>
              <Link
                href="mailto:shubhamkr354@gmail.com/"
                className="text-gray-600 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 transition-colors"
              >
                <Mail className="w-6 h-6" />
                <span className="sr-only">Email</span>
              </Link>
            </div>
          </div>
          <div className="relative mx-auto md:ml-auto md:mr-0 w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 animate-pulse"></div>
            <div className="absolute inset-4 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-xl">
              <Image
                src="/avatar.png?height=400&width=400"
                alt="Subham Kumar"
                width={400}
                height={400}
                className="object-cover w-full h-full"
                priority
              />
            </div>
          </div>
        </div>
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <Link
            href="#about"
            className="flex flex-col items-center text-gray-500 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400"
          >
            <span className="text-sm mb-1">Scroll Down</span>
            <ChevronDown className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
