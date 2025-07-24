import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "/src/styles/SupplierList.css";

const sampleSuppliers = [
  { id: 1, name: "نام شرکت", email: "email@example.com", phone: "021-12121", address: "آدرس شرکت" },
  { id: 2, name: "نام شرکت", email: "email@example.com", phone: "021-12121", address: "آدرس شرکت" },
  { id: 3, name: "نام شرکت", email: "email@example.com", phone: "021-12121", address: "آدرس شرکت" },
  { id: 4, name: "نام شرکت", email: "email@example.com", phone: "021-12121", address: "آدرس شرکت" },
  { id: 5, name: "نام شرکت", email: "email@example.com", phone: "021-12121", address: "آدرس شرکت" },
  { id: 6, name: "نام شرکت", email: "email@example.com", phone: "021-12121", address: "آدرس شرکت" },
  { id: 7, name: "نام شرکت", email: "email@example.com", phone: "021-12121", address: "آدرس شرکت" },
  { id: 8, name: "نام شرکت", email: "email@example.com", phone: "021-12121", address: "آدرس شرکت" }
];

function SupplierList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageInput, setPageInput] = useState("");

  const itemsPerPage = 5;
  const navigate = useNavigate();

  const filteredSuppliers = sampleSuppliers.filter((supplier) =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredSuppliers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSuppliers = filteredSuppliers.slice(startIndex, startIndex + itemsPerPage);

  const handleAddClick = () => {
    navigate("/admin/افزودن تامین‌کننده");
  };

  const goToPage = (pageNum) => {
    const num = Math.max(1, Math.min(pageNum, totalPages));
    setCurrentPage(num);
  };

  return (
    <div className="supplier-container">
      <div className="search-patrt-admin">
        <input
          type="text"
          placeholder="جستجو بر اساس نام تأمین‌کننده..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="supplier-search"
        />
      </div>

      <table className="supplier-table">
        <thead>
          <tr>
            <th>ردیف</th>
            <th>نام تأمین‌کننده</th>
            <th>ایمیل</th>
            <th>شماره تماس</th>
            <th>آدرس</th>
          </tr>
        </thead>
        <tbody>
          {paginatedSuppliers.map((supplier, index) => (
            <tr key={supplier.id}>
              <td>{startIndex + index + 1}</td>
              <td>{supplier.name}</td>
              <td>{supplier.email}</td>
              <td>{supplier.phone}</td>
              <td>{supplier.address}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="add-button-container">
        <button onClick={handleAddClick}>+ افزودن</button>
      </div>

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
    </div>
  );
}

export default SupplierList;
