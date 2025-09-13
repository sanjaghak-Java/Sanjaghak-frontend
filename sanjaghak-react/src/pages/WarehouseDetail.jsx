import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import WarehouseProductModal from "./WarehouseProductModal";
import ProductSelectorModal from "./AddPurchaseModal";
import "/src/styles/WarehouseDetail.css";

export default function WarehouseDetail() {
  const { id } = useParams(); 
  const warehouseId = id; 
  const navigate = useNavigate();
  const [selectedProductModalOpen, setSelectedProductModalOpen] = useState(false);
const [showStockModal, setShowStockModal] = useState(false);
const [stockShelf, setStockShelf] = useState(null); 
const [selectedProduct, setSelectedProduct] = useState(null);
const [minLevel, setMinLevel] = useState("");
const [maxLevel, setMaxLevel] = useState("");
const [stockError, setStockError] = useState("");
  const [warehouse, setWarehouse] = useState(null);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
const [isReturnShelf, setIsReturnShelf] = useState(false); 
  const [currentView, setCurrentView] = useState("sections");
  const [selectedSection, setSelectedSection] = useState(null);
const [showReturnModal, setShowReturnModal] = useState(false);
const [tempIsReturn, setTempIsReturn] = useState(false);
  const [selectedShelf, setSelectedShelf] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);
const [shelves, setShelves] = useState([]);
const [shelvesLoading, setShelvesLoading] = useState(false);
const [shelvesError, setShelvesError] = useState(null);
const [showEmptyShelfModal, setShowEmptyShelfModal] = useState(false);
  useEffect(() => {
const fetchWarehouse = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`http://127.0.0.1:8080/api/Sanjaghak/warehouse/${warehouseId}`, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) throw new Error("خطا در دریافت اطلاعات انبار");
    const data = await res.json();
    setWarehouse(data);    
  } catch (err) {
    console.error(err);
  }
};

  fetchWarehouse();
}, [warehouseId]);
  useEffect(() => {
  if (!selectedSection) return;

  const fetchShelves = async () => {
    try {
      setShelvesLoading(true);
      setShelvesError(null);

      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://127.0.0.1:8080/api/Sanjaghak/shelves/getShelvesBySectionId/${selectedSection.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("خطا در دریافت قفسه‌ها");

      const data = await res.json();

      const mappedShelves = data.map((sh) => ({
        id: sh.shelvesId,
        code: sh.shelvesCode,
        sectionId: sh.sectionsId.sectionsId,
        userId: sh.userId?.id || null,
        active: sh.active,
        return: sh.return,
      }));

      setShelves(mappedShelves);
    } catch (err) {
      console.error(err);
      setShelvesError("مشکلی در بارگذاری قفسه‌ها پیش آمد.");
    } finally {
      setShelvesLoading(false);
    }
  };

  fetchShelves();
}, [selectedSection]);
const userId = "92d45c1a-3f2b-4120-971f-5fbf66a4188b"; 

const handleAddSection = async () => {
  try {
    const token = localStorage.getItem("token");
    const newName = `B${(sections.length + 1).toString().padStart(2, "0")}`;

    const res = await fetch(
      `http://127.0.0.1:8080/api/Sanjaghak/sections/add?warehouseId=${warehouseId}`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newName }),
      }
    );

    if (!res.ok) throw new Error("خطا در افزودن بخش");
    const data = await res.json();

    setSections([...sections, { id: data.sectionsId, name: data.name, active: data.active }]);
  } catch (err) {
    console.error(err);
    alert("مشکلی در افزودن بخش پیش آمد");
  }
};

const handleAddShelf = async (isReturnParam = false) => {
  if (!selectedSection) {
    alert("ابتدا یک بخش را انتخاب کنید");
    return;
  }

  try {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `http://127.0.0.1:8080/api/Sanjaghak/shelves/add?sectionId=${selectedSection.id}&userId=${userId}`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ return: isReturnParam }),
      }
    );

    if (!res.ok) throw new Error("خطا در افزودن قفسه");
    const data = await res.json();

    const newShelf = {
      id: data.shelvesId,
      code: data.shelvesCode,
      sectionId: data.sectionsId.sectionsId,
      userId: data.userId?.id || null,
      active: data.active,
      return: data.return,
    };
    setShelves([...shelves, newShelf]);
  } catch (err) {
    console.error(err);
    alert("مشکلی در افزودن قفسه پیش آمد");
  }
};
useEffect(() => {
  const fetchSections = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token"); 

      const res = await fetch(
        `http://127.0.0.1:8080/api/Sanjaghak/sections/by-warehouse/${warehouseId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("خطا در دریافت بخش‌ها");

      const data = await res.json();

      const mappedSections = data.map((s) => ({
        id: s.sectionsId,
        name: s.name,
        active: s.active,
      }));

      setSections(mappedSections);
    } catch (err) {
      console.error(err);
      setError("مشکلی در بارگذاری بخش‌ها پیش آمد.");
    } finally {
      setLoading(false);
    }
  };

  fetchSections();
}, [warehouseId]);
  const handleSectionClick = (section) => {
    setSelectedSection(section);
    setCurrentView("shelves");
  };

const handleShelfClick = async (shelf) => {
  setSelectedShelf(shelf);

  try {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `http://127.0.0.1:8080/api/Sanjaghak/inventoryStock/getAllInventoryStock`,
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) throw new Error("خطا در دریافت موجودی");

    const data = await res.json();

    const shelfStock = data.filter(
      (stock) => stock.shelvesId.shelvesId === shelf.id
    );

    if (shelfStock.length > 0) {
      setShowProductModal(true);
      setShowStockModal(false);
    } else {
      setShowEmptyShelfModal(true);
    }
  } catch (err) {
    console.error(err);
    alert("خطا در بررسی موجودی قفسه");
  }
};

  const handleBack = () => {
    if (currentView === "sections") {
      navigate(-1);
    } else if (currentView === "shelves") {
      setCurrentView("sections");
      setSelectedSection(null);
    }
  };
  const handleAddStock = async () => {
  if (!selectedProduct || !stockShelf) {
    setStockError("محصول یا قفسه انتخاب نشده است");
    return;
  }

  if (!minLevel || !maxLevel) {
    setStockError("حداقل و حداکثر موجودی را وارد کنید");
    return;
  }

  try {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `http://127.0.0.1:8080/api/Sanjaghak/inventoryStock/create?variantsId=${selectedProduct.variantId}&shelvesId=${stockShelf.id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          minimumLevel: parseInt(minLevel),
          maximumLevel: parseInt(maxLevel),
        }),
      }
    );

    if (!res.ok) throw new Error("خطا در افزودن موجودی");

    setShowStockModal(false);
    setSelectedProduct(null);
    setStockShelf(null);
    setMinLevel("");
    setMaxLevel("");
    alert("موجودی با موفقیت اضافه شد");
  } catch (err) {
    console.error(err);
    setStockError("خطا در افزودن موجودی");
  }
};

  return (
    <div className="warehouse-detail-container">
      <div className="header">
        <button onClick={handleBack} className="warehouse-detail-back-button">
          بازگشت
        </button>
        <h3>جزئیات انبار</h3>
      </div>

      {loading && <p>در حال بارگذاری...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

{currentView === "sections" && (
  <div>
    <button onClick={handleAddSection} className="add-button">
      + افزودن بخش
    </button>
    <div className="cards-grid">
      {sections.length ? (
        sections.map((section) => (
          <div
            key={section.id}
            className="card"
            onClick={() => handleSectionClick(section)}
          >
            <h4>{section.name}</h4>
            {!section.active && <small style={{ color: "red" }}>غیرفعال</small>}
          </div>
        ))
      ) : (
        !loading && <p>هیچ بخشی یافت نشد.</p>
      )}
    </div>
  </div>
)}

{currentView === "shelves" && (
  <div>
    <button
      onClick={() => {
        if (warehouse?.isCentral) {
          setShowReturnModal(true);
        } else {
          handleAddShelf(false);
        }
      }}
      className="add-button"
    >
      + افزودن قفسه
    </button>

    <div className="cards-grid">
      {shelvesLoading && <p>در حال بارگذاری قفسه‌ها...</p>}
      {shelvesError && <p style={{ color: "red" }}>{shelvesError}</p>}
      {!shelvesLoading && !shelves.length && <p>هیچ قفسه‌ای یافت نشد.</p>}

      {shelves.map((shelf) => (
        <div
          key={shelf.id}
          className="card"
          onClick={() => handleShelfClick(shelf)}
        >
          <h4>{shelf.code}</h4>
          {!shelf.active && <small style={{ color: "red" }}>غیرفعال</small>}
          {shelf.return && <small style={{ color: "blue" }}>📦 مرجوعی</small>}
        </div>
      ))}
    </div>
  </div>
)}


{showProductModal && selectedShelf && (
  <WarehouseProductModal
    shelf={selectedShelf}
    onClose={() => setShowProductModal(false)}
  />
)}

{showStockModal && selectedShelf && (
  <div className="return-modal">
    <div className="return-modal-content">
      <h4>افزودن موجودی به قفسه: {selectedShelf.code}</h4>

      {!selectedProduct ? (
        <ProductSelectorModal
          isOpen={true} 
          onClose={() => setShowStockModal(false)}
          onSelect={(product) => setSelectedProduct(product)}
        />
      ) : (
        <div>
          <p>محصول انتخاب شده: {selectedProduct.productName}</p>

          <div style={{ marginTop: "10px" }}>
            <label>
              حداقل موجودی:
              <input
                type="number"
                value={minLevel}
                onChange={(e) => setMinLevel(e.target.value)}
              />
            </label>
            <label style={{ marginLeft: "10px" }}>
              حداکثر موجودی:
              <input
                type="number"
                value={maxLevel}
                onChange={(e) => setMaxLevel(e.target.value)}
              />
            </label>
          </div>

          {stockError && <p style={{ color: "red" }}>{stockError}</p>}

          <div style={{ marginTop: "10px" }}>
            <button className="ok-button" onClick={handleAddStock}>✅ ثبت</button>
            <button
              className="cancel-button"
              onClick={() => {
                setShowStockModal(false);
                setSelectedProduct(null);
                setMinLevel("");
                setMaxLevel("");
              }}
            >
               انصراف
            </button>
          </div>
        </div>
      )}
    </div>
  </div>
)}
{showEmptyShelfModal && selectedShelf && (
  <div className="return-modal">
    <div className="return-modal-content">
      <h4>قفسه {selectedShelf.code} خالی است</h4>
      <p>می‌خواهید موجودی اضافه کنید؟</p>
      <div style={{ marginTop: "10px" }}>
<button
  className="ok-button"
  onClick={() => {
    setShowEmptyShelfModal(false); 
    setShowStockModal(true);       
    setStockShelf(selectedShelf);  
  }}
>
  افزودن موجودی
</button>
        <button
          className="cancel-button"
          onClick={() => setShowEmptyShelfModal(false)}
        >
          انصراف
        </button>
      </div>
    </div>
  </div>
)}
{showReturnModal && (
  <div className="modal">
    <div className="modal-content">
      <h3>نوع قفسه را انتخاب کنید</h3>
      <button
        onClick={() => {
          handleAddShelf(false); // normal shelf
          setShowReturnModal(false);
        }}
      >
        قفسه عادی
      </button>
      <button
        onClick={() => {
          handleAddShelf(true); // return shelf
          setShowReturnModal(false);
        }}
      >
        قفسه مرجوعی
      </button>
      <button onClick={() => setShowReturnModal(false)}>لغو</button>
    </div>
  </div>
)}

    </div>
  );
}
