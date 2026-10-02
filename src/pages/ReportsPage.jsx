import { useState } from "react";
import {
  TrendingUp,
  Receipt,
  ShoppingBag,
  Calendar,
  DollarSign,
  CreditCard,
  Banknote,
  Smartphone,
} from "lucide-react";

function ReportsPage({ sales }) {
  const [dateFilter, setDateFilter] = useState("all");

  // Filter sales based on date range
  const getFilteredSales = () => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    return sales.filter((sale) => {
      const saleDate = new Date(sale.timestamp);

      if (dateFilter === "today") {
        return saleDate >= startOfToday;
      }
      if (dateFilter === "week") {
        const weekAgo = new Date(now);
        weekAgo.setDate(now.getDate() - 7);
        return saleDate >= weekAgo;
      }
      if (dateFilter === "month") {
        const monthAgo = new Date(now);
        monthAgo.setMonth(now.getMonth() - 1);
        return saleDate >= monthAgo;
      }
      return true; // "all"
    });
  };

  const filteredSales = getFilteredSales();

  // Summary calculations
  const totalRevenue = filteredSales.reduce((sum, s) => sum + s.total, 0);
  const transactionCount = filteredSales.length;
  const avgSale = transactionCount ? totalRevenue / transactionCount : 0;

  const todaySales = sales.filter((s) => {
    const d = new Date(s.timestamp);
    const now = new Date();
    return (
      d.getFullYear() === now.getFullYear() &&
      d.getMonth() === now.getMonth() &&
      d.getDate() === now.getDate()
    );
  });
  const todayRevenue = todaySales.reduce((sum, s) => sum + s.total, 0);

  // Payment breakdown
  const paymentBreakdown = {
    Cash: { count: 0, total: 0 },
    Card: { count: 0, total: 0 },
    GCash: { count: 0, total: 0 },
  };

  filteredSales.forEach((sale) => {
    const method = sale.paymentMethod || "Cash";
    if (paymentBreakdown[method]) {
      paymentBreakdown[method].count += 1;
      paymentBreakdown[method].total += sale.total;
    }
  });

  // Top selling products
  const productStats = {};
  filteredSales.forEach((sale) => {
    sale.items.forEach((item) => {
      if (!productStats[item.id]) {
        productStats[item.id] = {
          id: item.id,
          name: item.name,
          icon: item.icon,
          units: 0,
          revenue: 0,
        };
      }
      productStats[item.id].units += item.quantity;
      productStats[item.id].revenue += item.total;
    });
  });

  const topProducts = Object.values(productStats)
    .sort((a, b) => b.units - a.units)
    .slice(0, 5);

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
    if (method === "Cash") return <Banknote size={18} />;
    if (method === "Card") return <CreditCard size={18} />;
    if (method === "GCash") return <Smartphone size={18} />;
    return null;
  };

  return (
    <div className="reports-page">
      {/* Date Filter */}
      <div className="reports-filter">
        <Calendar size={18} />
        <span>Date Range:</span>
        <div className="filter-buttons">
          {["today", "week", "month", "all"].map((f) => (
            <button
              key={f}
              className={dateFilter === f ? "active" : ""}
              onClick={() => setDateFilter(f)}
            >
              {f === "today" && "Today"}
              {f === "week" && "Last 7 Days"}
              {f === "month" && "Last 30 Days"}
              {f === "all" && "All Time"}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon revenue">
            <TrendingUp size={22} />
          </div>
          <span>Total Revenue</span>
          <h2>₱{totalRevenue.toFixed(2)}</h2>
          <small>{transactionCount} transaction(s)</small>
        </div>

        <div className="stat-card">
          <div className="stat-icon transactions">
            <Receipt size={22} />
          </div>
          <span>Transactions</span>
          <h2>{transactionCount}</h2>
          <small>Completed sales</small>
        </div>

        <div className="stat-card">
          <div className="stat-icon average">
            <ShoppingBag size={22} />
          </div>
          <span>Average Sale</span>
          <h2>₱{avgSale.toFixed(2)}</h2>
          <small>Per transaction</small>
        </div>

        <div className="stat-card">
          <div className="stat-icon today">
            <DollarSign size={22} />
          </div>
          <span>Today's Revenue</span>
          <h2>₱{todayRevenue.toFixed(2)}</h2>
          <small>{todaySales.length} sale(s) today</small>
        </div>
      </div>

      {/* Payment Breakdown */}
      <div className="report-section">
        <h2>Payment Method Breakdown</h2>
        <div className="payment-breakdown-grid">
          {Object.entries(paymentBreakdown).map(([method, data]) => (
            <div className="payment-breakdown-card" key={method}>
              <div className="payment-method-icon">
                {paymentIcon(method)}
              </div>
              <div>
                <strong>{method}</strong>
                <h3>₱{data.total.toFixed(2)}</h3>
                <small>{data.count} transaction(s)</small>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Selling Products */}
      <div className="report-section">
        <h2>Top Selling Products</h2>
        {topProducts.length === 0 ? (
          <div className="empty-report">
            No sales data yet. Complete a sale in POS to see it here.
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Product</th>
                  <th>Units Sold</th>
                  <th>Revenue</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((p, idx) => (
                  <tr key={p.id}>
                    <td>
                      <span className={`rank-badge rank-${idx + 1}`}>
                        #{idx + 1}
                      </span>
                    </td>
                    <td>
                      <span style={{ marginRight: 8 }}>{p.icon}</span>
                      <strong>{p.name}</strong>
                    </td>
                    <td>{p.units}</td>
                    <td>
                      <strong>₱{p.revenue.toFixed(2)}</strong>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recent Sales */}
      <div className="report-section">
        <h2>Recent Sales</h2>
        {filteredSales.length === 0 ? (
          <div className="empty-report">
            No sales in this period. Try changing the date range.
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Receipt</th>
                  <th>Date</th>
                  <th>Customer</th>
                  <th>Payment</th>
                  <th>Items</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {filteredSales.slice(0, 20).map((sale) => (
                  <tr key={sale.id}>
                    <td>
                      <strong>{sale.receipt}</strong>
                    </td>
                    <td>{formatDate(sale.timestamp)}</td>
                    <td>{sale.customerName}</td>
                    <td>
                      <span className="payment-badge">
                        {paymentIcon(sale.paymentMethod)}
                        {sale.paymentMethod}
                      </span>
                    </td>
                    <td>{sale.items.reduce((sum, i) => sum + i.quantity, 0)}</td>
                    <td>
                      <strong>₱{sale.total.toFixed(2)}</strong>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default ReportsPage;