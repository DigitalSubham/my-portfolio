import Link from "next/link";
import { Github, Linkedin, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-8 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link
              href="/"
              className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600"
            >
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-2">
                <span className="text-green-500">{`<`}</span>{" "}
                <span>{`Subham Kumar`} </span>
                <span className="text-green-500">{`/>`}</span>
              </span>
            </Link>
          </div>
          <div className="flex space-x-6">
            <Link
              href="https://github.com/DigitalSubham"
              target="_blank"
              className="text-gray-600 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 transition-colors"
            >
              <Github className="w-5 h-5" />
              <span className="sr-only">GitHub</span>
            </Link>
            <Link
              href="https://www.linkedin.com/in/digital-subham-kumar/"
              target="_blank"
              className="text-gray-600 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 transition-colors"
            >
              <Linkedin className="w-5 h-5" />
              <span className="sr-only">LinkedIn</span>
            </Link>
            <Link
              href="mailto:shubhamkr354@gmail.com/"
              className="text-gray-600 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 transition-colors"
            >
              <Mail className="w-5 h-5" />
              <span className="sr-only">Email</span>
            </Link>
          </div>
          <div className="mt-4 md:mt-0 text-sm text-gray-600 dark:text-gray-400">
            © {new Date().getFullYear()} Subham Kumar. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
