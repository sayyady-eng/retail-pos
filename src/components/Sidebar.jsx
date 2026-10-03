import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Boxes,
  Users,
  BarChart3,
  Settings,
  ShieldCheck,
} from "lucide-react";

const menuItems = [
  { name: "Dashboard", icon: <LayoutDashboard size={20} />, roles: ["Admin", "Cashier"] },
  { name: "POS", icon: <ShoppingCart size={20} />, roles: ["Admin", "Cashier"] },
  { name: "Products", icon: <Package size={20} />, roles: ["Admin", "Cashier"] },
  { name: "Inventory", icon: <Boxes size={20} />, roles: ["Admin"] },
  { name: "Customers", icon: <Users size={20} />, roles: ["Admin", "Cashier"] },
  { name: "Reports", icon: <BarChart3 size={20} />, roles: ["Admin"] },
  { name: "Users", icon: <ShieldCheck size={20} />, roles: ["Admin"] },
  { name: "Settings", icon: <Settings size={20} />, roles: ["Admin"] },
];

function Sidebar({
  activePage,
  setActivePage,
  sidebarOpen,
  storeName,
  currentUser,
}) {
  const role = currentUser?.role || "Cashier";
  const visibleItems = menuItems.filter((item) => item.roles.includes(role));

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <aside className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
      <div className="logo">
        <ShoppingCart size={28} />
        {sidebarOpen && <span>{storeName || "RetailPOS"}</span>}
      </div>

      <nav>
        {visibleItems.map((item) => (
          <button
            key={item.name}
            className={`nav-item ${activePage === item.name ? "active" : ""}`}
            onClick={() => setActivePage(item.name)}
          >
            {item.icon}
            {sidebarOpen && <span>{item.name}</span>}
          </button>
        ))}
      </nav>

      {sidebarOpen && (
        <div className="sidebar-footer">
          <div className="user-avatar">
            {currentUser ? getInitials(currentUser.name) : "?"}
          </div>
          <div>
            <strong>{currentUser?.name || "Guest"}</strong>
            <small>{currentUser?.role || ""}</small>
          </div>
        </div>
      )}
    </aside>
  );
}

export default Sidebar;