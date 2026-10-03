import { useState } from "react";
import { Plus, Edit, Trash2, Search, X, User, Mail, Lock, Shield } from "lucide-react";

const emptyForm = {
  username: "",
  email: "",
  password: "",
  name: "",
  role: "Cashier",
};

function UsersPage({ users, setUsers, currentUser }) {
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    return (
      u.name.toLowerCase().includes(q) ||
      u.username.toLowerCase().includes(q) ||
      (u.email || "").toLowerCase().includes(q)
    );
  });

  const openAdd = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowModal(true);
  };

  const openEdit = (user) => {
    setForm({
      username: user.username,
      email: user.email || "",
      password: user.password,
      name: user.name,
      role: user.role,
    });
    setEditingId(user.id);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.username.trim() || !form.password.trim() || !form.name.trim()) {
      alert("Please fill in username, password, and name.");
      return;
    }

    // Check for duplicate username (excluding current edit)
    const duplicate = users.find(
      (u) =>
        u.username.toLowerCase() === form.username.trim().toLowerCase() &&
        u.id !== editingId
    );
    if (duplicate) {
      alert("That username already exists.");
      return;
    }

    const userData = {
      username: form.username.trim(),
      email: form.email.trim() || "",
      password: form.password,
      name: form.name.trim(),
      role: form.role,
    };

    if (editingId !== null) {
      setUsers((prev) =>
        prev.map((u) => (u.id === editingId ? { ...u, ...userData } : u))
      );
    } else {
      const newId = users.length ? Math.max(...users.map((u) => u.id)) + 1 : 1;
      setUsers((prev) => [...prev, { id: newId, ...userData }]);
    }

    closeModal();
  };

  const handleDelete = (id) => {
    const user = users.find((u) => u.id === id);
    if (!user) return;

    if (id === currentUser?.id) {
      alert("You cannot delete your own account.");
      return;
    }

    // Prevent deleting the last admin
    const admins = users.filter((u) => u.role === "Admin");
    if (user.role === "Admin" && admins.length <= 1) {
      alert("Cannot delete the only Admin account.");
      return;
    }

    if (window.confirm(`Delete "${user.name}"? This cannot be undone.`)) {
      setUsers((prev) => prev.filter((u) => u.id !== id));
    }
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <div className="users-page">
      <div className="page-toolbar">
        <div className="page-toolbar-left">
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search users by name, username, or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <button className="primary-btn" onClick={openAdd}>
          <Plus size={18} />
          Add User
        </button>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="5" className="empty-row">
                  No users found.
                </td>
              </tr>
            ) : (
              filtered.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className="customer-cell">
                      <div className="customer-avatar-small">
                        {getInitials(user.name)}
                      </div>
                      <div>
                        <strong>{user.name}</strong>
                        {user.id === currentUser?.id && (
                          <small style={{ color: "#3478f6", display: "block", fontSize: "11px" }}>
                            (You)
                          </small>
                        )}
                      </div>
                    </div>
                  </td>
                  <td>{user.username}</td>
                  <td>{user.email || "—"}</td>
                  <td>
                    <span className={`role-badge role-${user.role.toLowerCase()}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <button
                      className="icon-btn-small"
                      onClick={() => openEdit(user)}
                      title="Edit"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      className="icon-btn-small danger"
                      onClick={() => handleDelete(user.id)}
                      title="Delete"
                      disabled={user.id === currentUser?.id}
                      style={
                        user.id === currentUser?.id
                          ? { opacity: 0.3, cursor: "not-allowed" }
                          : {}
                      }
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingId !== null ? "Edit User" : "Add User"}</h2>
              <button className="icon-btn-small" onClick={closeModal}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-row">
                <label>
                  <User size={14} style={{ marginRight: 6, verticalAlign: "middle" }} />
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Maria Santos"
                  required
                  autoFocus
                />
              </div>

              <div className="form-row">
                <label>Username *</label>
                <input
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="e.g. maria"
                  required
                />
              </div>

              <div className="form-row">
                <label>
                  <Mail size={14} style={{ marginRight: 6, verticalAlign: "middle" }} />
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="e.g. maria@retailpos.com"
                />
              </div>

              <div className="form-row">
                <label>
                  <Lock size={14} style={{ marginRight: 6, verticalAlign: "middle" }} />
                  Password *
                </label>
                <input
                  type="text"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter a password"
                  required
                />
              </div>

              <div className="form-row">
                <label>
                  <Shield size={14} style={{ marginRight: 6, verticalAlign: "middle" }} />
                  Role *
                </label>
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="filter-select"
                >
                  <option value="Cashier">Cashier</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              <div className="modal-actions">
                <button type="button" className="secondary-btn" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="primary-btn">
                  {editingId !== null ? "Save Changes" : "Add User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default UsersPage;