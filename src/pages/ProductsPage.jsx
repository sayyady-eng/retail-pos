import { useState } from "react";
import { useToast } from "../context/ToastContext";
import { Plus, Edit, Trash2, Search, X } from "lucide-react";

const emptyForm = {
  name: "",
  category: "",
  price: "",
  stock: "",
  icon: "📦",
};

function ProductsPage({ products, setProducts }) {
const showToast = useToast(); 
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const categories = ["All", ...new Set(products.map((p) => p.category).filter(Boolean))];

  const filtered = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === "All" || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const openAdd = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowModal(true);
  };

  const openEdit = (product) => {
    setForm({
      name: product.name,
      category: product.category || "",
      price: product.price,
      stock: product.stock,
      icon: product.icon || "📦",
    });
    setEditingId(product.id);
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

    if (!form.name || form.price === "" || form.stock === "") {
      showToast("Please fill in name, price, and stock.", "error");
return;
      return;
    }

    const productData = {
      name: form.name.trim(),
      category: form.category.trim() || "Uncategorized",
      price: Number(form.price),
      stock: Number(form.stock),
      icon: form.icon || "📦",
    };

      if (editingId !== null) {
  setProducts((prev) =>
    prev.map((p) => (p.id === editingId ? { ...p, ...productData } : p))
  );
  showToast(`${productData.name} updated.`, "success");
} else {
  const newId = products.length ? Math.max(...products.map((p) => p.id)) + 1 : 1;
  setProducts((prev) => [...prev, { id: newId, ...productData }]);
  showToast(`${productData.name} added.`, "success");
}

    closeModal();
  };
const handleDelete = (id) => {
  const product = products.find((p) => p.id === id);
  if (!product) return;
  if (window.confirm(`Delete "${product.name}"? This cannot be undone.`)) {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast(`${product.name} deleted.`, "success");   // ← Is this line there?
  }
};
  return (
    <div className="products-page">
      <div className="page-toolbar">
        <div className="page-toolbar-left">
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            className="filter-select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <button className="primary-btn" onClick={openAdd}>
          <Plus size={18} />
          Add Product
        </button>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Icon</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="6" className="empty-row">
                  No products found.
                </td>
              </tr>
            ) : (
              filtered.map((product) => (
                <tr key={product.id}>
                  <td className="icon-cell">{product.icon}</td>
                  <td><strong>{product.name}</strong></td>
                  <td>{product.category || "—"}</td>
                  <td>₱{product.price.toFixed(2)}</td>
                  <td>
                    <span className={product.stock <= 10 ? "stock-low" : ""}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <button className="icon-btn-small" onClick={() => openEdit(product)} title="Edit">
                      <Edit size={16} />
                    </button>
                    <button className="icon-btn-small danger" onClick={() => handleDelete(product.id)} title="Delete">
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
              <h2>{editingId !== null ? "Edit Product" : "Add Product"}</h2>
              <button className="icon-btn-small" onClick={closeModal}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-row">
                <label>Icon</label>
                <input
                  type="text"
                  name="icon"
                  value={form.icon}
                  onChange={handleChange}
                  maxLength={2}
                  placeholder="📦"
                />
              </div>

              <div className="form-row">
                <label>Name *</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Product name"
                  required
                />
              </div>

              <div className="form-row">
                <label>Category</label>
                <input
                  type="text"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  placeholder="e.g. Drinks, Snacks"
                />
              </div>

              <div className="form-row two-col">
                <div>
                  <label>Price (₱) *</label>
                  <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                <div>
                  <label>Stock *</label>
                  <input
                    type="number"
                    name="stock"
                    value={form.stock}
                    onChange={handleChange}
                    min="0"
                    required
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="secondary-btn" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="primary-btn">
                  {editingId !== null ? "Save Changes" : "Add Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductsPage;