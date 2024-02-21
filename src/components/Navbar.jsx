import React, { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { Link } from "react-scroll";

const Navbar = () => {
  const [nav, setNav] = useState(false);
  const links = [
    { id: 0, link: "home", title: "home" },
    { id: 1, link: "https://digitalsubham.hashnode.dev/", title: "blog" },
    { id: 2, link: "about", title: "about" },
    { id: 3, link: "portfolio", title: "portfolio" },
    { id: 4, link: "experience", title: "experience" },
    { id: 5, link: "contact", title: "contact" },
  ];
  return (
    <div className="flex bg-black justify-between items-center w-full h-20 text-white shadow-lg md:fixed top-0 left-0 right-0 z-10 px-4">
      <div>
        <h1 className="text-5xl font-signature ml-2">..Subham..</h1>
      </div>
      <ul className="hidden md:flex">
        {links.map((link) => (
          <li
            key={link.id}
            className="px-4 cursor-pointer capitalize font-medium text-gray-500 hover:scale-105 hover:text-green-300 hover:border-b-2 duration-200"
          >
            {link.id === 1 ? (
              <a href={link.link} target="_blank" rel="noopener noreferrer">
                {link.title}
              </a>
            ) : (
              <Link to={link.link} smooth duration={500}>
                {link.title}
              </Link>
            )}
          </li>
        ))}
      </ul>
      <div
        onClick={() => setNav(!nav)}
        className="cursor-pointer pr-4 z-10 text-gray-500 md:hidden"
      >
        {nav ? <FaTimes size={30} /> : <FaBars size={30} />}
      </div>
      {nav && (
        <ul className="flex flex-col justify-center items-center absolute top-0 w-full h-screen bg-gradient-to-b from-black to-gray-800 text-gray-500  ">
          {links.map((link) => (
            <li
              key={link.id}
              className="px-4 cursor-pointer capitalize py-6 text-4xl"
            >
              <Link
                onClick={() => setNav(!nav)}
                to={link.link}
                smooth
                duration={500}
              >
                {link.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Navbar;
