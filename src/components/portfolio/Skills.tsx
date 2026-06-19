import { Braces, Layers, Server, Wrench } from "lucide-react";
import SectionHeading from "./SectionHeading";

const groups = [
  {
    title: "Frontend",
    icon: Layers,
    description: "Interfaces, state, routing, and responsive product screens.",
    skills: [
      "React",
      "Next.js",
      "TypeScript",
      "JavaScript",
      "Tailwind CSS",
      "Redux",
      "HTML",
      "CSS",
    ],
  },
  {
    title: "Mobile",
    icon: Braces,
    description: "Production React Native workflows with form-heavy UX.",
    skills: [
      "React Native CLI",
      "Expo",
      "React Hook Form",
      "React Query",
      "Role-based flows",
      "Mobile UI",
    ],
  },
  {
    title: "Backend",
    icon: Server,
    description: "APIs, persistence, authentication, and integration logic.",
    skills: ["Node.js", "Express", "MongoDB", "SQL", "Firebase", "REST APIs"],
  },
  {
    title: "Engineering",
    icon: Wrench,
    description: "The tooling and habits that keep projects maintainable.",
    skills: ["Git", "GitHub", "Docker", "AWS", "Testing", "CI/CD", "Agile"],
  },
];

const delivery = [
  "Accessible UI",
  "Responsive systems",
  "Performance hygiene",
  "Form ergonomics",
  "Component architecture",
  "SEO-aware React",
];

const Skills = () => {
  return (
    <section id="skills" className="border-y border-gray-200 bg-white py-24 dark:border-gray-800 dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Capabilities"
          title="A modern JavaScript stack, shaped around product delivery."
          description="The goal is not a long badge wall. It is a focused stack that helps me build clear, maintainable interfaces across web and mobile."
        />

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {groups.map((group) => {
            const Icon = group.icon;
            return (
              <article
                key={group.title}
                className="rounded-2xl border border-gray-200 bg-gray-50 p-6 dark:border-gray-800 dark:bg-gray-900/70"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-950 text-white dark:bg-white dark:text-gray-950">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-xl font-semibold text-gray-950 dark:text-white">
                  {group.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">
                  {group.description}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {group.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-700 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-8 rounded-2xl border border-gray-200 bg-gray-50 p-6 dark:border-gray-800 dark:bg-gray-900/70">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">
            Delivery strengths
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            {delivery.map((item) => (
              <span
                key={item}
                className="rounded-full bg-gray-950 px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-gray-950"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
