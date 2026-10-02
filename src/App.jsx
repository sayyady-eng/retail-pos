import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import PlaceholderPage from "./components/PlaceholderPage";
import DashboardPage from "./pages/DashboardPage";
import POSPage from "./pages/POSPage";
import ProductsPage from "./pages/ProductsPage";
import InventoryPage from "./pages/InventoryPage";
import CustomersPage from "./pages/CustomersPage";
import ReportsPage from "./pages/ReportsPage";
import SettingsPage from "./pages/SettingsPage";
import useLocalStorage from "./hooks/useLocalStorage";
import Login from "./components/Login";
import {
  initialProducts,
  initialCustomers,
  initialSales,
  initialSettings,
  initialStockHistory,
  initialReceiptCounter,
} from "./data/initialData";

function App() {
  // Auth state
  const [isLoggedIn, setIsLoggedIn] = useLocalStorage("pos_isLoggedIn", false);

  // UI state
  const [activePage, setActivePage] = useState("POS");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // App data (persisted)
  const [products, setProducts] = useLocalStorage("pos_products", initialProducts);
  const [customers, setCustomers] = useLocalStorage("pos_customers", initialCustomers);
  const [sales, setSales] = useLocalStorage("pos_sales", initialSales);
  const [settings, setSettings] = useLocalStorage("pos_settings", initialSettings);
  const [stockHistory, setStockHistory] = useLocalStorage("pos_stockHistory", initialStockHistory);
  const [receiptCounter, setReceiptCounter] = useLocalStorage("pos_receiptCounter", initialReceiptCounter);

  // Show login if not authenticated
  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="app">
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        sidebarOpen={sidebarOpen}
        storeName={settings.storeName}
      />

      <main className="main-content">
        <Header
          activePage={activePage}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          onLogout={() => setIsLoggedIn(false)}
        />

        {activePage === "Dashboard" && (
          <DashboardPage sales={sales} products={products} customers={customers} />
        )}
        {activePage === "POS" && (
          <POSPage
            products={products}
            setProducts={setProducts}
            customers={customers}
            sales={sales}
            setSales={setSales}
            receiptCounter={receiptCounter}
            setReceiptCounter={setReceiptCounter}
            setCustomers={setCustomers}
            settings={settings}
          />
        )}
        {activePage === "Products" && (
          <ProductsPage products={products} setProducts={setProducts} />
        )}
        {activePage === "Inventory" && (
          <InventoryPage
            products={products}
            setProducts={setProducts}
            stockHistory={stockHistory}
            setStockHistory={setStockHistory}
          />
        )}
        {activePage === "Customers" && (
          <CustomersPage customers={customers} setCustomers={setCustomers} />
        )}
        {activePage === "Reports" && <ReportsPage sales={sales} />}
        {activePage === "Settings" && (
          <SettingsPage settings={settings} setSettings={setSettings} />
        )}
        {!["Dashboard", "POS", "Products", "Inventory", "Customers", "Reports", "Settings"].includes(activePage) && (
          <PlaceholderPage pageName={activePage} />
        )}
      </main>
    </div>
  );
}

export default App;