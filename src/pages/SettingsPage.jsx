import { useState, useEffect } from "react";
import { useToast } from "../context/ToastContext";
import { Save, Store, DollarSign, Percent, AlertTriangle, FileText, Check } from "lucide-react";

function SettingsPage({ settings, setSettings }) {
 const showToast = useToast();
 const [form, setForm] = useState(settings);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setForm(settings);
  }, [settings]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setSaved(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const cleanSettings = {
      storeName: form.storeName.trim() || "RetailPOS",
      currency: form.currency.trim() || "₱",
      taxRate: Number(form.taxRate) || 0,
      lowStockThreshold: Number(form.lowStockThreshold) || 10,
      receiptFooter: form.receiptFooter.trim() || "Thank you for your purchase!",
    };

   setSettings(cleanSettings);
setSaved(true);
showToast("Settings saved successfully.", "success");

setTimeout(() => setSaved(false), 2500);
  };

  const handleReset = () => {
    if (window.confirm("Reset all settings to default values?")) {
      const defaults = {
        storeName: "RetailPOS",
        currency: "₱",
        taxRate: 0,
        lowStockThreshold: 10,
        receiptFooter: "Thank you for your purchase!",
      };
         setSettings(defaults);
    setForm(defaults);
    showToast("Settings reset to defaults.", "info");
  }
};
  return (
    <div className="settings-page">
      <form onSubmit={handleSubmit} className="settings-form">
        <div className="settings-section">
          <div className="settings-section-header">
            <Store size={22} />
            <div>
              <h2>Store Information</h2>
              <p>Basic details about your business</p>
            </div>
          </div>

          <div className="form-row">
            <label>Store Name</label>
            <input
              type="text"
              name="storeName"
              value={form.storeName}
              onChange={handleChange}
              placeholder="e.g. Juan's Sari-Sari Store"
            />
            <small>Displayed in the sidebar and on receipts</small>
          </div>
        </div>

        <div className="settings-section">
          <div className="settings-section-header">
            <DollarSign size={22} />
            <div>
              <h2>Currency & Pricing</h2>
              <p>How prices are displayed</p>
            </div>
          </div>

          <div className="form-row">
            <label>Currency Symbol</label>
            <input
              type="text"
              name="currency"
              value={form.currency}
              onChange={handleChange}
              maxLength={3}
              placeholder="₱"
            />
            <small>Common: ₱ (Peso), $ (Dollar), € (Euro), ¥ (Yen)</small>
          </div>

          <div className="form-row">
            <label>Tax Rate (%)</label>
            <input
              type="number"
              name="taxRate"
              value={form.taxRate}
              onChange={handleChange}
              min="0"
              max="100"
              step="0.01"
              placeholder="0"
            />
            <small>Set to 0 if you don't charge tax</small>
          </div>
        </div>

        <div className="settings-section">
          <div className="settings-section-header">
            <AlertTriangle size={22} />
            <div>
              <h2>Inventory Alerts</h2>
              <p>When to warn about low stock</p>
            </div>
          </div>

          <div className="form-row">
            <label>Low Stock Threshold</label>
            <input
              type="number"
              name="lowStockThreshold"
              value={form.lowStockThreshold}
              onChange={handleChange}
              min="0"
              step="1"
              placeholder="10"
            />
            <small>Products with stock ≤ this number show as "Low Stock"</small>
          </div>
        </div>

        <div className="settings-section">
          <div className="settings-section-header">
            <FileText size={22} />
            <div>
              <h2>Receipt Customization</h2>
              <p>Text shown at the bottom of receipts</p>
            </div>
          </div>

          <div className="form-row">
            <label>Receipt Footer</label>
            <textarea
              name="receiptFooter"
              value={form.receiptFooter}
              onChange={handleChange}
              rows="3"
              placeholder="Thank you for your purchase!"
              className="settings-textarea"
            />
            <small>A friendly message printed at the bottom of every receipt</small>
          </div>
        </div>

        <div className="settings-actions">
          <button type="button" className="secondary-btn" onClick={handleReset}>
            Reset to Defaults
          </button>
          <button type="submit" className="primary-btn">
            {saved ? (
              <>
                <Check size={18} />
                Saved!
              </>
            ) : (
              <>
                <Save size={18} />
                Save Settings
              </>
            )}
          </button>
        </div>
      </form>

      {/* Live Preview */}
      <div className="settings-preview">
        <h3>Preview</h3>
        <div className="preview-card">
          <div className="preview-logo">
            <Store size={20} />
            <strong>{form.storeName || "RetailPOS"}</strong>
          </div>
          <div className="preview-content">
            <p>
              A product priced <strong>{form.currency || "₱"}100.00</strong> with{" "}
              <strong>{form.taxRate || 0}%</strong> tax would cost:
            </p>
            <h2>
              {form.currency || "₱"}
              {(100 * (1 + (Number(form.taxRate) || 0) / 100)).toFixed(2)}
            </h2>
          </div>
          <div className="preview-footer">
            <small>{form.receiptFooter || "Thank you for your purchase!"}</small>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;