import React, { useState, useEffect } from "react";
import "/src/styles/WarehouseProductModal.css";

export default function WarehouseProductModal({ shelf, onClose, onSave }) {
  if (!shelf) return null;

  const [stockData, setStockData] = useState(null);
  const [variantData, setVariantData] = useState(null);
  const [productData, setProductData] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [stock, setStock] = useState(0);
  const [hasChanges, setHasChanges] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        setError(null);

        const stockRes = await fetch(
          "http://127.0.0.1:8080/api/Sanjaghak/inventoryStock/getAllInventoryStock",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!stockRes.ok) throw new Error("خطا در دریافت موجودی");
        const stockArr = await stockRes.json();
        const shelfStock = stockArr.find(
          (st) => st.shelvesId.shelvesId === shelf.id
        );
        if (!shelfStock) throw new Error("موجودی برای این قفسه یافت نشد");

        setStockData({
          id: shelfStock.inventoryStockId,
          quantityOnHand: shelfStock.quantityOnHand,
          reserved: shelfStock.reservedInventory,
          minStock: shelfStock.minimumLevel,
          maxStock: shelfStock.maximumLevel,
          variantId: shelfStock.variantsId.variantId,
          shelvesId: shelfStock.shelvesId.shelvesId,
          active: shelfStock.active,
        });
        setStock(shelfStock.quantityOnHand);

        const variantRes = await fetch(
          `http://127.0.0.1:8080/api/Sanjaghak/productVariants/${shelfStock.variantsId.variantId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!variantRes.ok) throw new Error("خطا در دریافت واریانت");
        const variant = await variantRes.json();
        setVariantData(variant);

        const productRes = await fetch(
          `http://127.0.0.1:8080/api/Sanjaghak/product/${variant.productId.productId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!productRes.ok) throw new Error("خطا در دریافت محصول");
        const product = await productRes.json();
        setProductData(product);
      } catch (err) {
        console.error(err);
        setError("مشکلی در بارگذاری داده‌ها پیش آمد.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [shelf, token]);

  useEffect(() => {
    if (stockData) setHasChanges(stock !== stockData.quantityOnHand);
  }, [stock, stockData]);

  const increaseStock = () => {
    if (stockData && stock < stockData.maxStock) setStock(prev => prev + 1);
  };
  const decreaseStock = () => {
    if (stock > 0) setStock(prev => prev - 1);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      let newVal = value === "" ? 0 : parseInt(value, 10);
      if (stockData) newVal = Math.min(Math.max(newVal, 0), stockData.maxStock);
      setStock(newVal);
    }
  };

  const handleSave = async () => {
    if (!stockData) return;
    const diff = stock - stockData.quantityOnHand;
    if (diff === 0) {
      onClose();
      return;
    }

    const type = diff > 0 ? "adjustmentIn" : "adjustmentOut";
    const quantity = Math.abs(diff);

    try {
      const res = await fetch(
        `http://127.0.0.1:8080/api/Sanjaghak/inventoryMovement/${type}?variantId=${stockData.variantId}&shelvesId=${stockData.shelvesId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ quantity }),
        }
      );
      if (!res.ok) throw new Error("خطا در بروزرسانی موجودی");

      setStockData(prev => ({
        ...prev,
        quantityOnHand: stock,
      }));
      if (onSave) onSave({ ...stockData, quantityOnHand: stock });
      onClose();
    } catch (err) {
      console.error(err);
      alert("خطا در بروزرسانی موجودی");
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>×</button>
        <h3>جزئیات قفسه {shelf.name}</h3>

        {loading && <p>در حال بارگذاری...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {!loading && !error && stockData && variantData && productData && (
          <>
            <table className="product-table">
              <tbody>
                <tr>
                  <th>نام محصول</th>
                  <td>{productData.productName}</td>
                </tr>
                <tr>
                  <th>مدل</th>
                  <td>{productData.model}</td>
                </tr>
                <tr>
                  <th>SKU</th>
                  <td>{variantData.sku}</td>
                </tr>
                <tr>
                  <th>رنگ</th>
                  <td>{variantData.color}</td>
                </tr>
                <tr>
                  <th>قیمت</th>
                  <td>{variantData.price.toLocaleString()} تومان</td>
                </tr>
                <tr>
                  <th>حداقل موجودی</th>
                  <td>{stockData.minStock ?? 0}</td>
                </tr>
                <tr>
                  <th>حداکثر موجودی</th>
                  <td>{stockData.maxStock ?? 0}</td>
                </tr>
                <tr>
                  <th>موجودی</th>
                  <td>
                    <button onClick={increaseStock} className="stock-btn plus-btn">+</button>
                    <input
                      type="text"
                      className="stock-input"
                      value={stock}
                      onChange={handleInputChange}
                      inputMode="numeric"
                      pattern="[0-9]*"
                    />
                    <button onClick={decreaseStock} className="stock-btn minus-btn">-</button>

                  </td>
                </tr>
                <tr>
                  <th>رزرو شده</th>
                  <td>{stockData.reserved}</td>
                </tr>
                <tr>
                  <th>فعال</th>
                  <td>{stockData.active ? "✅ بله" : "❌ خیر"}</td>
                </tr>
              </tbody>
            </table>

            <div className="modal-actions">
              <button
                className="add-button"
                onClick={handleSave}
                disabled={!hasChanges}
              >
                ثبت تغییرات
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}