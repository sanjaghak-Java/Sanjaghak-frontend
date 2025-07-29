import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '/src/styles/AddPurchaseOrder.css';
import AddPurchaseModal from './AddPurchaseModal';
import AddPurchaseFactor from "./AddPurchaseFactor";
import phone from "../assets/images (1).jpg";

function AddPurchaseOrder() {
  const [supplier, setSupplier] = useState("");
  const [warehouse, setWarehouse] = useState("");
  const [quantity, setQuantity] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addedItems, setAddedItems] = useState([]);
  const [isFactorOpen, setIsFactorOpen] = useState(false);
  const [isOrderStarted, setIsOrderStarted] = useState(false);

  const navigate = useNavigate();

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const products = [
    {
      id: 1,
      name: "محصول X",
      category: "موبایل",
      colors: [
        { name: "قرمز", hex: "#ff0000" },
        { name: "آبی", hex: "#0000ff" },
        { name: "سبز", hex: "#00ff00" }
      ],
      attributes: {},
      price: 20000000,
      image: phone,
    },
  ];


  const suppliers = ["شرکت الف", "شرکت ب", "شرکت ج"];
  const warehouses = ["انبار مرکزی", "انبار غرب", "انبار شرق"];

  const handleAddItem = () => {
    if (!selectedProduct || !quantity) {
      alert("لطفا نام محصول و تعداد را وارد کنید.");
      return;
    }

    const newItem = {
      id: Date.now(),
      product: selectedProduct,
      quantity: Number(quantity),
      totalPrice: null, 
    };

    setAddedItems(prev => [...prev, newItem]);
    setSelectedProduct(null);
    setQuantity("");
  };

  const handleRemoveItem = (id) => {
    setAddedItems(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="purchase-main-containor">
      {!isOrderStarted ? (
        <div className="purchase-select">
          <div className="floating-number-input">
            <select
              className="modal-input"
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
              required
            >
              <option value="">انتخاب تأمین‌کننده</option>
              {suppliers.map((s, i) => (
                <option key={i} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="floating-number-input">
            <select
              className="modal-input"
              value={warehouse}
              onChange={(e) => setWarehouse(e.target.value)}
              required
            >
              <option value="">انتخاب انبار</option>
              {warehouses.map((w, i) => (
                <option key={i} value={w}>{w}</option>
              ))}
            </select>
          </div>

          <br />
          <div style={{width: "100%", display: "flex", justifyContent: "center"}}>
            <button
              className="add-submit-order"
              type="button"
              onClick={() => {
                if (!supplier || !warehouse) {
                  alert("لطفا تأمین‌کننده و انبار را انتخاب کنید.");
                  return;
                }
                setIsOrderStarted(true);
              }}
            >
              ادامه
            </button>
          </div>

        </div>
      ) : (
        <>
          <div className="purchase-select">
            <div className="product-row">
              <div className="floating-number-input product-name-input">
                <input
                  type="text"
                  className="modal-input"
                  value={selectedProduct ? selectedProduct.name : ""}
                  onClick={openModal}
                  readOnly
                  required
                />
                <label className={`floating-labeln ${selectedProduct ? "active" : ""}`}>
                  نام محصول
                </label>
              </div>

              <button
                className="select-produt"
                type="button"
                onClick={() => navigate("/admin/افزودن محصول")}
              >
                افزودن محصول
              </button>
            </div>

            <div className="floating-number-input">
              <input
                type="number"
                step="1"
                className="modal-input"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
              />
              <label className={`floating-labeln ${quantity ? "active" : ""}`}>تعداد</label>
            </div>

            <br />
            <div style={{width: "100%", display: "flex", justifyContent: "center"}}>
              <button
                className="add-submit-order"
                type="button"
                onClick={handleAddItem}
              >
                + افزودن
              </button>
            </div>
          </div>

          <AddPurchaseModal
            isOpen={isModalOpen}
            onClose={closeModal}
            products={products}
            onSelect={(product) => {
              setSelectedProduct(product);
              closeModal();
            }}
          />

          {addedItems.length > 0 && (
            <div className="order-summary-section">
              <table className="order-table">
                <thead>
                  <tr>
                    <th></th>
                    <th>نام محصول</th>
                    <th>تعداد</th>
                    <th>قیمت واحد</th>
                    <th>قیمت کل</th>
                  </tr>
                </thead>
                <tbody>
                  {addedItems.map(item => (
                    <tr key={item.id}>
                      <td>
                        <button className="remove-button" onClick={() => handleRemoveItem(item.id)}> - </button>
                      </td>
                      <td>{item.product.name}</td>
                      <td>{item.quantity}</td>
                      <td>{item.product.price.toLocaleString()} تومان</td>
                      <td>{item.product.subtotal?.toLocaleString()} تومان</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <br />
              <div style={{ direction: "ltr" }}>
                <button
                  className="add-submit-order"
                  onClick={() => setIsFactorOpen(true)}
                >
                  ثبت سفارش
                </button>
              </div>

              <AddPurchaseFactor
                isOpen={isFactorOpen}
                onClose={() => setIsFactorOpen(false)}
                purchase={null}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default AddPurchaseOrder;
