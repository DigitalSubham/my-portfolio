import React, { useState, useEffect } from "react";

const Blogs = () => {
  const articles = [
    {
      id: 1,
      title: "Resume for Freshers: Important Points to Keep in Mind",
      img: "https://cdn.hashnode.com/res/hashnode/image/upload/v1703459140733/66e2b85d-0152-436c-983f-275565765579.png?w=1600&h=840&fit=crop&crop=entropy&auto=compress,format&format=webp",
      url: "https://digitalsubham.hashnode.dev/resume-for-freshers-important-points-to-keep-in-mind",
    },
    {
      id: 2,
      title: "A JavaScript Developer Must know these Number & Maths Methods",
      img: "https://cdn.hashnode.com/res/hashnode/image/upload/v1702698589974/088bbe3a-9e5f-48b3-bfec-3e12e57bb936.png?w=1600&h=840&fit=crop&crop=entropy&auto=compress,format&format=webp",
      url: "https://digitalsubham.hashnode.dev/a-javascript-developer-must-know-these-number-maths-methods",
    },
  ];

  return (
    <div className="bg-gradient-to-b from-black to-gray-800 w-full text-white md:h-fit">
      <div className="max-w-screen-lg p-4 pt-20 mx-auto flex flex-col justify-center w-full h-full">
        <div className="pb-8">
          <p className="text-4xl font-bold inline border-b-4 border-gray-500  ">
            Portfolio
          </p>
          <p className="py-6">Check out some of my work right here</p>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 px-12 sm:px-0 ">
          {articles.map((article) => (
            <div
              key={article._id}
              className="shadow-md shadow-gray-600 rounded-lg  relative group"
            >
              <div>
                <img
                  src={article.img}
                  className="rounded-md   duration-200 hover:scale-110 relative"
                />
                <h2 className="text-l text-center pt-3 w-[90%] mx-auto">
                  {article.title}
                </h2>
              </div>
              <div className="flex items-center justify-center mt-8">
                <a href={article.url} target="_">
                  <button
                    type="button"
                    class="text-yellow-400 hover:text-white border border-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-yellow-300 dark:text-yellow-300 dark:hover:text-white dark:hover:bg-yellow-400 dark:focus:ring-yellow-900"
                  >
                    Read
                  </button>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blogs;
