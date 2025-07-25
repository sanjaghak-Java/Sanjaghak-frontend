import React, { useState } from "react";
import "/src/styles/SupplierList.css";
import edit from "../assets/edit.png";
import bin from "../assets/bin.png";
import AddSupplier from "./AddSupplier";
import ModalConfirm from "./ModalConfirm";

const sampleSuppliersInitial = [
  { id: 1, name: "نام شرکت 1", email: "email1@example.com", phone: "021-12121", address: "آدرس شرکت 1" },
  { id: 2, name: "نام شرکت 2", email: "email2@example.com", phone: "021-12122", address: "آدرس شرکت 2" },
  { id: 3, name: "نام شرکت 3", email: "email3@example.com", phone: "021-12123", address: "آدرس شرکت 3" },
];

function SupplierList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageInput, setPageInput] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [suppliers, setSuppliers] = useState(sampleSuppliersInitial);
  const [supplierToDelete, setSupplierToDelete] = useState(null);
  const [editingSupplier, setEditingSupplier] = useState(null);

  const itemsPerPage = 5;

  const filteredSuppliers = suppliers.filter((supplier) =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredSuppliers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSuppliers = filteredSuppliers.slice(startIndex, startIndex + itemsPerPage);

  const handleAddClick = () => {
    setEditingSupplier(null);
    setIsAddModalOpen(true);
  };

  const handleAddSupplier = (newSupplier) => {
    if (editingSupplier) {
      setSuppliers(suppliers.map(s => s.id === editingSupplier.id ? { ...s, ...newSupplier } : s));
    } else {
      const newId = suppliers.length ? Math.max(...suppliers.map(s => s.id)) + 1 : 1;
      setSuppliers([...suppliers, { id: newId, ...newSupplier }]);
    }
    setIsAddModalOpen(false);
    setEditingSupplier(null);
  };

  const handleDeleteClick = (supplier) => {
    setSupplierToDelete(supplier);
    setIsDeleteModalOpen(true);
  };

  const handleEditClick = (supplier) => {
    setEditingSupplier(supplier);
    setIsAddModalOpen(true);
  };

  const handleConfirmDelete = () => {
    setSuppliers(suppliers.filter(s => s.id !== supplierToDelete.id));
    setSupplierToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const handleCancelDelete = () => {
    setSupplierToDelete(null);
    setIsDeleteModalOpen(false);
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
            <th>ویرایش/حذف</th>
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
              <td>
                <button
                  className="admin-edit-button"
                  onClick={() => handleEditClick(supplier)}
                >
                  <img src={edit} alt="ویرایش" />
                </button>
                <button
                  className="admin-edit-button"
                  style={{ marginRight: "15px" }}
                  onClick={() => handleDeleteClick(supplier)}
                >
                  <img src={bin} alt="حذف" />
                </button>
              </td>
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

      {isAddModalOpen && (
        <AddSupplier
          onClose={() => {
            setIsAddModalOpen(false);
            setEditingSupplier(null);
          }}
          onSubmit={handleAddSupplier}
          initialData={editingSupplier} // ارسال داده برای ویرایش
        />
      )}

      {isDeleteModalOpen && (
        <ModalConfirm
          message={`آیا از حذف "${supplierToDelete?.name}" اطمینان دارید؟`}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </div>
  );
}

export default SupplierList;
