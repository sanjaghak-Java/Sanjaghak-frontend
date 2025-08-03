import React, { useState } from 'react';
import "/src/styles/RequestPage.css";
import Slider from 'react-slider';
import RequestDetailsModal from './RequestDetailsModal'
import DatePicker from "react-multi-date-picker";
import download from '../assets/download.png';

const menuData = {
  "همه موارد": [],
  "خریدها": ["در حال پردازش", "تحویل داده شده"],
  "مرجوعی‌ها": ["تائید شده", "رد شده", "در حال بررسی"],
  "لغو شده‌ها": ["تائید شده", "رد شده", "در حال بررسی"],
};

const sampleRequests = [
  {
    id: 'RQ-2001',
    requester: 'کاربر الف',
    type: 'خرید',
    status: 'در حال پردازش',
    date: '1403/05/01',
    totalAmount: '1,800,000',
    address: 'تهران، خیابان آزادی، پلاک 12',
    items: [
      { id: 1, name: "لپ‌تاپ ایسوس", unitPrice: "1,000,000", quantity: 1, totalPrice: "1,000,000" },
      { id: 2, name: "ماوس بی‌سیم", unitPrice: "400,000", quantity: 2, totalPrice: "800,000" }
    ],
    totals: {
      subtotal: "1,800,000",
      tax: "180,000",
      shipping: "60,000",
      finalPrice: "2,040,000"
    }
  },
  {
    id: 'RQ-2002',
    requester: 'کاربر ب',
    type: 'مرجوعی',
    status: 'رد شده',
    date: '1403/05/03',
    totalAmount: '2,700,000',
    address: 'مشهد، بلوار وکیل‌آباد، پلاک 45',
    items: [
      { id: 1, name: "هدفون", unitPrice: "1,350,000", quantity: 2, totalPrice: "2,700,000" }
    ],
    totals: {
      subtotal: "2,700,000",
      tax: "270,000",
      shipping: "0",
      finalPrice: "2,970,000"
    },
    returnReason: "خرابی صدا",
    description: "یک سمت هدفون کار نمی‌کند."
  },
  {
    id: 'RQ-2003',
    requester: 'کاربر الف',
    type: 'لغو خرید',
    status: 'تائید شده',
    date: '1403/05/25',
    totalAmount: '950,000',
    address: 'اصفهان، میدان نقش جهان، پلاک 88',
    items: [
      { id: 1, name: "کیبورد مکانیکی", unitPrice: "950,000", quantity: 1, totalPrice: "950,000" }
    ],
    totals: {
      subtotal: "950,000",
      tax: "95,000",
      shipping: "20,000",
      finalPrice: "1,065,000"
    },
    description: "لغو به علت تغییر نظر."
  },
  {
    id: 'RQ-2004',
    requester: 'کاربر ب',
    type: 'مرجوعی',
    status: 'در حال بررسی',
    date: '1403/05/03',
    totalAmount: '2,700,000',
    address: 'تبریز، خیابان طالقانی، پلاک 22',
    items: [
      { id: 1, name: "گوشی سامسونگ", unitPrice: "2,700,000", quantity: 1, totalPrice: "2,700,000" }
    ],
    totals: {
      subtotal: "2,700,000",
      tax: "270,000",
      shipping: "50,000",
      finalPrice: "3,020,000"
    },
    returnReason: "کالا معیوب است",
    description: "صفحه نمایش گوشی شکسته است."
  },
  {
    id: 'RQ-2005',
    requester: 'کاربر ج',
    type: 'لغو خرید',
    status: 'رد شده',
    date: '1403/05/25',
    totalAmount: '950,000',
    address: 'شیراز، خیابان زند، پلاک 10',
    items: [
      { id: 1, name: "کارت گرافیک", unitPrice: "950,000", quantity: 1, totalPrice: "950,000" }
    ],
    totals: {
      subtotal: "950,000",
      tax: "95,000",
      shipping: "20,000",
      finalPrice: "1,065,000"
    },
    description: "کاربر منصرف شد."
  },
  {
    id: 'RQ-2006',
    requester: 'کاربر الف',
    type: 'خرید',
    status: 'تحویل داده شده',
    date: '1403/05/25',
    totalAmount: '50,000',
    address: 'رشت، خیابان معلم، پلاک 55',
    items: [
      { id: 1, name: "کابل USB-C", unitPrice: "50,000", quantity: 1, totalPrice: "50,000" }
    ],
    totals: {
      subtotal: "50,000",
      tax: "5,000",
      shipping: "10,000",
      finalPrice: "65,000"
    }
  }
];


const parsePersianDate = (dateStr) => parseInt(dateStr.replaceAll("/", ""));
const formatPersianDate = (num) => {
  const str = num.toString();
  return `${str.substring(0, 4)}/${str.substring(4, 6)}/${str.substring(6)}`;
};

const categoryToTypeMap = {
  "خریدها": "خرید",
  "مرجوعی‌ها": "مرجوعی",
  "لغو شده‌ها": "لغو خرید",
};

function RequestPage() {
  const [openMainMenu, setOpenMainMenu] = useState(false);
  const [openSubMenu, setOpenSubMenu] = useState(null);
  const [openDateFilter, setOpenDateFilter] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageInput, setPageInput] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const allDates = sampleRequests.map(r => parsePersianDate(r.date));
  const minDate = Math.min(...allDates);
  const maxDate = Math.max(...allDates);
  const [dateRange, setDateRange] = useState([minDate, maxDate]);

  const filteredRequests = sampleRequests.filter(r => {
    const matchesSearch = r.id.includes(searchText) || r.requester.includes(searchText);
    const rDate = parsePersianDate(r.date);
    const inDateRange = rDate >= dateRange[0] && rDate <= dateRange[1];

    if (!selectedStatus) return matchesSearch && inDateRange;

    const expectedType = categoryToTypeMap[selectedStatus.category];

    return (
      matchesSearch &&
      r.type === expectedType &&
      (selectedStatus.status === null || r.status === selectedStatus.status) &&
      inDateRange
    );
  });

  const itemsPerPage = 4;
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);

  const paginatedData = filteredRequests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToPage = (pageNum) => {
    const num = Math.max(1, Math.min(pageNum, totalPages));
    setCurrentPage(num);
  };

  const [selectedRequest, setSelectedRequest] = useState(null);

  const openModal = (request) => {
    setSelectedRequest(request);
    setModalOpen(true);
  };


  return (
    <div className="request-page">
      <div
        className="request-filters"
        style={{
          position: "relative",
          display: "flex",
          gap: "20px",
          alignItems: "center",
          padding: "10px 0"
        }}
      >
        <input
          type="text"
          placeholder="جستجو با شماره یا درخواست‌کننده"
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          style={{ flex: 1, padding: "6px 10px", fontSize: "14px" }}
        />

        <div
          className={`request-main-menu-title ${openMainMenu ? "open" : ""}`}
          onMouseEnter={() => setOpenMainMenu(true)}
          onMouseLeave={() => {
            setOpenMainMenu(false);
            setOpenSubMenu(null);
          }}
        >
          درخواست‌ها
          {openMainMenu && (
            <ul
              className="main-menu">
              {Object.entries(menuData).map(([mainKey, subItems]) => (
                <li
                  key={mainKey}
                  onMouseEnter={() => setOpenSubMenu(mainKey)}
                  onMouseLeave={() => setOpenSubMenu(null)}
                  onClick={() => {
                    if (mainKey === "همه موارد") {
                      setSelectedStatus(null);
                    } else if (categoryToTypeMap[mainKey]) {
                      setSelectedStatus({ category: mainKey, status: null });
                      setOpenMainMenu(false);
                      setOpenSubMenu(null);
                    }
                  }}

                >
                  {mainKey}
                  {subItems.length > 0 && openSubMenu === mainKey && (
                    <ul
                      className="sub-menu">
                      {subItems.map(subItem => (
                        <li
                          key={subItem}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedStatus({ category: mainKey, status: subItem });
                            setOpenMainMenu(false);
                            setOpenSubMenu(null);
                          }}
                        >
                          {subItem}
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div
          className={`request-main-menu-title ${openDateFilter ? "open" : ""}`}
          onMouseEnter={() => setOpenDateFilter(true)}
          onMouseLeave={() => setOpenDateFilter(false)}
        >
          بازه تاریخ

          {openDateFilter && (
            <div
              className="date-range-filter-menu">
              <p>
                بازه تاریخ: {formatPersianDate(dateRange[0])} - {formatPersianDate(dateRange[1])}
              </p>
              <Slider
                className="date-slider"
                value={dateRange}
                min={minDate}
                max={maxDate}
                step={1}
                onChange={setDateRange}
                pearling
                minDistance={1}
              />
            </div>
          )}
        </div>
      </div>
      <div className="request-title-div">
        <h2>لیست درخواست‌ها</h2>
        <div>
          {selectedStatus && (
            <>
              {/* {(selectedStatus.status === "در حال بررسی" && (
                <>
                  <button id="reject-butt">رد کردن همه</button>
                  <button id="confirm-butt">تایید کردن همه</button>
                </>
              ))} */}

              {(selectedStatus.category === "خریدها" && selectedStatus.status === "در حال پردازش") && (
                <button id="Report-butt">گزارش به انبار</button>
              )}

          {(["خریدها", "مرجوعی‌ها", "لغو شده‌ها"].includes(selectedStatus.category) &&
            ["در حال پردازش", "تحویل داده شده", "تائید شده", "رد شده", "در حال بررسی"].includes(selectedStatus.status)
          ) && (
            <button className="downloadbutton" title="دانلود">
              <img src={download} alt="دانلود" />
            </button>
          )}

            </>
          )}
        </div>
      </div>

      <table className="request-table">
        <thead>
          <tr>
            <th>کد</th>
            <th>درخواست‌کننده</th>
            <th>تاریخ</th>
            <th>نوع</th>
            <th>وضعیت</th>
            <th>مبلغ</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map(req => (
            <tr
              key={req.id}
              onClick={() => openModal(req)}
              style={{ cursor: "pointer" }}
            >
              <td>{req.id}</td>
              <td>{req.requester}</td>
              <td>{req.date}</td>
              <td>
                <span className={`request-type ${
                  req.type === "خرید" ? "order" :
                  req.type === "مرجوعی" ? "return" : "cancel"
                }`}>
                  {req.type}
                </span>
              </td>
              <td>
                <span className={`request-status-badge ${
                  req.status === "رد شده" ? "rejected" :
                  (req.status === "تائید شده" || req.status === "تحویل داده شده") ? "approved" :
                  "pending"
                }`}>
                  {req.status}
                </span>
              </td>
              <td>{req.totalAmount} تومان</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
          قبلی
        </button>

        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            className={currentPage === i + 1 ? "active-page" : ""}
            onClick={() => goToPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}

        <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>
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

      <RequestDetailsModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        request={selectedRequest}
      />
    </div>
  );
}

export default RequestPage;
