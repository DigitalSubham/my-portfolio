import WorkCard from "./WorkCard";
import type { WorkExperience as WorkExperienceType } from "@/lib/portfolio-types";

type Props = {
  workExperiences: WorkExperienceType[];
};

export default function WorkExperience({ workExperiences }: Props) {
  if (workExperiences.length === 0) return null;

  return (
    <div className="space-y-8">
      {workExperiences.map((work) => (
        <WorkCard key={work.company} workExperience={work} />
      ))}
    </div>
  );
}
