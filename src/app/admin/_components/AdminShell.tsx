import { adminSections } from "@/lib/admin-config";
import { getUnreadMessageCount } from "@/lib/admin-data";
import AdminNav from "./AdminNav";

type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
};

export default async function AdminShell({
  eyebrow,
  title,
  description,
  actions,
  children,
}: Props) {
  const unreadMessages = await getUnreadMessageCount();

  return (
    <div className="adm">
      <AdminNav sections={adminSections} unreadMessages={unreadMessages} />
      <main className="adm-main">
        <header className="adm-page-head">
          <div>
            {eyebrow && <p className="adm-eyebrow">{eyebrow}</p>}
            <h1 className="adm-title">{title}</h1>
            {description && <p className="adm-sub">{description}</p>}
          </div>
          {actions && <div className="flex shrink-0 gap-2">{actions}</div>}
        </header>
        {children}
      </main>
    </div>
  );
}
