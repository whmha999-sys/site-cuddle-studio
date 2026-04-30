import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Package, Image as ImageIcon, LogOut, Store } from "lucide-react";

export default function AdminLayout() {
  const { user, signOut } = useAuth();
  const nav = useNavigate();

  async function handleSignOut() {
    await signOut();
    nav("/auth", { replace: true });
  }

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
      isActive
        ? "bg-primary text-primary-foreground"
        : "text-foreground/70 hover:bg-muted hover:text-foreground"
    }`;

  return (
    <div className="min-h-screen flex bg-muted/30">
      <aside className="w-60 border-r bg-card flex flex-col">
        <div className="p-4 border-b">
          <h2 className="font-semibold tracking-tight">Smart Leaders</h2>
          <p className="text-xs text-muted-foreground">Admin</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          <NavLink to="/admin" end className={linkClass}>
            <LayoutDashboard className="h-4 w-4" /> Sales
          </NavLink>
          <NavLink to="/admin/editor" className={linkClass}>
            <Package className="h-4 w-4" /> Catalog
          </NavLink>
          <NavLink to="/admin/promos" className={linkClass}>
            <ImageIcon className="h-4 w-4" /> Promos
          </NavLink>
        </nav>
        <div className="p-3 border-t space-y-2">
          <Button variant="outline" size="sm" className="w-full justify-start" asChild>
            <a href="/" target="_blank" rel="noreferrer">
              <Store className="h-4 w-4 mr-2" /> View store
            </a>
          </Button>
          <div className="text-xs text-muted-foreground truncate px-1">{user?.email}</div>
          <Button variant="ghost" size="sm" className="w-full justify-start" onClick={handleSignOut}>
            <LogOut className="h-4 w-4 mr-2" /> Sign out
          </Button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
