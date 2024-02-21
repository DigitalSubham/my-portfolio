import React from "react";
import Carousal from "./Carousal";

const About = () => {
  return (
    <div
      name="about"
      className="w-full bg-gradient-to-b from-gray-800 to-black text-white flex flex-col md:pl-32 sm:flex-row sm:mx-auto"
    >
      <div className="max-w-screen-lg p-2 mx-auto flex flex-col justify-center w-full sm:w-1/2">
        <div className="pb-4">
          <p className="text-4xl font-bold inline border-b-4 border-gray-500   ">
            About
          </p>
        </div>
        <div className="sm:w-[50%] md:w-[100%]">
          <p className="text-xl mt-5 sm:mt-20">
            I'm Subham Kumar, a fledgling full-stack developer, diving headfirst
            into the dynamic world of technology. Fresh out of academia, my
            enthusiasm for coding propels me through front-end and back-end
            challenges. I harbor a special fascination for blockchain, actively
            integrating it into my skill set.
          </p>
          <br />
          <p className="text-xl mt-5 sm:mt-0">
            Beyond coding, I wield the pen as a technical writer and blogger.
            Breaking down intricate technicalities into digestible content
            brings me joy. A perpetual learner, I eagerly embrace emerging
            technologies, determined to contribute meaningfully to the tech
            community's discourse. The journey ahead holds the promise of
            continuous growth and positive impact.
          </p>
        </div>
      </div>

      <Carousal />
    </div>
  );
};

export default About;
