import {
  Award,
  Briefcase,
  Code,
  Github,
  Globe,
  Layers,
  Linkedin,
  Mail,
  Milk,
  QrCode,
  Server,
  Wrench,
} from "lucide-react";
import type { IconKey } from "@/lib/portfolio-types";

export const iconMap = {
  award: Award,
  briefcase: Briefcase,
  code: Code,
  github: Github,
  globe: Globe,
  layers: Layers,
  linkedin: Linkedin,
  mail: Mail,
  milk: Milk,
  qr: QrCode,
  server: Server,
  wrench: Wrench,
};

export function getIcon(icon: IconKey) {
  return iconMap[icon] || Globe;
}
