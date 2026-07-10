import Link from "next/link";
import { ArrowDown } from "lucide-react";
import SmartImage from "@/components/common/SmartImage";
import { getIcon } from "@/components/common/Icon";
import type { HeroContent, SocialLink } from "@/lib/portfolio-types";

type Props = {
  hero: HeroContent;
  socials: SocialLink[];
};

const Hero = ({ hero, socials }: Props) => {
  return (
    <section className="relative min-h-screen overflow-hidden bg-[#eef3f6] pt-16 dark:bg-gray-950">
      <SmartImage
        src={hero.imageUrl}
        alt={hero.imageAlt}
        fill
        priority
        unoptimized
        sizes="100vw"
        className="z-0 object-cover object-[62%_center] dark:opacity-55"
      />
      <div className="absolute inset-0 z-[1] bg-gradient-to-r from-[#eef3f6] via-[#eef3f6]/88 to-[#eef3f6]/8 dark:from-gray-950 dark:via-gray-950/88 dark:to-gray-950/20" />
      <div className="absolute inset-x-0 bottom-0 z-[1] h-32 bg-gradient-to-t from-[#eef3f6] to-transparent dark:from-gray-950" />

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl items-center px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="mb-6 text-sm font-semibold uppercase tracking-[0.32em] text-gray-500 dark:text-gray-400">
            {hero.eyebrow}
          </p>
          <h1 className="max-w-4xl text-[clamp(4rem,9vw,8.8rem)] font-semibold leading-[0.88] tracking-tight text-gray-950 dark:text-white">
            {hero.name}
          </h1>
          <p className="mt-8 max-w-xl text-xl leading-9 text-gray-700 dark:text-gray-300">
            {hero.description}
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link
              href={hero.primaryHref}
              className="inline-flex min-h-12 items-center justify-center rounded-none bg-gray-950 px-7 text-sm font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:bg-gray-800 dark:bg-white dark:text-gray-950 dark:hover:bg-gray-200"
            >
              {hero.primaryLabel}
            </Link>
            <Link
              href={hero.secondaryHref}
              className="inline-flex min-h-12 items-center justify-center rounded-none border border-gray-950 px-7 text-sm font-semibold uppercase tracking-[0.12em] text-gray-950 transition-colors hover:bg-gray-950 hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-gray-950"
            >
              {hero.secondaryLabel}
            </Link>
          </div>

          <div className="mt-12 flex items-center gap-4">
            {socials.map((item) => {
              const Icon = getIcon(item.icon);
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="inline-flex min-h-11 min-w-11 items-center justify-center border border-gray-300 text-gray-700 transition-colors hover:border-gray-950 hover:text-gray-950 dark:border-gray-700 dark:text-gray-300 dark:hover:border-white dark:hover:text-white"
                >
                  <Icon className="h-5 w-5" />
                  <span className="sr-only">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <Link
        href="#about"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-gray-500 transition-colors hover:text-gray-950 dark:hover:text-white md:inline-flex"
      >
        Scroll
        <ArrowDown className="h-4 w-4" />
      </Link>
    </section>
  );
};

export default Hero;
