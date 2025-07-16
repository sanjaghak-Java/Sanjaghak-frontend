

import "/src/styles/adminproductdetail.css";

function AdminProductDetail({ product, onBack }) {
  return (
    <div className="adminProductDetailContainer" style={{ maxWidth: 800, margin: 'auto', padding: 20 }}>
      <button className="adminBackButton" onClick={onBack} style={{ marginBottom: 20 }}>
        بازگشت به لیست
      </button>
      <h1 className="adminProductDetail__name">{product.name}</h1>
      <img
        src={product.image}
        alt={product.name}
        className="adminProductDetail__image"
        style={{ width: '100%', maxWidth: 400, borderRadius: 16 }}
      />
      <p className="adminProductDetail__info"><strong>قیمت:</strong> {product.price.toLocaleString()} تومان</p>
      <p className="adminProductDetail__info"><strong>دسته:</strong> {product.category}</p>
      <p className="adminProductDetail__info"><strong>برند:</strong> {product.brand}</p>
      <p className="adminProductDetail__info"><strong>توضیحات:</strong> {product.description || 'بدون توضیحات'}</p>
    </div>
  );
}
export default AdminProductDetail