import "/src/styles/SupplierList.css";
import edit from "../assets/edit.png";
import bin from "../assets/bin.png";
import AddSupplier from "./AddSupplier";
import ModalConfirm from "./ModalConfirm";
import React, { useState, useEffect } from "react";

function SupplierList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageInput, setPageInput] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
const [suppliers, setSuppliers] = useState([]);
const [loadingSuppliers, setLoadingSuppliers] = useState(true);
  const [supplierToDelete, setSupplierToDelete] = useState(null);
  const [editingSupplier, setEditingSupplier] = useState(null);

  const itemsPerPage = 5;

const filteredSuppliers = suppliers.filter((supplier) =>
  supplier.supplierName.toLowerCase().includes(searchTerm.toLowerCase())
);

  const totalPages = Math.ceil(filteredSuppliers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSuppliers = filteredSuppliers.slice(startIndex, startIndex + itemsPerPage);
useEffect(() => {
  const fetchSuppliers = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8080/api/Sanjaghak/suppliers/getAllSuppliers");
      if (!res.ok) throw new Error("خطا در دریافت تامین‌کننده‌ها");
      const data = await res.json();
      setSuppliers(data);
    } catch (err) {
      console.error("دریافت تامین‌کننده‌ها ناموفق بود:", err);
    } finally {
      setLoadingSuppliers(false);
    }
  };

  fetchSuppliers();
}, []);
  const handleAddClick = () => {
    setEditingSupplier(null);
    setIsAddModalOpen(true);
  };

const handleAddSupplier = async (formData) => {
  const token = localStorage.getItem("token");

  const payload = {
    supplierName: formData.name,
    supplierEmail: formData.email,
    supplierPhone: formData.phone,
    city: formData.city,
    state: formData.province,
    country: formData.country,
    postalCode: formData.postalCode,
    supplierAddress: formData.address,
  };

  try {
    let response;
    if (editingSupplier) {
      response = await fetch(`http://127.0.0.1:8080/api/Sanjaghak/suppliers/${editingSupplier.suppliersId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "خطا در ویرایش تأمین‌کننده");
      }

      const updatedSupplier = await response.json();

setSuppliers((prev) =>
  prev.map((s) => (s.suppliersId === editingSupplier.suppliersId ? updatedSupplier : s))
);
    } else {
      response = await fetch("http://127.0.0.1:8080/api/Sanjaghak/suppliers/addSuppliers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "خطا در ذخیره تأمین‌کننده");
      }

      const savedSupplier = await response.json();
      setSuppliers((prev) => [...prev, savedSupplier]);
    }

    setIsAddModalOpen(false);
    setEditingSupplier(null);
  } catch (error) {
    alert(error.message);
    console.error(error);
  }
};

  const handleDeleteClick = (supplier) => {
    setSupplierToDelete(supplier);
    setIsDeleteModalOpen(true);
  };

const handleEditClick = (supplier) => {
  console.log("Editing supplier:", supplier);
  setEditingSupplier(supplier);
  setIsAddModalOpen(true);
};

const handleConfirmDelete = () => {
  const token = localStorage.getItem("token");

  fetch(`http://127.0.0.1:8080/api/Sanjaghak/suppliers/${supplierToDelete.suppliersId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      if (!response.ok) {
        return response.json().then((error) => {
          throw new Error(error.message || "خطا در حذف تأمین‌کننده");
        });
      }
      return response;
    })
    .then(() => {
      setSuppliers((prev) =>
        prev.filter((s) => s.suppliersId !== supplierToDelete.suppliersId)
      );
      setSupplierToDelete(null);
      setIsDeleteModalOpen(false);
    })
    .catch((error) => {
      alert(error.message);
      console.error(error);
    });
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
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "88%",
          direction: "rtl",
          padding: "10px 0px",
          }}
      >
        <h2>لیست تخفیف‌ها</h2>
        <button className="add-warehouse-button" onClick={handleAddClick}>
            + افزودن تأمین‌کننده
        </button>
      </div>
      <table className="supplier-table">
        <thead>
          <tr>
            <th>ردیف</th>
            <th>نام تأمین‌کننده</th>
            <th>ایمیل</th>
            <th>شماره تماس</th>
            <th>آدرس</th>
            <th>کدپستی</th>
            <th>ویرایش/حذف</th>
          </tr>
        </thead>
        <tbody>
          {paginatedSuppliers.map((supplier, index) => (
  <tr key={index}>
    <td>{startIndex + index + 1}</td>
    <td>{supplier.supplierName}</td>
    <td>{supplier.supplierEmail}</td>
    <td>{supplier.supplierPhone}</td>
    <td>{supplier.supplierAddress}</td>
    <td>{supplier.postalCode}</td>
              <td>
                <button className="admin-edit-button" onClick={() => handleEditClick(supplier)}>
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
          initialData={editingSupplier}
        />
      )}

      {isDeleteModalOpen && (
        <ModalConfirm
          message={`آیا از حذف "${supplierToDelete?.supplierName}" اطمینان دارید؟`}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </div>
  );
}

export default SupplierList;
