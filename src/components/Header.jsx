import { Bell, Menu, LogOut } from "lucide-react";

function Header({ activePage, sidebarOpen, setSidebarOpen, onLogout }) {
  return (
    <header className="header">
      <div className="header-left">
        <button
          className="icon-button"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <Menu size={24} />
        </button>

        <div>
          <h1>{activePage === "POS" ? "Point of Sale" : activePage}</h1>
          <p>Manage your retail business efficiently</p>
        </div>
      </div>

      <div className="header-right">
        <button className="icon-button">
          <Bell size={22} />
        </button>

        <button className="icon-button" onClick={onLogout} title="Logout">
          <LogOut size={20} />
        </button>

        <div className="profile">
          <div className="profile-avatar">A</div>
          <span>Admin</span>
        </div>
      </div>
    </header>
  );
}

export default Header;