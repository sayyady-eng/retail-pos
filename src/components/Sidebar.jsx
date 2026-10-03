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
  { name: "Dashboard", icon: <LayoutDashboard size={20} /> },
  { name: "POS", icon: <ShoppingCart size={20} /> },
  { name: "Products", icon: <Package size={20} /> },
  { name: "Inventory", icon: <Boxes size={20} /> },
  { name: "Customers", icon: <Users size={20} /> },
  { name: "Reports", icon: <BarChart3 size={20} /> },
  { name: "Settings", icon: <Settings size={20} /> },
  { name: "Users", icon: <ShieldCheck size={20} />, roles: ["Admin"] },
];

function Sidebar({ activePage, setActivePage, sidebarOpen, storeName }) {
  return (
    <aside className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
      <div className="logo">
        <ShoppingCart size={28} />
        {sidebarOpen && <span>{storeName || "RetailPOS"}</span>}
      </div>

      <nav>
        {menuItems.map((item) => (
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
          <div className="user-avatar">A</div>
          <div>
            <strong>Admin User</strong>
            <small>Administrator</small>
          </div>
        </div>
      )}
    </aside>
  );
}

export default Sidebar;