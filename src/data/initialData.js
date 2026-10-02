export const initialProducts = [
  { id: 1, name: "Coca-Cola", price: 50, stock: 45, icon: "🥤", category: "Drinks" },
  { id: 2, name: "Bottled Water", price: 25, stock: 80, icon: "💧", category: "Drinks" },
  { id: 3, name: "Fresh Bread", price: 40, stock: 20, icon: "🍞", category: "Bakery" },
  { id: 4, name: "Milk", price: 75, stock: 15, icon: "🥛", category: "Dairy" },
  { id: 5, name: "Rice 1kg", price: 65, stock: 50, icon: "🍚", category: "Grains" },
  { id: 6, name: "Coffee", price: 120, stock: 30, icon: "☕", category: "Drinks" },
  { id: 7, name: "Biscuits", price: 30, stock: 60, icon: "🍪", category: "Snacks" },
  { id: 8, name: "Instant Noodles", price: 20, stock: 100, icon: "🍜", category: "Snacks" },
];

export const initialCustomers = [
  { id: 1, name: "Walk-in Customer", phone: "-", email: "-", totalSpent: 0 },
  { id: 2, name: "Maria Santos", phone: "0917-111-2222", email: "maria@example.com", totalSpent: 780 },
  { id: 3, name: "John Cruz", phone: "0918-333-4444", email: "john@example.com", totalSpent: 1250 },
];

export const initialSales = [];

export const initialSettings = {
  storeName: "RetailPOS",
  currency: "₱",
  taxRate: 0,
  lowStockThreshold: 10,
  receiptFooter: "Thank you for your purchase!",
};

export const initialStockHistory = [];
export const initialReceiptCounter = 1000;