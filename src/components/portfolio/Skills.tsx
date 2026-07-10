import { getIcon } from "@/components/common/Icon";
import type { SkillGroup } from "@/lib/portfolio-types";
import SectionHeading from "./SectionHeading";

type Props = {
  groups: SkillGroup[];
  delivery: string[];
};

const Skills = ({ groups, delivery }: Props) => {
  if (groups.length === 0 && delivery.length === 0) return null;

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
            const Icon = getIcon(group.icon);
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

        {delivery.length > 0 && (
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
        )}
      </div>
    </section>
  );
};

export default Skills;
