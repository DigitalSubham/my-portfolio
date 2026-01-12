import { useState } from "react";
import {
    Briefcase,
    Code,
    ChevronRight,
    CheckCircle,
    Calendar,
    Building,
    MapPin,
} from "lucide-react";
import Image from "next/image";

type Project = {
    id: string;
    name: string;
    description: string;
    achievements: string[];
    icon: string;
    color: string;
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


type props = {
    workExperience: WorkExperienceType;
};
const WorkCard = ({ workExperience }: props) => {
    const [activeProject, setActiveProject] = useState<string | null>(
        workExperience.projects[0]?.id || null
    );
    return (
        <div className="relative">
            {/* Background decorative elements */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-200/20 dark:bg-purple-900/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-pink-200/20 dark:bg-pink-900/10 rounded-full blur-3xl"></div>

            {/* Company header */}
            <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 mb-8 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-600 to-pink-600"></div>
                <div className="absolute top-2 right-2 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 text-xs rounded-full">
                    Current
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div className="mb-4 md:mb-0">
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center text-white shadow-lg mr-4">
                                <Briefcase className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold">
                                    {workExperience.position}
                                </h3>
                                <div className="flex items-center text-gray-600 dark:text-gray-400">
                                    <Building className="w-4 h-4 mr-1" />
                                    <span className="font-medium">{workExperience.company}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center text-gray-600 dark:text-gray-400">
                            <Calendar className="w-4 h-4 mr-2" />
                            <span>{workExperience.period}</span>
                        </div>
                        <div className="flex items-center text-gray-600 dark:text-gray-400">
                            <MapPin className="w-4 h-4 mr-2" />
                            <span>{workExperience.location}</span>
                        </div>
                    </div>
                </div>

                <div className="mt-6">
                    <h4 className="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">
                        Technologies
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        {workExperience.technologies.map((tech: string, index: number) => (
                            <span
                                key={index}
                                className="px-3 py-1 bg-gradient-to-r from-purple-600/10 to-pink-600/10 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800 rounded-full text-sm font-medium"
                            >
                                {tech}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Projects section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Project selector */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 h-fit">
                    <h3 className="text-xl font-bold mb-4 flex items-center">
                        <Code className="w-5 h-5 mr-2 text-purple-600" />
                        Projects
                    </h3>

                    <div className="space-y-2">
                        {workExperience.projects.map((project: Project) => (
                            <button
                                key={project.id}
                                onClick={() => setActiveProject(project.id)}
                                className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center justify-between cursor-pointer ${activeProject === project.id
                                    ? "bg-gradient-to-r from-purple-600/20 to-pink-600/20 dark:from-purple-900/30 dark:to-pink-900/30 border-l-4 border-purple-600"
                                    : "hover:bg-gray-100 dark:hover:bg-gray-800"
                                    }`}
                            >
                                <div className="flex items-center">
                                    <span className="text-xl mr-3">{project.icon}</span>
                                    <span
                                        className={
                                            activeProject === project.id ? "font-medium" : ""
                                        }
                                    >
                                        {project.name}
                                    </span>
                                </div>
                                <ChevronRight
                                    className={`w-4 h-4 transition-transform ${activeProject === project.id
                                        ? "rotate-90 text-purple-600"
                                        : ""
                                        }`}
                                />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Project details */}
                <div className="lg:col-span-2">
                    {workExperience.projects.map((project: Project) => (
                        <div
                            key={project.id}
                            className={`bg-white dark:bg-gray-900 rounded-2xl shadow-lg overflow-hidden transition-all duration-500 ${activeProject === project.id
                                ? "opacity-100 transform translate-y-0"
                                : "opacity-0 absolute -z-10 transform -translate-y-4"
                                }`}
                            style={{
                                display: activeProject === project.id ? "block" : "none",
                            }}
                        >
                            {/* Project header */}
                            <div className={`h-3 bg-gradient-to-r ${project.color}`}></div>

                            <div className="p-6">
                                <div className="flex items-center mb-4">
                                    <div
                                        className={`w-12 h-12 rounded-xl bg-gradient-to-r ${project.color} flex items-center justify-center text-white text-xl shadow-md`}
                                    >
                                        {project.icon}
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-xl font-bold">{project.name}</h3>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                                            {project.description}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <h4 className="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4">
                                        Key Achievements
                                    </h4>
                                    <div className="space-y-3">
                                        {project.achievements.map((achievement: string, index: number) => (
                                            <div key={index} className="flex items-start">
                                                <CheckCircle className="w-5 h-5 text-green-500 dark:text-green-400 mt-0.5 mr-3 flex-shrink-0" />
                                                <p className="text-gray-700 dark:text-gray-300">
                                                    {achievement}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Project-specific illustrations or mockups could go here */}
                                <div className="mt-8 bg-gray-100 dark:bg-gray-800 rounded-lg p-4 relative overflow-hidden">
                                    <div className="absolute inset-0 opacity-5">
                                        <Image
                                            src="/placeholder.svg?height=200&width=600"
                                            alt="Project background"
                                            width={600}
                                            height={200}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="relative">
                                        <h5 className="font-medium mb-2">Project Impact</h5>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {project.impact}
                                        </p>


                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default WorkCard