import { Code } from "lucide-react";
import React from "react";

const Skills = () => {
  return (
    <section id="skills" className="py-20 bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">My Skills</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-purple-600 to-pink-600 mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Technologies I work with
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Frontend Skills */}
          <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 shadow-lg overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-pink-600/5 dark:from-purple-900/10 dark:to-pink-900/10 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
            <div className="relative z-10">
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-4 shadow-md">
                  <Code className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold">Frontend</h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { name: "HTML5/CSS3", level: "Expert", icon: "🌐" },
                  { name: "JavaScript", level: "Expert", icon: "📜" },
                  { name: "React", level: "Advanced", icon: "⚛️" },
                  { name: "Next.js", level: "Advanced", icon: "▲" },
                  { name: "Tailwind CSS", level: "Advanced", icon: "🎨" },
                  { name: "TypeScript", level: "Advanced", icon: "🔷" },
                  { name: "Redux", level: "Intermediate", icon: "🔄" },
                  { name: "Responsive Design", level: "Expert", icon: "📱" },
                ].map((skill, index) => (
                  <div
                    key={index}
                    className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center"
                  >
                    <div className="text-2xl mb-2">{skill.icon}</div>
                    <h4 className="font-medium text-sm">{skill.name}</h4>
                    <span
                      className={`text-xs mt-1 px-2 py-1 rounded-full ${
                        skill.level === "Expert"
                          ? "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300"
                          : skill.level === "Advanced"
                          ? "bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-300"
                          : "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300"
                      }`}
                    >
                      {skill.level}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Backend Skills */}
          <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 shadow-lg overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-pink-600/5 dark:from-purple-900/10 dark:to-pink-900/10 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
            <div className="relative z-10">
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-4 shadow-md">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2H5z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Backend</h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { name: "Node.js", level: "Advanced", icon: "🟢" },
                  { name: "Express", level: "Advanced", icon: "🚂" },
                  { name: "MongoDB", level: "Intermediate", icon: "🍃" },
                  { name: "SQL", level: "Intermediate", icon: "📊" },
                  { name: "GraphQL", level: "Intermediate", icon: "⬢" },
                  { name: "Firebase", level: "Intermediate", icon: "🔥" },
                  { name: "REST APIs", level: "Advanced", icon: "🔌" },
                  { name: "Authentication", level: "Advanced", icon: "🔐" },
                ].map((skill, index) => (
                  <div
                    key={index}
                    className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center"
                  >
                    <div className="text-2xl mb-2">{skill.icon}</div>
                    <h4 className="font-medium text-sm">{skill.name}</h4>
                    <span
                      className={`text-xs mt-1 px-2 py-1 rounded-full ${
                        skill.level === "Expert"
                          ? "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300"
                          : skill.level === "Advanced"
                          ? "bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-300"
                          : "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300"
                      }`}
                    >
                      {skill.level}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tools & Others */}
          <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 shadow-lg overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-pink-600/5 dark:from-purple-900/10 dark:to-pink-900/10 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
            <div className="relative z-10">
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-4 shadow-md">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Tools & Others</h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { name: "Git & GitHub", level: "Advanced", icon: "🔄" },
                  { name: "Docker", level: "Intermediate", icon: "🐳" },
                  { name: "AWS", level: "Intermediate", icon: "☁️" },
                  { name: "CI/CD", level: "Intermediate", icon: "🔄" },
                  { name: "Testing", level: "Intermediate", icon: "🧪" },
                  { name: "UI/UX Design", level: "Intermediate", icon: "🎨" },
                  { name: "Agile/Scrum", level: "Advanced", icon: "📊" },
                  { name: "Problem Solving", level: "Expert", icon: "🧩" },
                ].map((skill, index) => (
                  <div
                    key={index}
                    className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center"
                  >
                    <div className="text-2xl mb-2">{skill.icon}</div>
                    <h4 className="font-medium text-sm">{skill.name}</h4>
                    <span
                      className={`text-xs mt-1 px-2 py-1 rounded-full ${
                        skill.level === "Expert"
                          ? "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300"
                          : skill.level === "Advanced"
                          ? "bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-300"
                          : "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300"
                      }`}
                    >
                      {skill.level}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Additional Skills Showcase */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-center mb-8">
            Proficiency Overview
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { name: "React", level: "Advanced" },
              { name: "Next.js", level: "Advanced" },
              { name: "TypeScript", level: "Advanced" },
              { name: "Node.js", level: "Advanced" },
              { name: "HTML/CSS", level: "Expert" },
              { name: "JavaScript", level: "Expert" },
              { name: "Tailwind CSS", level: "Advanced" },
              { name: "MongoDB", level: "Intermediate" },
              { name: "SQL", level: "Intermediate" },
              { name: "GraphQL", level: "Intermediate" },
              { name: "Git", level: "Advanced" },
              { name: "Docker", level: "Intermediate" },
              { name: "AWS", level: "Intermediate" },
              { name: "Testing", level: "Intermediate" },
              { name: "UI/UX", level: "Intermediate" },
            ].map((skill, index) => (
              <div
                key={index}
                className={`px-4 py-2 rounded-full ${
                  skill.level === "Expert"
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-medium shadow-md"
                    : skill.level === "Advanced"
                    ? "bg-gradient-to-r from-purple-500/90 to-pink-500/90 text-white text-sm font-medium shadow-md"
                    : "bg-gradient-to-r from-purple-400/80 to-pink-400/80 text-white text-sm font-medium shadow-md"
                }`}
              >
                {skill.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
