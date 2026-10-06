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
import UsersPage from "./pages/UsersPage";
import {
  initialProducts,
  initialCustomers,
  initialSales,
  initialSettings,
  initialStockHistory,
  initialReceiptCounter,
  initialUsers,
} from "./data/initialData";
function App() {
  // Auth state
  const [currentUser, setCurrentUser] = useLocalStorage("pos_currentUser", null);
const [users, setUsers] = useLocalStorage("pos_users", initialUsers);
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
if (!currentUser) {
  return (
    <Login
      users={users}
      onLogin={(user) => {
        const { password, ...userSafe } = user;
        setCurrentUser(userSafe);
        setActivePage("POS");
      }}
    />
  );
}
  return (
    <div className="app">
     <Sidebar
  activePage={activePage}
  setActivePage={setActivePage}
  sidebarOpen={sidebarOpen}
  storeName={settings.storeName}
  currentUser={currentUser}
/>

      <main className="main-content">
        <Header
  activePage={activePage}
  sidebarOpen={sidebarOpen}
  setSidebarOpen={setSidebarOpen}
  onLogout={() => setCurrentUser(null)}
  currentUser={currentUser}
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
    currentUser={currentUser}
/>
)}

{activePage === "Users" && (
  <UsersPage
    users={users}
    setUsers={setUsers}
    currentUser={currentUser}
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
        {!["Dashboard", "POS", "Products", "Inventory", "Customers", "Reports", "Users", "Settings"].includes(activePage) && (
          <PlaceholderPage pageName={activePage} />
        )}
      </main>
    </div>
  );
}

export default App;