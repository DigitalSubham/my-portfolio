import { createElement, type ReactNode } from "react";
import { noteHref, type NoteNode } from "@/lib/history-notes";

const tags = new Set(["p", "h1", "h2", "h3", "b", "strong", "span", "table", "thead", "tr", "th", "tbody", "td", "aside", "ul", "li", "i", "div", "br", "a", "section", "pre", "code"]);

export default function NoteContent({ nodes }: { nodes: NoteNode[] }) {
  function render(node: NoteNode, key: number): ReactNode {
    if (typeof node === "string") return node;
    if (!tags.has(node.tag)) return null;
    const props: Record<string, string | number | undefined> = { key };
    for (const [name, value] of Object.entries(node.attrs)) {
      if (name === "class") props.className = value;
      if (["scope", "id", "lang"].includes(name)) props[name] = value;
      if (name === "href") props.href = noteHref(value);
    }
    if (node.tag === "a" && props.href?.toString().startsWith("http")) { props.target = "_blank"; props.rel = "noopener noreferrer"; }
    const children = node.children.map(render);
    if (node.tag === "table") return <div className="table-scroll" tabIndex={0} role="region" aria-label="Study table" key={key}>{createElement("table", props, children)}</div>;
    return createElement(node.tag, props, node.tag === "br" ? undefined : children);
  }
  return <>{nodes.map(render)}</>;
}
