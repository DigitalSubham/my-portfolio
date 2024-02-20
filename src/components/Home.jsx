import React from "react";
import HeroImage from "../assets/heroImage.jpg";
import { MdArrowRight } from "react-icons/md";
import { Link } from "react-scroll";

const Home = () => {
  return (
    <div
      name="home"
      className="h-screen w-full bg-gradient-to-b from-gray-800 via-black to-gray-600"
    >
      <div className="max-w-screen-lg mx-auto flex flex-col items-center justify-center h-full px-4 md:flex-row">
        <div className="flex flex-col justify-center h-full">
          <h2 className="text-4xl sm:text-7xl font-bold text-white">
            I'm a full Stack Developer
          </h2>
          <p className="text-gray-500 py-4 max-w-md">
            Hey, I'm Subham Kumar a fresher and enthusiastic{" "}
            <span className="text-green-400 font-bold">
              full-stack developer
            </span>{" "}
            exploring the world of{" "}
            <span className="text-green-400 font-bold">blockchain</span> . When
            not coding, I share tech insights as a{" "}
            <span className="text-green-400 font-bold">writer and blogger</span>{" "}
          </p>
          <div className="w-fit px-6 py-3 my-2 flex items-center rounded-md ">
            <div className="relative inline-flex  group">
              <div className="absolute transitiona-all duration-1000 opacity-70 -inset-px bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] rounded-xl blur-lg group-hover:opacity-100 group-hover:-inset-1 group-hover:duration-200 animate-tilt"></div>
              <Link
                to="portfolio"
                smooth
                duration={500}
                title="Get quote now"
                className="relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-gray-900 font-pj rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                role="button"
              >
                PortFolio{" "}
                <span className="group-hover:rotate-90 duration-300">
                  <MdArrowRight size={40} className="ml-1" />
                </span>
              </Link>
            </div>
          </div>
        </div>
        <div className="">
          <img
            className="rounded-3xl mx-auto  mr-10 m-2 md:w-[350px] animate-hero-image"
            src={HeroImage}
            alt="my-pic"
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
