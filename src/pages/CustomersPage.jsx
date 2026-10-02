import { useState } from "react";
import { Plus, Edit, Trash2, Search, X, User, Phone, Mail, ShoppingBag } from "lucide-react";

const emptyForm = {
  name: "",
  phone: "",
  email: "",
};

function CustomersPage({ customers, setCustomers }) {
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const filtered = customers.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      (c.phone || "").toLowerCase().includes(q) ||
      (c.email || "").toLowerCase().includes(q)
    );
  });

  const openAdd = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowModal(true);
  };

  const openEdit = (customer) => {
    setForm({
      name: customer.name,
      phone: customer.phone || "",
      email: customer.email || "",
    });
    setEditingId(customer.id);
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

    if (!form.name.trim()) {
      alert("Please enter the customer's name.");
      return;
    }

    const customerData = {
      name: form.name.trim(),
      phone: form.phone.trim() || "-",
      email: form.email.trim() || "-",
    };

    if (editingId !== null) {
      setCustomers((prev) =>
        prev.map((c) => (c.id === editingId ? { ...c, ...customerData } : c))
      );
    } else {
      const newId = customers.length
        ? Math.max(...customers.map((c) => c.id)) + 1
        : 1;
      setCustomers((prev) => [
        ...prev,
        { id: newId, ...customerData, totalSpent: 0 },
      ]);
    }

    closeModal();
  };

  const handleDelete = (id) => {
    const customer = customers.find((c) => c.id === id);
    if (!customer) return;

    if (customer.name === "Walk-in Customer") {
      alert("The Walk-in Customer cannot be deleted.");
      return;
    }

    if (window.confirm(`Delete "${customer.name}"? This cannot be undone.`)) {
      setCustomers((prev) => prev.filter((c) => c.id !== id));
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
    <div className="customers-page">
      <div className="page-toolbar">
        <div className="page-toolbar-left">
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search by name, phone, or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <button className="primary-btn" onClick={openAdd}>
          <Plus size={18} />
          Add Customer
        </button>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Customer</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Total Spent</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="5" className="empty-row">
                  No customers found.
                </td>
              </tr>
            ) : (
              filtered.map((customer) => (
                <tr key={customer.id}>
                  <td>
                    <div className="customer-cell">
                      <div className="customer-avatar-small">
                        {getInitials(customer.name)}
                      </div>
                      <strong>{customer.name}</strong>
                    </div>
                  </td>
                  <td>{customer.phone || "—"}</td>
                  <td>{customer.email || "—"}</td>
                  <td>
                    <strong>₱{Number(customer.totalSpent || 0).toFixed(2)}</strong>
                  </td>
                  <td className="actions-cell">
                    <button
                      className="icon-btn-small"
                      onClick={() => openEdit(customer)}
                      title="Edit"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      className="icon-btn-small danger"
                      onClick={() => handleDelete(customer.id)}
                      title="Delete"
                      disabled={customer.name === "Walk-in Customer"}
                      style={
                        customer.name === "Walk-in Customer"
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
              <h2>{editingId !== null ? "Edit Customer" : "Add Customer"}</h2>
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
                <label>
                  <Phone size={14} style={{ marginRight: 6, verticalAlign: "middle" }} />
                  Phone
                </label>
                <input
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="e.g. 0917-111-2222"
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
                  placeholder="e.g. maria@example.com"
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button type="submit" className="primary-btn">
                  {editingId !== null ? "Save Changes" : "Add Customer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomersPage;