import type { NoteNode } from './history-notes';

export function continuousOopContent(nodes: NoteNode[], key: string): NoteNode[] {
  return nodes.map((node) => {
    if (typeof node === 'string') return node;
    const attrs = { ...node.attrs };
    if (attrs.id) attrs.id = `${key}-${attrs.id}`;
    if (attrs.href?.startsWith('#')) attrs.href = `#${key}-${attrs.href.slice(1)}`;
    const headings: Record<string, string> = { h1: 'h2', h2: 'h3', h3: 'h4' };
    return { tag: headings[node.tag] || node.tag, attrs, children: continuousOopContent(node.children, key) };
  });
}
