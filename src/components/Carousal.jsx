import React from "react";
import blockchain_Nptel from "../assets/certificates/blockchain_Nptel.jpeg";
import namastereact from "../assets/certificates/namastereact.webp";
import domainage from "../assets/portfolio/domainage.png";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Carousal = () => {
  var settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  const data = [
    {
      img: blockchain_Nptel,
      name: "Nptel",
      description: "Done Certifivation on Blockchain from Nptel",
    },
    {
      img: namastereact,
      name: "Namaste React",
      description: "Done Certifivation on React from Akshay Saini",
    },
    {
      img: domainage,
      name: "Nptel",
      description: "Done Certifivation on Blockchain from Nptel",
    },
  ];
  return (
    <div className="w-[60%] md:w-1/5  mx-auto md:mr-52 ">
      <div className="pt-5">
        <p className="text-4xl font-bold md:inline border-b-4 border-gray-500 sm:(flex items-center justify-center)">
          Certificates
        </p>
      </div>
      <div className="mt-20">
        <Slider {...settings}>
          {data.map((d, index) => (
            <div key={index} className="bg-white h-80  text-black rounded-xl">
              <div className="h-44 shadow-md rounded-xl bg-indigo-400 shadow-sky-400 flex justify-center items-center">
                <img
                  src={d.img}
                  alt="d.img"
                  className=" hover:scale-110 h-[97%] w-[97%] rounded-xl "
                />
              </div>
              <div className="flex flex-col justify-center items-center gap-4 p-4">
                <p className="text-xl font-bold">{d.name}</p>
                <p className="items-center">{d.description}</p>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default Carousal;
