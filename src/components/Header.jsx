import { Bell, Menu, LogOut } from "lucide-react";

function Header({
  activePage,
  sidebarOpen,
  setSidebarOpen,
  onLogout,
  currentUser,
}) {
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
          <div className="profile-avatar">
            {currentUser ? getInitials(currentUser.name) : "?"}
          </div>
          <div className="profile-info">
            <span className="profile-name">
              {currentUser?.name || "Guest"}
            </span>
            <span className="profile-role">
              {currentUser?.role || ""}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;