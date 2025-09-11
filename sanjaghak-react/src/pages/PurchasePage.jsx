import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AddPurchaseFactor from './AddPurchaseFactor';
import "/src/styles/PurchasePage.css";
import download from '../assets/download.png';
import PurchaseOrderFactor from './purchaseOrderFactor';

function PurchasePage() {
  const [orders, setOrders] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [warehouses, setWarehouses] = useState([]);

  const [statusFilter, setStatusFilter] = useState('همه موارد');
  const [supplierFilter, setSupplierFilter] = useState('همه موارد');
  const [warehouseFilter, setWarehouseFilter] = useState('همه موارد');
  const [searchText, setSearchText] = useState('');

  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const [isFactorOpen, setIsFactorOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageInput, setPageInput] = useState('');
  const itemsPerPage = 4;

  const navigate = useNavigate();
const statusMap = {
  Processing: "در حال پردازش",
  Shipping: "در حال ارسال",
  Received: "دریافت‌شده",
  Cancelled: "لغوشده"
};

const getSupplierName = (supplierId) => {
  const supplier = suppliers.find(s => s.suppliersId === supplierId);
  return supplier ? supplier.supplierName : "نامشخص";
};

const getWarehouseName = (warehouseId) => {
  const warehouse = warehouses.find(w => w.warehouseId === warehouseId);
  return warehouse ? warehouse.name : "نامشخص";
};
  const token = localStorage.getItem("token");

useEffect(() => {
  fetch('http://127.0.0.1:8080/api/Sanjaghak/purchaseOrders/getAllPurchaseOrders', {
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  })
    .then(res => res.json())
    .then(data => setOrders(data))
    .catch(console.error);
}, [token]);

useEffect(() => {
  fetch('http://127.0.0.1:8080/api/Sanjaghak/suppliers/getAllSuppliers', {
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  })
    .then(res => res.json())
    .then(data => setSuppliers(data))
    .catch(console.error);
}, [token]);

useEffect(() => {
  fetch('http://127.0.0.1:8080/api/Sanjaghak/warehouse/getAllWarehouse', {
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  })
    .then(res => res.json())
    .then(data => setWarehouses(data))
    .catch(console.error);
}, [token]);
const filteredPurchases = orders.filter((p) => {
  const matchesStatus =
    statusFilter === "همه موارد" || statusMap[p.status] === statusFilter;

  const matchesSupplier =
    supplierFilter === "همه موارد" || p.suppliersId?.suppliersId === supplierFilter;

  const matchesWarehouse =
    warehouseFilter === "همه موارد" || p.warehouseId?.warehouseId === warehouseFilter;

  const matchesSearch =
    searchText === "" ||
    p.orderNumber?.includes(searchText) ||
    getSupplierName(p.suppliersId?.suppliersId).includes(searchText);

  return matchesStatus && matchesSupplier && matchesWarehouse && matchesSearch;
});
  const totalPages = Math.ceil(filteredPurchases.length / itemsPerPage);

  const paginatedPurchases = filteredPurchases.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToPage = (pageNum) => {
    if (totalPages === 0) return;
    const num = Math.max(1, Math.min(pageNum, totalPages));
    setCurrentPage(num);
  };

  const handleAddClick = () => {
    navigate('/admin/ثبت-سفارش');
  };

  const handleRowClick = (purchase) => {
    setSelectedPurchase(purchase);
    setIsFactorOpen(true);
  };

  const closeFactorModal = () => {
    setIsFactorOpen(false);
    setSelectedPurchase(null);
  };

  return (
    <div className="purchase-page">
      <div className="purchase-filters">
        <input
          type="text"
          placeholder="جستجو با شماره سفارش یا نام تامین‌کننده"
          value={searchText}
          onChange={(e) => {
            setSearchText(e.target.value);
            setCurrentPage(1);
          }}
        />

        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="همه موارد">همه وضعیت‌ها</option>
          <option value="در حال پردازش">در حال پردازش</option>
          <option value="در حال ارسال">در حال ارسال</option>
          <option value="دریافت‌شده">دریافت‌شده</option>
          <option value="لغوشده">لغوشده</option>
        </select>

<select
  value={supplierFilter}
  onChange={(e) => {
    setSupplierFilter(e.target.value);s
    setCurrentPage(1);
  }}
>
  <option value="همه موارد">همه تامین‌کنندگان</option>
  {suppliers.map(s => (
    <option key={s.suppliersId} value={s.suppliersId}>
      {s.supplierName}
    </option>
  ))}
</select>

<select
  value={warehouseFilter}
  onChange={(e) => {
    setWarehouseFilter(e.target.value);
    setCurrentPage(1);
  }}
>
  <option value="همه موارد">همه انبارها</option>
  {warehouses.map(w => (
    <option key={w.warehouseId} value={w.warehouseId}>
      {w.name}
    </option>
  ))}
</select>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '88%',
          direction: 'rtl',
          padding: '10px 0px',
        }}
      >
        <h2>سفارش های خرید</h2>
        <div style={{display: "flex", alignItems: "center", gap: "10px"}}>
          <button className="add-warehouse-button" onClick={handleAddClick}>
            + ثبت سفارش جدید
          </button>
          <button className="downloadbutton" title="دانلود">
            <img src={download} alt="دانلود" />
          </button>
        </div>
      </div>
      <br />
      <table className="purchase-table">
        <thead>
          <tr>
            <th>شماره سفارش</th>
            <th>تأمین‌کننده</th>
            <th>انبار</th>
            <th>تاریخ ثبت</th>
            <th>تاریخ دریافت</th>
            <th>وضعیت</th>
            <th>مبلغ کل</th>
          </tr>
        </thead>
<tbody>
  {paginatedPurchases.length === 0 ? (
    <tr>
      <td colSpan={7} style={{ textAlign: 'center', padding: 20 }}>موردی یافت نشد</td>
    </tr>
  ) : (
    paginatedPurchases.map((purchase) => (
      <tr key={purchase.purchaseOrdersId} onClick={() => handleRowClick(purchase)} style={{ cursor: 'pointer' }}>
        <td>{purchase.orderNumber}</td>
        <td>{getSupplierName(purchase.suppliersId?.suppliersId)}</td>
        <td>{getWarehouseName(purchase.warehouseId?.warehouseId)}</td>
        <td>{new Date(purchase.orderDate).toLocaleDateString('fa-IR')}</td>
        <td>{purchase.expectedDate || '—'}</td>
        <td>
          <span className={`status-badge ${
            purchase.status === 'Processing'
              ? 'pending'
              : purchase.status === 'Received'
              ? 'received'
              : purchase.status === 'Shipping'
              ? 'sending'
              : 'cancelled'
          }`}>
            {statusMap[purchase.status] || purchase.status}
          </span>
        </td>
        <td>{purchase.totalAmount.toLocaleString()} تومان</td>
      </tr>
    ))
  )}
</tbody>
      </table>

      <div className="pagination">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          قبلی
        </button>

        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            className={currentPage === i + 1 ? 'active-page' : ''}
            onClick={() => goToPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}

        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          بعدی
        </button>

        <div className="goto-page-box">
          <input
            type="number"
            min="1"
            max={totalPages}
            placeholder="شماره صفحه..."
            value={pageInput}
            onChange={(e) => setPageInput(e.target.value)}
          />
          <button onClick={() => goToPage(Number(pageInput))}>برو</button>
        </div>
      </div>

    </div>
  );
}

export default PurchasePage;