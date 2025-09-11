import React, { useState, useEffect } from 'react';
import { useLocation } from "react-router-dom";
import '/src/styles/WarehouseTransfer.css';
import WarehouseProductSelectorModal from "./WarehouseProductSelectorModal";
import WarehouseViewModal from "./WarehouseViewModal";

function WarehouseTransfer() {
  const location = useLocation();
  const incomingDestinationWarehouse = location.state?.sourceWarehouseName || "";
  const token = localStorage.getItem("token");
  const [showProductModal, setShowProductModal] = useState(false);
  const [showProductModalFor, setShowProductModalFor] = useState(null);
  const [step, setStep] = useState(1);

  const [selectedSourceProduct, setSelectedSourceProduct] = useState(null);
  const [selectedDestinationProduct, setSelectedDestinationProduct] = useState(null);
  const [quantity, setQuantity] = useState("");

  const [sourceWarehouse, setSourceWarehouse] = useState("");
  const [destinationWarehouse, setDestinationWarehouse] = useState(incomingDestinationWarehouse);

  const [registeredItems, setRegisteredItems] = useState([]);
  const [destinationSectionShelf, setDestinationSectionShelf] = useState("");
  const [showViewModal, setShowViewModal] = useState(false);

  const [warehouses, setWarehouses] = useState([]); 

const [destinationSections, setDestinationSections] = useState([]); 
const [destinationShelves, setDestinationShelves] = useState([]);

  const destinationSectionShelves = [
    "بخش 1 - قفسه 1",
    "بخش 1 - قفسه 2",
    "بخش 2 - قفسه A",
    "بخش 2 - قفسه B",
    "بخش 3 - قفسه X",
  ];
  useEffect(() => {
  if (!destinationWarehouse || !token) return;

  const warehouseObj = warehouses.find(w => w.name === destinationWarehouse);
  if (!warehouseObj) return;

  const warehouseId = warehouseObj.warehouseId;

  fetch(`http://127.0.0.1:8080/api/Sanjaghak/sections/by-warehouse/${warehouseId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then(async res => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then(async sections => {
      const activeSections = sections.filter(s => s.active);
      setDestinationSections(activeSections);

      
const allShelves = await Promise.all(
  activeSections.map(async section => {
    const res = await fetch(
      `http://127.0.0.1:8080/api/Sanjaghak/shelves/getShelvesBySectionId/${section.sectionsId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!res.ok) throw new Error(`Failed to fetch shelves for section ${section.name}`);
    const shelves = await res.json();

    return shelves
      .filter(sh => sh.active)
      .map(sh => ({ ...sh, sectionName: section.name }));
  })
);
      setDestinationShelves(allShelves.flat());
    })
    .catch(err => console.error("Error fetching destination shelves:", err));
}, [destinationWarehouse, warehouses, token]);
  const [productList, setProductList] = useState([]); 

useEffect(() => {
  if (!token || !sourceWarehouse) return;

  const warehouseObj = warehouses.find(w => w.name === sourceWarehouse);
  if (!warehouseObj) return;

  const warehouseId = warehouseObj.warehouseId;

  fetch(`http://127.0.0.1:8080/api/Sanjaghak/inventoryStock/getInventoryStocksByWarehouse/${warehouseId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then(async res => {
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`HTTP ${res.status}: ${text}`);
      }
      return res.json();
    })
    .then(async stocks => {
      const activeStocks = stocks.filter(stock => stock.active);

      const productsWithVariants = await Promise.all(
        activeStocks.map(async stock => {
          const variantId = stock.variantsId.variantId;
          const variantRes = await fetch(`http://127.0.0.1:8080/api/Sanjaghak/productVariants/${variantId}`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
          if (!variantRes.ok) throw new Error(`Failed to fetch variant ${variantId}`);
          const variantData = await variantRes.json();

          return {
            id: variantData.variantId,
            name: variantData.productId.productName,
            variant: variantData.color,
            section: stock.shelvesId?.shelvesId || "نامشخص",
            stock: stock.quantityOnHand,
          };
        })
      );

      setProductList(productsWithVariants);
    })
    .catch(err => console.error("Error fetching products for source warehouse:", err));
}, [sourceWarehouse, warehouses, token]);

useEffect(() => {
  fetch("http://127.0.0.1:8080/api/Sanjaghak/warehouse/getAllWarehouse", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
       Authorization: `Bearer ${token}`, 
    },
  })
    .then(async res => {
      if (!res.ok) {
        const text = await res.text(); 
        throw new Error(`HTTP ${res.status}: ${text}`);
      }
      return res.json();
    })
    .then(data => {
      if (Array.isArray(data)) {
        const activeWarehouses = data.filter(w => w.isActive);
        setWarehouses(activeWarehouses);
      } else {
        console.error("Expected array but got:", data);
      }
    })
    .catch(err => console.error("Error fetching warehouses:", err));
}, []);

  function handleSelectProduct(product) {
    if (showProductModalFor === "source") {
      setSelectedSourceProduct(product);
    } else if (showProductModalFor === "destination") {
      setSelectedDestinationProduct(product);
    }
    setShowProductModal(false);
  }

  function handleContinueStep() {
    if (!sourceWarehouse || !destinationWarehouse || !selectedSourceProduct) {
      alert("لطفاً همه فیلدهای مرحله اول را پر کنید.");
      return;
    }
    setStep(2);
  }

  function handleAddItem() {
    if (!destinationSectionShelf) {
      alert("لطفاً بخش-قفسه مقصد را انتخاب کنید.");
      return;
    }

    const qty = Number(quantity);
    if (!qty || qty <= 0) {
      alert("تعداد معتبر وارد کنید.");
      return;
    }
    if (qty > selectedSourceProduct.stock) {
      alert(`تعداد وارد شده نامعتبر است.`);
      return;
    }

const [section, shelf] = destinationSectionShelf.split(" - ");

setRegisteredItems(prev => [
  ...prev,
  {
    id: Date.now(),
    fromWarehouse: sourceWarehouse,
    fromSection: selectedSourceProduct.section,
    fromShelf: selectedSourceProduct.shelf,
    toWarehouse: destinationWarehouse,
    toSection: section,
    toShelf: shelf,
    productName: selectedSourceProduct.name,
    productVariant: selectedSourceProduct.variant,
    quantity: qty,
  }
]);

    setQuantity("");
    setDestinationSectionShelf("");
    setStep(1);
  }

async function handleFinalSubmit() {
  if (registeredItems.length === 0) {
    alert("هیچ موردی ثبت نشده است.");
    return;
  }

  try {
    for (const item of registeredItems) {
      const fromWarehouseObj = warehouses.find(w => w.name === item.fromWarehouse);
      if (!fromWarehouseObj) throw new Error(`انبار مبدا ${item.fromWarehouse} پیدا نشد`);

      const toShelfObj = destinationShelves.find(
        sh => sh.sectionName === item.toSection && sh.shelvesCode === item.toShelf
      );
      if (!toShelfObj) throw new Error(`قفسه مقصد ${item.toSection} - ${item.toShelf} پیدا نشد`);

      const productVariantObj = productList.find(
        p => p.name === item.productName && p.variant === item.productVariant
      );
      if (!productVariantObj) throw new Error(`محصول ${item.productName} پیدا نشد`);

      const url = `http://127.0.0.1:8080/api/Sanjaghak/inventoryMovement/requestTransfer?quantity=${item.quantity}&variantId=${productVariantObj.id}&fromWarehouseId=${fromWarehouseObj.warehouseId}&toShelvesId=${toShelfObj.shelvesId}`;

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`خطا در انتقال ${item.productName}: ${text}`);
      }
    }

    alert("انتقال با موفقیت ثبت شد.");
    setRegisteredItems([]);
    setShowViewModal(false);
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
}

  return (
    <div className="Warehouse-transfer-main-containor">
      <div className="Warehouse-select">

        {step === 1 && (
          <>
            <div className="Warehouse-name-containor">
              <select
                value={sourceWarehouse}
                onChange={e => setSourceWarehouse(e.target.value)}
              >
                <option value="" disabled hidden>انتخاب انبار مبدا</option>
                {warehouses.map(w => (
                  <option key={w.warehouseId} value={w.name}>{w.name}</option>
                ))}
              </select>
              <label>از انبار</label>
            </div>

            <div className="Warehouse-name-containor">
              <select
                value={destinationWarehouse}
                onChange={e => setDestinationWarehouse(e.target.value)}
              >
                <option value="" disabled hidden>انتخاب انبار مقصد</option>
                {warehouses.map(w => (
                  <option key={w.warehouseId} value={w.name}>{w.name}</option>
                ))}
              </select>
              <label>به انبار</label>
            </div>

            <div className="Warehouse-name-containor">
              <input
                type="text"
                placeholder=" "
                readOnly
                value={selectedSourceProduct ? `${selectedSourceProduct.name} - ${selectedSourceProduct.variant}` : ""}
                onClick={() => {
                  setShowProductModalFor("source");
                  setShowProductModal(true);
                }}
              />
              <label>انتخاب محصول انبار مقصد</label>
            </div>

            <div style={{ width: "100%", display: "flex", justifyContent: "center", gap: "12px", marginTop: 20 }}>
              <button
                className="add-submit-order"
                type="button"
                onClick={handleContinueStep}
              >
                ادامه
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="Warehouse-name-containor">
              <input
                type="number"
                min="1"
                step="1"
                placeholder=" "
                value={quantity}
                onChange={e => setQuantity(e.target.value)}
              />
              <label>تعداد</label>
            </div>
            <div className="Warehouse-name-containor">
<select
  value={destinationSectionShelf}
  onChange={e => setDestinationSectionShelf(e.target.value)}
>
  <option value="" disabled hidden>انتخاب بخش-قفسه مقصد</option>
  {destinationShelves.map(sh => (
    <option key={sh.shelvesId} value={`${sh.sectionName} - ${sh.shelvesCode}`}>
      {`${sh.sectionName} - ${sh.shelvesCode}`}
    </option>
  ))}
</select>
              <label>بخش-قفسه انبار مقصد</label>
            </div>

            <div style={{ width: "100%", display: "flex", justifyContent: "center", gap: "12px", marginTop: 20 }}>
              <button
                className="add-submit-order"
                type="button"
                onClick={handleAddItem}
              >
                ثبت
              </button>
              <button
                className="add-submit-order"
                type="button"
                style={{ backgroundColor: "#888" }}
                onClick={() => setStep(1)}
              >
                بازگشت
              </button>
            </div>
          </>
        )}
      </div>

      {registeredItems.length > 0 && (
        <div className="order-summary-section">
          <table className="warehouse-table" style={{ direction: "rtl" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #ccc" }}>
                <th>نام محصول</th>
                <th>انبار مبدا - بخش - قفسه</th>
                <th>انبار مقصد - بخش - قفسه</th>
                <th>تعداد</th>
              </tr>
            </thead>
            <tbody>
              {registeredItems.map(item => (
                <tr key={item.id} style={{ borderBottom: "1px solid #eee" }}>
                  <td>{item.productName} - {item.productVariant}</td>
                  <td>{item.fromWarehouse} - {item.fromSection} - {item.fromShelf}</td>
                  <td>{`${item.toWarehouse} - ${item.toSection} - ${item.toShelf}`}</td>
                  <td>{item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ direction: "ltr" }}>
            <button
              onClick={handleFinalSubmit}
              className="add-submit-order"
            >
              ثبت درخواست
            </button>
          </div>
        </div>
      )}

      {showProductModal && (
        <WarehouseProductSelectorModal
          products={productList}
          onClose={() => setShowProductModal(false)}
          onSelectProduct={handleSelectProduct}
        />
      )}

      {showViewModal && (
        <WarehouseViewModal
          transferItems={registeredItems}
          onClose={() => setShowViewModal(false)}
          onConfirmTransfer={() => {
            alert("انتقال با موفقیت ثبت شد.");
            setRegisteredItems([]);
            setShowViewModal(false);
          }}
        />
      )}

    </div>
  );
}

export default WarehouseTransfer;