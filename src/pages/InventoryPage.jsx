import { useState } from "react";
import { Search, Plus, Minus, History, X } from "lucide-react";

const LOW_STOCK_THRESHOLD = 10;

function InventoryPage({ products, setProducts, stockHistory, setStockHistory }) {
  const [search, setSearch] = useState("");
  const [adjusting, setAdjusting] = useState(null); // product being adjusted
  const [adjustType, setAdjustType] = useState("add"); // "add" | "remove"
  const [adjustAmount, setAdjustAmount] = useState("");
  const [adjustReason, setAdjustReason] = useState("Received");
  const [showHistory, setShowHistory] = useState(false);

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const lowStockProducts = products.filter((p) => p.stock <= LOW_STOCK_THRESHOLD);

  const openAdjust = (product, type) => {
    setAdjusting(product);
    setAdjustType(type);
    setAdjustAmount("");
    setAdjustReason(type === "add" ? "Received" : "Damaged");
  };

  const closeAdjust = () => {
    setAdjusting(null);
    setAdjustAmount("");
  };

  const handleAdjust = (e) => {
    e.preventDefault();

    const amount = Number(adjustAmount);
    if (!amount || amount <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    const change = adjustType === "add" ? amount : -amount;
    const newStock = adjusting.stock + change;

    if (newStock < 0) {
      alert("Cannot remove more stock than available.");
      return;
    }

    // Update product stock
    setProducts((prev) =>
      prev.map((p) =>
        p.id === adjusting.id ? { ...p, stock: newStock } : p
      )
    );

    // Log the change in history
    setStockHistory((prev) => [
      {
        id: Date.now(),
        productId: adjusting.id,
        productName: adjusting.name,
        icon: adjusting.icon,
        change,
        reason: adjustReason,
        newStock,
        timestamp: new Date().toISOString(),
      },
      ...prev,
    ]);

    closeAdjust();
  };

  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleString("en-PH", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="inventory-page">
      {/* Low Stock Alert Banner */}
      {lowStockProducts.length > 0 && (
        <div className="low-stock-banner">
          <span>⚠️ {lowStockProducts.length} product(s) low on stock:</span>
          <strong>
            {lowStockProducts.map((p) => p.name).join(", ")}
          </strong>
        </div>
      )}

      {/* Toolbar */}
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
        </div>

        <button
          className="secondary-btn"
          onClick={() => setShowHistory(!showHistory)}
        >
          <History size={18} />
          {showHistory ? "Hide History" : "Show History"}
        </button>
      </div>

      {/* Stock Table */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Icon</th>
              <th>Product</th>
              <th>Category</th>
              <th>Current Stock</th>
              <th>Status</th>
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
              filtered.map((product) => {
                const isLow = product.stock <= LOW_STOCK_THRESHOLD;
                return (
                  <tr key={product.id}>
                    <td className="icon-cell">{product.icon}</td>
                    <td><strong>{product.name}</strong></td>
                    <td>{product.category || "—"}</td>
                    <td>
                      <span className={isLow ? "stock-low" : ""}>
                        {product.stock}
                      </span>
                    </td>
                    <td>
                      {isLow ? (
                        <span className="status-badge status-low">
                          ⚠️ Low Stock
                        </span>
                      ) : (
                        <span className="status-badge status-ok">
                          ✅ In Stock
                        </span>
                      )}
                    </td>
                    <td className="actions-cell">
                      <button
                        className="icon-btn-small add-stock-btn"
                        onClick={() => openAdjust(product, "add")}
                        title="Add Stock"
                      >
                        <Plus size={16} />
                      </button>
                      <button
                        className="icon-btn-small remove-stock-btn"
                        onClick={() => openAdjust(product, "remove")}
                        title="Remove Stock"
                      >
                        <Minus size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Stock History Panel */}
      {showHistory && (
        <div className="stock-history-panel">
          <div className="stock-history-header">
            <h2>Stock Movement History</h2>
            <span>{stockHistory.length} entries</span>
          </div>

          {stockHistory.length === 0 ? (
            <div className="empty-row" style={{ padding: "30px" }}>
              No stock movements yet. Adjust stock above to see history here.
            </div>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Product</th>
                    <th>Change</th>
                    <th>Reason</th>
                    <th>New Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {stockHistory.map((entry) => (
                    <tr key={entry.id}>
                      <td>{formatDate(entry.timestamp)}</td>
                      <td>
                        <span style={{ marginRight: "8px" }}>{entry.icon}</span>
                        <strong>{entry.productName}</strong>
                      </td>
                      <td>
                        <span
                          className={
                            entry.change > 0 ? "change-positive" : "change-negative"
                          }
                        >
                          {entry.change > 0 ? "+" : ""}
                          {entry.change}
                        </span>
                      </td>
                      <td>{entry.reason}</td>
                      <td>{entry.newStock}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Adjust Stock Modal */}
      {adjusting && (
        <div className="modal-overlay" onClick={closeAdjust}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                {adjustType === "add" ? "Add Stock" : "Remove Stock"}
              </h2>
              <button className="icon-btn-small" onClick={closeAdjust}>
                <X size={18} />
              </button>
            </div>

            <div className="adjust-product-info">
              <span className="adjust-icon">{adjusting.icon}</span>
              <div>
                <strong>{adjusting.name}</strong>
                <small>Current stock: {adjusting.stock}</small>
              </div>
            </div>

            <form onSubmit={handleAdjust} className="modal-form">
              <div className="form-row">
                <label>Amount *</label>
                <input
                  type="number"
                  value={adjustAmount}
                  onChange={(e) => setAdjustAmount(e.target.value)}
                  min="1"
                  placeholder="e.g. 10"
                  required
                  autoFocus
                />
              </div>

              <div className="form-row">
                <label>Reason *</label>
                <select
                  className="filter-select"
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                >
                  {adjustType === "add" ? (
                    <>
                      <option value="Received">Received from supplier</option>
                      <option value="Return">Customer return</option>
                      <option value="Correction">Inventory correction</option>
                    </>
                  ) : (
                    <>
                      <option value="Damaged">Damaged / expired</option>
                      <option value="Sold">Sold (manual entry)</option>
                      <option value="Correction">Inventory correction</option>
                    </>
                  )}
                </select>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={closeAdjust}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={
                    adjustType === "add"
                      ? "primary-btn"
                      : "primary-btn danger-btn"
                  }
                >
                  {adjustType === "add" ? "Add" : "Remove"} {adjustAmount || "Stock"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default InventoryPage;