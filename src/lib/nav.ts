import type { NavItem } from "@/lib/portfolio-types";

/**
 * The homepage nav uses in-page hashes such as "#about". On any other route
 * those anchors point at nothing, so rewrite them to "/#about" and let the
 * browser navigate home first.
 */
export function toPageNavItems(navItems: NavItem[]): NavItem[] {
  return navItems.map((item) =>
    item.href.startsWith("#") ? { ...item, href: `/${item.href}` } : item,
  );
}
