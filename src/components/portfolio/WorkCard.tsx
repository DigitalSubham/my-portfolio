import { Calendar, MapPin } from "lucide-react";

type Project = {
  id: string;
  name: string;
  description: string;
  achievements: string[];
  impact: string;
};

type WorkExperienceType = {
  company: string;
  position: string;
  period: string;
  location: string;
  technologies: string[];
  projects: Project[];
};

type Props = {
  workExperience: WorkExperienceType;
};

const WorkCard = ({ workExperience }: Props) => {
  return (
    <article className="grid gap-6 border-t border-gray-200 py-8 dark:border-gray-800 lg:grid-cols-[0.38fr_0.62fr]">
      <div>
        <h3 className="text-2xl font-semibold tracking-tight text-gray-950 dark:text-white">
          {workExperience.position}
        </h3>
        <p className="mt-2 text-lg text-gray-700 dark:text-gray-300">
          {workExperience.company}
        </p>
        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-500 dark:text-gray-400">
          <span className="inline-flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {workExperience.period}
          </span>
          <span className="inline-flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            {workExperience.location}
          </span>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          {workExperience.technologies.map((tech) => (
            <span
              key={tech}
              className="border border-gray-200 px-3 py-1 text-xs font-medium text-gray-600 dark:border-gray-800 dark:text-gray-300"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      <div className="divide-y divide-gray-200 dark:divide-gray-800">
        {workExperience.projects.map((project) => (
          <div key={project.id} className="grid gap-3 py-5 first:pt-0 last:pb-0 md:grid-cols-[0.35fr_0.65fr]">
            <h4 className="font-semibold text-gray-950 dark:text-white">
              {project.name}
            </h4>
            <div>
              <p className="text-sm leading-6 text-gray-600 dark:text-gray-400">
                {project.description}
              </p>
              <p className="mt-2 text-sm leading-6 text-gray-800 dark:text-gray-200">
                {project.impact}
              </p>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
};

export default WorkCard;
