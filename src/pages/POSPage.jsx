import { useToast } from "../context/ToastContext";
import { useState, useRef } from "react";
import {
  Search,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  CreditCard,
  Banknote,
  Smartphone,
  UserCheck,
  Printer,
  X,
} from "lucide-react";

function POSPage({
  products,
  setProducts,
  customers,
  sales,
  setSales,
  receiptCounter,
  setReceiptCounter,
  setCustomers,
  settings,
}) {
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [selectedCustomerId, setSelectedCustomerId] = useState(1);
  const [lastSale, setLastSale] = useState(null);
  const receiptRef = useRef(null);
  const showToast = useToast();
  const selectedCustomer = customers.find((c) => c.id === selectedCustomerId);

  const addToCart = (product) => {
    if (product.stock <= 0) {
      showToast(`${product.name} is out of stock.`, "error");
      return;
    }

    setCart((currentCart) => {
      const existing = currentCart.find((item) => item.id === product.id);

      if (existing) {
        if (existing.quantity >= product.stock) {
          showToast(`Only ${product.stock} units available.`, "error");
          return currentCart;
        }
        return currentCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...currentCart, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id, change) => {
    setCart((currentCart) =>
      currentCart
        .map((item) => {
          if (item.id !== id) return item;
          const newQty = item.quantity + change;
          const product = products.find((p) => p.id === id);
          if (newQty > product.stock) {
            showToast(`Only ${product.stock} units available.`, "error");
            return item;
          }
          return { ...item, quantity: newQty };
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (id) => {
    setCart((currentCart) => currentCart.filter((item) => item.id !== id));
  };

  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  const checkout = () => {
    if (cart.length === 0) {
      showToast("Please add products to the cart.", "error");
      return;
    }

    const receiptNumber = `#POS-${receiptCounter + 1}`;
    const saleTotal = subtotal;

    const newSale = {
      id: Date.now(),
      receipt: receiptNumber,
      timestamp: new Date().toISOString(),
      items: cart.map((item) => ({
        id: item.id,
        name: item.name,
        icon: item.icon,
        price: item.price,
        quantity: item.quantity,
        total: item.price * item.quantity,
      })),
      total: saleTotal,
      paymentMethod,
      customerId: selectedCustomerId,
      customerName: selectedCustomer?.name || "Walk-in Customer",
    };

    setSales([newSale, ...sales]);

    setProducts((prev) =>
      prev.map((p) => {
        const soldItem = cart.find((c) => c.id === p.id);
        if (soldItem) {
          return { ...p, stock: Math.max(0, p.stock - soldItem.quantity) };
        }
        return p;
      })
    );

    if (selectedCustomerId !== 1) {
      setCustomers((prev) =>
        prev.map((c) =>
          c.id === selectedCustomerId
            ? { ...c, totalSpent: (c.totalSpent || 0) + saleTotal }
            : c
        )
      );
    }

    setReceiptCounter((prev) => prev + 1);
    setLastSale(newSale);
    setCart([]);
  };

  const closeReceipt = () => {
    setLastSale(null);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="pos-layout">
      <section className="products-section">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search products or scan barcode..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="section-title">
          <h2>Products</h2>
          <span>{filteredProducts.length} items</span>
        </div>

        <div className="product-grid">
          {filteredProducts.map((product) => (
            <button
              className="product-card"
              key={product.id}
              onClick={() => addToCart(product)}
              disabled={product.stock <= 0}
              style={
                product.stock <= 0
                  ? { opacity: 0.4, cursor: "not-allowed" }
                  : {}
              }
            >
              <div className="product-icon">{product.icon}</div>
              <h3>{product.name}</h3>
              <p>Stock: {product.stock}</p>
              <strong>₱{product.price.toFixed(2)}</strong>
            </button>
          ))}
        </div>
      </section>

      <section className="cart-section">
        <div className="cart-header">
          <div>
            <h2>Current Order</h2>
            <span>{cart.length} item(s)</span>
          </div>
          <ShoppingCart size={24} />
        </div>

        <div className="customer-selector">
          <UserCheck size={18} />
          <select
            value={selectedCustomerId}
            onChange={(e) => setSelectedCustomerId(Number(e.target.value))}
            className="customer-select"
          >
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="cart-items">
          {cart.length === 0 ? (
            <div className="empty-cart">
              <ShoppingCart size={50} />
              <h3>Your cart is empty</h3>
              <p>Select products to start a sale.</p>
            </div>
          ) : (
            cart.map((item) => (
              <div className="cart-item" key={item.id}>
                <div className="cart-product">
                  <span className="cart-icon">{item.icon}</span>
                  <div>
                    <strong>{item.name}</strong>
                    <small>₱{item.price.toFixed(2)} each</small>
                  </div>
                </div>

                <div className="quantity-control">
                  <button onClick={() => updateQuantity(item.id, -1)}>
                    <Minus size={16} />
                  </button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, 1)}>
                    <Plus size={16} />
                  </button>
                </div>

                <div className="item-total">
                  ₱{(item.price * item.quantity).toFixed(2)}
                </div>

                <button
                  className="delete-button"
                  onClick={() => removeFromCart(item.id)}
                >
                  <Trash2 size={17} />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="cart-summary">
          <div className="summary-row">
            <span>Subtotal</span>
            <strong>₱{subtotal.toFixed(2)}</strong>
          </div>

          <div className="summary-row">
            <span>Discount</span>
            <span>₱0.00</span>
          </div>

          <div className="total-row">
            <span>Total</span>
            <strong>₱{subtotal.toFixed(2)}</strong>
          </div>

          <div className="payment-methods">
            <button
              className={paymentMethod === "Cash" ? "selected" : ""}
              onClick={() => setPaymentMethod("Cash")}
            >
              <Banknote size={20} />
              Cash
            </button>

            <button
              className={paymentMethod === "Card" ? "selected" : ""}
              onClick={() => setPaymentMethod("Card")}
            >
              <CreditCard size={20} />
              Card
            </button>

            <button
              className={paymentMethod === "GCash" ? "selected" : ""}
              onClick={() => setPaymentMethod("GCash")}
            >
              <Smartphone size={20} />
              GCash
            </button>
          </div>

          <button className="checkout-button" onClick={checkout}>
            Complete Sale — ₱{subtotal.toFixed(2)}
          </button>
        </div>
      </section>

      {lastSale && (
        <div className="receipt-modal-overlay" onClick={closeReceipt}>
          <div className="receipt-modal" onClick={(e) => e.stopPropagation()}>
            <div className="receipt-actions">
              <button
                className="icon-btn-small"
                onClick={closeReceipt}
                title="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="receipt" ref={receiptRef}>
              <div className="receipt-header">
                <h2>{settings?.storeName || "RetailPOS"}</h2>
                <p>Retail Management System</p>
                <p className="receipt-number">{lastSale.receipt}</p>
              </div>

              <div className="receipt-meta">
                <div>
                  <span>Date:</span>
                  <strong>
                    {new Date(lastSale.timestamp).toLocaleString("en-PH", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </strong>
                </div>
                <div>
                  <span>Customer:</span>
                  <strong>{lastSale.customerName}</strong>
                </div>
                <div>
                  <span>Payment:</span>
                  <strong>{lastSale.paymentMethod}</strong>
                </div>
              </div>

              <div className="receipt-divider"></div>

              <table className="receipt-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Qty</th>
                    <th>Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {lastSale.items.map((item) => (
                    <tr key={item.id}>
                      <td>{item.name}</td>
                      <td>{item.quantity}</td>
                      <td>₱{item.price.toFixed(2)}</td>
                      <td>₱{item.total.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="receipt-divider"></div>

              <div className="receipt-total">
                <div>
                  <span>Total</span>
                  <strong>₱{lastSale.total.toFixed(2)}</strong>
                </div>
              </div>

              <div className="receipt-divider"></div>

              <div className="receipt-footer">
                <p>{settings?.receiptFooter || "Thank you for your purchase!"}</p>
                <p className="receipt-tagline">
                  Powered by {settings?.storeName || "RetailPOS"}
                </p>
              </div>
            </div>

            <div className="receipt-buttons">
              <button className="secondary-btn" onClick={closeReceipt}>
                Close
              </button>
              <button className="primary-btn" onClick={handlePrint}>
                <Printer size={18} />
                Print Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default POSPage;