import React, { useRef } from "react";
import streamSage from "../assets/portfolio/streamSage.png";
import youtube_Clone from "../assets/portfolio/youtube_Clone.svg";
import domainage from "../assets/portfolio/domainage.png";
import kidsJoy from "../assets/portfolio/kidsjoy.png";
import { Cloudinary } from "@cloudinary/url-gen";
import { AdvancedVideo, lazyload } from "@cloudinary/react";

const cld = new Cloudinary({
  cloud: {
    cloudName: "donutatdq",
  },
});

const Portfolio = () => {
  const portfolios = [
    {
      id: 0,
      src: streamSage,
      code: "https://github.com/DigitalSubham/StreamSage-AI-Movie-Explorer",
      demo: "https://stream-sage-ai-movie-explorer.vercel.app/",
      vidsrc: "portfolio/domainAge",
    },
    {
      id: 1,
      src: youtube_Clone,
      vidsrc: "portfolio/vid2",
    },
    {
      id: 2,
      src: kidsJoy,
      code: "https://github.com/DigitalSubham/kidsJoy",
      demo: "https://kids-joy.vercel.app/",
      vidsrc: "portfolio/vid3",
    },
    {
      id: 3,
      src: domainage,
      code: "https://github.com/DigitalSubham/Domain-Age-Checker-Chrome-Extension",
      demo: "#",
      vidsrc: "portfolio/vid2",
    },
    {
      id: 4,
      src: domainage,
      code: "https://github.com/DigitalSubham/Domain-Age-Checker-Chrome-Extension",
      demo: "#",
      vidsrc: "portfolio/domainAge",
    },
    {
      id: 5,
      src: domainage,
      code: "https://github.com/DigitalSubham/Domain-Age-Checker-Chrome-Extension",
      demo: "#",
      vidsrc: null,
    },
  ];

  const videoRefs = portfolios.map(() => useRef());
  // console.log(videoRefs);

  const onMouseOver = (index) => {
    videoRefs[index].current.videoRef.current.play();
  };

  const onMouseOut = (index) => {
    videoRefs[index].current.videoRef.current.pause();
  };

  return (
    <div
      name="portfolio"
      className="bg-gradient-to-b from-black to-gray-800 w-full text-white md:h-fit"
    >
      <div className="max-w-screen-lg p-4 pt-20 mx-auto flex flex-col justify-center w-full h-full">
        <div className="pb-8">
          <p className="text-4xl font-bold inline border-b-4 border-gray-500  ">
            Portfolio
          </p>
          <p className="py-6">Check out some of my work right here</p>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 px-12 sm:px-0 ">
          {portfolios.map(({ id, src, vidsrc }) => (
            <div
              key={id}
              className="shadow-md shadow-gray-600 rounded-lg  relative group"
              onMouseOver={() => onMouseOver(id)}
              onMouseOut={() => onMouseOut(id)}
            >
              {vidsrc ? (
                <>
                  <img src={src} alt={src} className="rounded-md relative" />
                  <AdvancedVideo
                    ref={videoRefs[id]}
                    className="absolute top-0 left-0 opacity-0  w-full h-auto transition-opacity duration-300 group-hover:opacity-100 rounded-md hover:scale-110"
                    loop
                    muted
                    width="100%"
                    cldVid={cld.video(vidsrc).delivery("q_auto").format("auto")}
                    plugins={[lazyload()]}
                  />
                </>
              ) : (
                <img
                  src={src}
                  alt={src}
                  className="rounded-md duration-200 hover:scale-150 relative"
                />
              )}

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
      </div>
    </div>
  );
};

export default Portfolio;
