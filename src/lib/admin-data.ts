import type { AdminTableConfig } from "./admin-config";
import { getSql, hasDatabase } from "./db";

type AdminRow = Record<string, unknown>;

export async function getTableRows(config: AdminTableConfig): Promise<AdminRow[]> {
  if (!hasDatabase) return [];
  const sql = getSql();
  const orderColumn = config.singleton ? "id" : "sort_order";
  const rows = await sql.query(`SELECT * FROM ${config.table} ORDER BY ${orderColumn} ASC, id ASC`);
  return rows as AdminRow[];
}

export async function getSingletonRow(config: AdminTableConfig) {
  const rows = await getTableRows(config);
  return rows[0] || {};
}

export async function getAdminStats() {
  if (!hasDatabase) {
    return {
      projects: 0,
      blogs: 0,
      certificates: 0,
      unreadMessages: 0,
    };
  }

  const sql = getSql();
  const [projects, blogs, certificates, unreadMessages] = (await Promise.all([
    sql`SELECT COUNT(*)::int AS count FROM projects`,
    sql`SELECT COUNT(*)::int AS count FROM blog_posts`,
    sql`SELECT COUNT(*)::int AS count FROM certificates`,
    sql`SELECT COUNT(*)::int AS count FROM contact_messages WHERE is_read = false AND is_archived = false`,
  ])) as AdminRow[][];

  return {
    projects: Number(projects[0].count),
    blogs: Number(blogs[0].count),
    certificates: Number(certificates[0].count),
    unreadMessages: Number(unreadMessages[0].count),
  };
}

export async function getUnreadMessageCount() {
  if (!hasDatabase) return 0;
  const sql = getSql();
  const rows = (await sql`
    SELECT COUNT(*)::int AS count FROM contact_messages
    WHERE is_read = false AND is_archived = false
  `) as AdminRow[];
  return Number(rows[0]?.count ?? 0);
}
