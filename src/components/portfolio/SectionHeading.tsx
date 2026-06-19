type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description: string;
  align?: "left" | "center";
};

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
}: SectionHeadingProps) {
  return (
    <div
      className={`${align === "center" ? "mb-12" : "mb-0"} ${align === "center"
        ? "mx-auto max-w-3xl text-center"
        : "max-w-3xl text-left"
        }`}
    >
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">
        {eyebrow}
      </p>
      <h2 className="text-3xl font-semibold tracking-tight text-gray-950 dark:text-white md:text-5xl">
        {title}
      </h2>
      <p className="mt-4 text-base leading-7 text-gray-600 dark:text-gray-400 md:text-lg">
        {description}
      </p>
    </div>
  );
}
