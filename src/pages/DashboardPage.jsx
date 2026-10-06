import {
  TrendingUp,
  Receipt,
  Package,
  AlertTriangle,
  Banknote,
  CreditCard,
  Smartphone,
} from "lucide-react";

function DashboardPage({ sales, products, customers }) {
  const today = new Date();
  const todaySales = sales.filter((s) => {
    const d = new Date(s.timestamp);
    return (
      d.getFullYear() === today.getFullYear() &&
      d.getMonth() === today.getMonth() &&
      d.getDate() === today.getDate()
    );
  });

  const todayRevenue = todaySales.reduce((sum, s) => sum + s.total, 0);
  const totalRevenue = sales.reduce((sum, s) => sum + s.total, 0);
  const totalTransactions = sales.length;

  const lowStockProducts = products.filter((p) => p.stock <= 10);

  const paymentTotals = { Cash: 0, Card: 0, GCash: 0 };
  sales.forEach((s) => {
    const method = s.paymentMethod || "Cash";
    if (paymentTotals[method] !== undefined) {
      paymentTotals[method] += s.total;
    }
  });

  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleString("en-PH", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const paymentIcon = (method) => {
    if (method === "Cash") return <Banknote size={16} />;
    if (method === "Card") return <CreditCard size={16} />;
    if (method === "GCash") return <Smartphone size={16} />;
    return null;
  };

  const recentSales = sales.slice(0, 5);

  return (
    <div className="dashboard-page">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon revenue">
            <TrendingUp size={22} />
          </div>
          <span>Today's Sales</span>
          <h2>₱{todayRevenue.toFixed(2)}</h2>
          <small>{todaySales.length} transaction(s) today</small>
        </div>

        <div className="stat-card">
          <div className="stat-icon transactions">
            <Receipt size={22} />
          </div>
          <span>Total Transactions</span>
          <h2>{totalTransactions}</h2>
          <small>All-time: ₱{totalRevenue.toFixed(2)}</small>
        </div>

        <div className="stat-card">
          <div className="stat-icon average">
            <Package size={22} />
          </div>
          <span>Total Products</span>
          <h2>{products.length}</h2>
          <small>{customers.length} customer(s)</small>
        </div>

        <div className="stat-card warning">
          <div className="stat-icon low-stock">
            <AlertTriangle size={22} />
          </div>
          <span>Low Stock</span>
          <h2>{lowStockProducts.length}</h2>
          <small>
            {lowStockProducts.length === 0
              ? "All products in stock"
              : "Products need attention"}
          </small>
        </div>
      </div>

      <div className="dashboard-section">
        <h2>Payment Method Breakdown</h2>
        <div className="payment-breakdown-grid">
          {Object.entries(paymentTotals).map(([method, total]) => (
            <div className="payment-breakdown-card" key={method}>
              <div className="payment-method-icon">{paymentIcon(method)}</div>
              <div>
                <strong>{method}</strong>
                <h3>₱{total.toFixed(2)}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="dashboard-section">
        <h2>Recent Transactions</h2>
        {recentSales.length === 0 ? (
          <div className="empty-report">
            No transactions yet. Complete a sale in POS to see it here.
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Receipt</th>
                  <th>Customer</th>
                  <th>Payment</th>
                  <th>Cashier</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentSales.map((sale) => (
                  <tr key={sale.id}>
                    <td>
                      <strong>{sale.receipt}</strong>
                    </td>
                    <td>{sale.customerName}</td>
                    <td>
                      <span className="payment-badge">
                      {paymentIcon(sale.paymentMethod)}
                        {sale.paymentMethod}
                      </span>
                    </td>
                    <td>{sale.soldBy || "—"}</td>  
                    <td>
                      {sale.items.reduce((sum, i) => sum + i.quantity, 0)}
                    </td>
                    <td>
                      <strong>₱{sale.total.toFixed(2)}</strong>
                    </td>
                    <td>{formatDate(sale.timestamp)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {lowStockProducts.length > 0 && (
        <div className="dashboard-section">
          <h2>⚠️ Low Stock Products</h2>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Current Stock</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {lowStockProducts.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <span style={{ marginRight: 8 }}>{p.icon}</span>
                      <strong>{p.name}</strong>
                    </td>
                    <td>{p.category || "—"}</td>
                    <td>
                      <span className="stock-low">{p.stock}</span>
                    </td>
                    <td>
                      <span className="status-badge status-low">
                        ⚠️ Low Stock
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardPage;