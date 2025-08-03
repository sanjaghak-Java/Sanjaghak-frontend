import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AddPurchaseFactor from './AddPurchaseFactor';
import "/src/styles/PurchasePage.css";
import download from '../assets/download.png';

const samplePurchases = [
  {
    id: 'PO-1001',
    supplier: 'شرکت الف',
    warehouse: 'انبار مرکزی',
    date: '1403/05/01',
    status: 'در حال پردازش',
    totalAmount: '5,400,000',
    receivedDate: null,
  },
  {
    id: 'PO-1002',
    supplier: 'شرکت ب',
    warehouse: 'انبار تبریز',
    date: '1403/05/03',
    status: 'دریافت‌شده',
    totalAmount: '2,150,000',
    receivedDate: '1403/05/10',
  },
  {
    id: 'PO-1003',
    supplier: 'شرکت الف',
    warehouse: 'انبار تبریز',
    date: '1403/05/05',
    status: 'لغوشده',
    totalAmount: '3,000,000',
    receivedDate: null,
  },
  {
    id: 'PO-1004',
    supplier: 'شرکت ب',
    warehouse: 'انبار شیراز',
    date: '1403/05/07',
    status: 'در حال ارسال',
    totalAmount: '4,200,000',
    receivedDate: null,
  },
];

function PurchasePage() {
  const [statusFilter, setStatusFilter] = useState('همه موارد');
  const [supplierFilter, setSupplierFilter] = useState('همه موارد');
  const [searchText, setSearchText] = useState('');

  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const [isFactorOpen, setIsFactorOpen] = useState(false);

  const filteredPurchases = samplePurchases.filter((p) => {
    const matchesStatus =
      statusFilter === 'همه موارد' || p.status === statusFilter;
    const matchesSupplier =
      supplierFilter === 'همه موارد' || p.supplier === supplierFilter;
    const matchesSearch =
      p.id.includes(searchText) || p.supplier.includes(searchText);

    return matchesStatus && matchesSupplier && matchesSearch;
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [pageInput, setPageInput] = useState('');
  const itemsPerPage = 4;

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

  const navigate = useNavigate();

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
            setSupplierFilter(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="همه موارد">همه تامین‌کنندگان</option>
          <option value="شرکت الف">شرکت الف</option>
          <option value="شرکت ب">شرکت ب</option>
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
              <td colSpan={7} style={{ textAlign: 'center', padding: 20 }}>
                موردی یافت نشد
              </td>
            </tr>
          ) : (
            paginatedPurchases.map((purchase) => (
              <tr
                key={purchase.id}
                onClick={() => handleRowClick(purchase)}
                style={{ cursor: 'pointer' }}
              >
                <td>{purchase.id}</td>
                <td>{purchase.supplier}</td>
                <td>{purchase.warehouse}</td>
                <td>{purchase.date}</td>
                <td>
                  {purchase.status === 'دریافت‌شده' && purchase.receivedDate
                    ? purchase.receivedDate
                    : '—'}
                </td>

                <td>
                  <span
                    className={`status-badge ${
                      purchase.status === 'در حال پردازش'
                        ? 'pending'
                        : purchase.status === 'دریافت‌شده'
                        ? 'received'
                        : purchase.status === 'در حال ارسال'
                        ? 'sending'
                        : 'cancelled'
                    }`}
                  >
                    {purchase.status}
                  </span>
                </td>
                <td>{purchase.totalAmount} تومان</td>
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

      {isFactorOpen && selectedPurchase && (
        <AddPurchaseFactor
          isOpen={isFactorOpen}
          onClose={closeFactorModal}
          purchase={selectedPurchase}
        />
      )}
    </div>
  );
}

export default PurchasePage;
