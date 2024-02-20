import React, { useState } from "react";
import streamSage from "../assets/portfolio/streamSage.png";
import youtube_Clone from "../assets/portfolio/youtube_Clone.svg";
import installNode from "../assets/portfolio/installNode.jpg";
import navbar from "../assets/portfolio/navbar.jpg";
import reactParallax from "../assets/portfolio/reactParallax.jpg";
import reactSmooth from "../assets/portfolio/reactSmooth.jpg";
import reactWeather from "../assets/portfolio/reactWeather.jpg";

const Portfolio = () => {
  const [videoSrc, setVideoSrc] = useState(""); // State to control video source

  const portfolios = [
    {
      id: 1,
      src: streamSage,
      code: "https://github.com/DigitalSubham/StreamSage-AI-Movie-Explorer",
      demo: "https://stream-sage-ai-movie-explorer.vercel.app/",
      vidsrc:
        "https://res.cloudinary.com/donutatdq/video/upload/v1708458720/Untitled_design_dciay1.mp4",
    },
    {
      id: 2,
      src: youtube_Clone,
    },
    {
      id: 3,
      src: navbar,
    },
    {
      id: 4,
      src: reactSmooth,
    },
    {
      id: 5,
      src: installNode,
    },
    {
      id: 6,
      src: reactWeather,
    },
    {
      id: 7,
      src: reactSmooth,
    },
    {
      id: 8,
      src: installNode,
    },
    {
      id: 9,
      src: reactWeather,
    },
  ];

  function handleVideo(vidSrc) {
    setVideoSrc(vidSrc); // Set video source when image is focused
  }

  return (
    <div
      name="portfolio"
      className="bg-gradient-to-b from-black to-gray-800 w-full text-white md:h-fit"
    >
      <div className="max-w-screen-lg p-4 pt-20 mx-auto flex flex-col justify-center w-full h-full">
        <div className="pb-8">
          <p className="text-4xl font-bold inline border-b-4 border-gray-500">
            Portfolio
          </p>
          <p className="py-6">Check out some of my work right here</p>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 px-12 sm:px-0">
          {portfolios.map(({ id, src, vidsrc }) => (
            <div key={id} className="shadow-md shadow-gray-600 rounded-lg">
              <img
                src={src}
                alt=""
                className="rounded-md duration-200 hover:scale-105"
                onFocus={() => handleVideo(vidsrc)} // Pass video source to handleVideo function
              />
              <div className="flex items-center justify-center">
                <button className="w-1/2 px-6 py-3 m-4 duration-200 hover:scale-105">
                  Demo
                </button>
                <button className="w-1/2 px-6 py-3 m-4 duration-200 hover:scale-105">
                  Code
                </button>
              </div>
            </div>
          ))}
        </div>
        {videoSrc && ( // Render video only if video source is available
          <video autoPlay muted loop className="portfolio-video">
            <source src={videoSrc} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
      </div>
    </div>
  );
};

export default Portfolio;
