import React, { useState, useRef, useEffect } from "react";
import "/src/styles/FinancialReport.css";
import { FaCalendar } from "react-icons/fa";
import rec from '../assets/rec.png';
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import gregorian from "react-date-object/calendars/gregorian";
import gregorian_en from "react-date-object/locales/gregorian_en";

const FINANCIAL_DATA = {
  profit: 125_000_000,
  items: 342,
  buy: {
    price: 1_250_000,
    tax: 112_500,
    shipping: 25_000,
    total: 2_000_500,
  },
  sell: {
    price: 1_200_000,
    tax: 11_500,
    shipping: 250_000,
    discount: 5_000,
    quantity: 200,
    total: 1_387_000,
  },
  returned: {
    price: 1_200_000,
    discount: 112_000,
    quantity: 25,
    total: 1_500,
  },
};
import DateObject from "react-date-object";

const formatDateForApi = (dateObj, isStart = true) => {
  if (!dateObj) return null;
  const gDate = dateObj.convert(gregorian, gregorian_en);
  const jsDate = gDate.toDate();
  if (isStart) {
    jsDate.setHours(0, 0, 0, 0);
  } else {
    jsDate.setHours(23, 59, 59, 999);
  }
  return jsDate.toISOString().split(".")[0].trim(); 
};
const getDefaultDates = () => {
  const end = new DateObject({ calendar: persian, locale: persian_fa });
  const start = new DateObject(end).subtract(1, "year"); 
  return { start, end };
};
const formatPrice = (num) => (num ?? 0).toLocaleString("fa-IR") + " تومان";



function DateFilterPanel({ startDate, endDate, setStartDate, setEndDate }) {
  return (
    <div className="filter-floating-panel">
      <div>
        <label>از تاریخ:</label>
        <DatePicker
          calendar={persian}
          locale={persian_fa}
          value={startDate}
          onChange={setStartDate}
          format="YYYY/MM/DD"
          style={{ direction: "rtl", width: "180px" }}
        />
      </div>
      <div>
        <label>تا تاریخ:</label>
        <DatePicker
          calendar={persian}
          locale={persian_fa}
          value={endDate}
          onChange={setEndDate}
          format="YYYY/MM/DD"
          style={{ direction: "rtl", width: "180px" }}
        />
      </div>
    </div>
  );
}

function FinancialReport() {
  const { start: defaultBuyStart, end: defaultBuyEnd } = getDefaultDates();

const [buyStart, setBuyStart] = useState(defaultBuyStart);
const [buyEnd, setBuyEnd] = useState(defaultBuyEnd);
  const [profitFilterOpen, setProfitFilterOpen] = useState(false);
  const [profitStart, setProfitStart] = useState(null);
  const [profitEnd, setProfitEnd] = useState(null);

  const [itemsFilterOpen, setItemsFilterOpen] = useState(false);
  const [itemsStart, setItemsStart] = useState(null);
  const [itemsEnd, setItemsEnd] = useState(null);

  const [buyFilterOpen, setBuyFilterOpen] = useState(false);


  const [sellFilterOpen, setSellFilterOpen] = useState(false);
  const [sellStart, setSellStart] = useState(null);
  const [sellEnd, setSellEnd] = useState(null);

  const [returnFilterOpen, setReturnFilterOpen] = useState(false);
  const [returnStart, setReturnStart] = useState(null);
  const [returnEnd, setReturnEnd] = useState(null);

  const [buyData, setBuyData] = useState(null);
  const [loadingBuy, setLoadingBuy] = useState(false);
  const [errorBuy, setErrorBuy] = useState(null);

  const profitRef = useRef();
  const itemsRef = useRef();
  const buyRef = useRef();
  const sellRef = useRef();
  const returnRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profitRef.current && !profitRef.current.contains(event.target))
        setProfitFilterOpen(false);
      if (itemsRef.current && !itemsRef.current.contains(event.target))
        setItemsFilterOpen(false);
      if (buyRef.current && !buyRef.current.contains(event.target))
        setBuyFilterOpen(false);
      if (sellRef.current && !sellRef.current.contains(event.target))
        setSellFilterOpen(false);
      if (returnRef.current && !returnRef.current.contains(event.target))
        setReturnFilterOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchPurchaseSummary = async () => {
      if (!buyStart || !buyEnd) return; 
      setLoadingBuy(true);
      setErrorBuy(null);
      try {
const start = formatDateForApi(buyStart, true);
const end = formatDateForApi(buyEnd, false);
        const url = `http://127.0.0.1:8080/api/Sanjaghak/report/getPurchaseOrdersSummary?startDate=${encodeURIComponent(
          start
        )}&endDate=${encodeURIComponent(end)}`;

        const res = await fetch(url);
        console.log("Fetching purchase summary:", start, end, url);
        if (!res.ok) {
          const text = await res.text().catch(() => "");
          throw new Error(`سرور خطا داد: ${res.status} ${res.statusText} ${text}`);
        }
        const data = await res.json();
        setBuyData(data);
      } catch (err) {
        setErrorBuy(err.message || "خطا در دریافت اطلاعات");
        setBuyData(null);
      } finally {
        setLoadingBuy(false);
        
      }
    };

    fetchPurchaseSummary();
  }, [buyStart, buyEnd]);

  return (
    <div className="financial-report-container">
      <h1>گزارش مالی</h1>

      <div className="report-boxes">
        <div className="report-box" ref={profitRef}>
          <div className="box-header" style={{ direction: "ltr" }}>
            <button
              title="فیلتر تاریخ"
              className="filter-btn"
              onClick={() => setProfitFilterOpen(!profitFilterOpen)}
            >
              <FaCalendar />
            </button>
          </div>
          <h3 className="report-h3">سود خالص:</h3>
          <p className="report-value">{formatPrice(FINANCIAL_DATA.profit)}</p>

          {profitFilterOpen && (
            <DateFilterPanel
              startDate={profitStart}
              endDate={profitEnd}
              setStartDate={setProfitStart}
              setEndDate={setProfitEnd}
            />
          )}
        </div>

        <div className="report-box" ref={itemsRef}>
          <div className="box-header" style={{ direction: "ltr" }}>
            <button
              title="فیلتر تاریخ"
              className="filter-btn"
              onClick={() => setItemsFilterOpen(!itemsFilterOpen)}
            >
              <FaCalendar />
            </button>
          </div>
          <h3 className="report-h3">تعداد کالاهای تحویل گرفته شده:</h3>
          <p className="report-value">
            {FINANCIAL_DATA.items.toLocaleString("fa-IR")}
          </p>

          {itemsFilterOpen && (
            <DateFilterPanel
              startDate={itemsStart}
              endDate={itemsEnd}
              setStartDate={setItemsStart}
              setEndDate={setItemsEnd}
            />
          )}
        </div>
      </div>

      <div className="first-report" ref={buyRef}>
        <div className="box-header">
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <img src={rec} alt="" style={{ width: "28px", height: "28px" }} />
            <h3 className="secound-report-h3">سفارشات خرید</h3>
          </div>
          <button
            title="فیلتر تاریخ"
            className="filter-btn"
            onClick={() => setBuyFilterOpen(!buyFilterOpen)}
          >
            <FaCalendar />
          </button>
        </div>
        <div className="first-report-box">
          {loadingBuy && <p style={{ marginBottom: 8 }}>در حال بارگذاری...</p>}
          {errorBuy && <p style={{ marginBottom: 8, color: "red" }}>{errorBuy}</p>}

          <table className="finalreport-order-table">
            <thead>
              <tr>
                <th>مبلغ خام</th>
                <th>مالیات</th>
                <th>هزینه ارسال</th>
                <th>جمع کل</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{formatPrice(buyData?.subTotal ?? FINANCIAL_DATA.buy.price)}</td>
                <td>{formatPrice(buyData?.taxAmount ?? FINANCIAL_DATA.buy.tax)}</td>
                <td>{formatPrice(buyData?.shippingCost ?? FINANCIAL_DATA.buy.shipping)}</td>
                <td>{formatPrice(buyData?.totalAmount ?? FINANCIAL_DATA.buy.total)}</td>
              </tr>
            </tbody>
          </table>

          {buyFilterOpen && (
            <DateFilterPanel
              startDate={buyStart}
              endDate={buyEnd}
              setStartDate={setBuyStart}
              setEndDate={setBuyEnd}
            />
          )}
        </div>
      </div>

      <div className="secound-report" ref={sellRef}>
        <div className="box-header">
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <img src={rec} alt="" style={{ width: "28px", height: "28px" }} />
            <h3 className="secound-report-h3">سفارشات فروش</h3>
          </div>
          <button
            title="فیلتر تاریخ"
            className="filter-btn"
            onClick={() => setSellFilterOpen(!sellFilterOpen)}
          >
            <FaCalendar />
          </button>
        </div>
        <div className="secound-report-box">
          <table className="finalreport-order-table">
            <thead>
              <tr>
                <th>مبلغ خام</th>
                <th>مالیات</th>
                <th>هزینه ارسال</th>
                <th>مبلغ تخفیف</th>
                <th>تعداد</th>
                <th>جمع کل</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{formatPrice(FINANCIAL_DATA.sell.price)}</td>
                <td>{formatPrice(FINANCIAL_DATA.sell.tax)}</td>
                <td>{formatPrice(FINANCIAL_DATA.sell.shipping)}</td>
                <td>{formatPrice(FINANCIAL_DATA.sell.discount)}</td>
                <td>{FINANCIAL_DATA.sell.quantity.toLocaleString("fa-IR")}</td>
                <td>{formatPrice(FINANCIAL_DATA.sell.total)}</td>
              </tr>
            </tbody>
          </table>
          {sellFilterOpen && (
            <DateFilterPanel
              startDate={sellStart}
              endDate={sellEnd}
              setStartDate={setSellStart}
              setEndDate={setSellEnd}
            />
          )}
        </div>
      </div>

      <div className="first-report" ref={returnRef}>
        <div className="box-header">
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <img src={rec} alt="" style={{ width: "28px", height: "28px" }} />
            <h3 className="secound-report-h3">سفارشات مرجوعی</h3>
          </div>
          <button
            title="فیلتر تاریخ"
            className="filter-btn"
            onClick={() => setReturnFilterOpen(!returnFilterOpen)}
          >
            <FaCalendar />
          </button>
        </div>
        <div className="first-report-box">
          <table className="finalreport-order-table">
            <thead>
              <tr>
                <th>مبلغ خام</th>
                <th>مبلغ تخفیف</th>
                <th>تعداد</th>
                <th>جمع کل</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{formatPrice(FINANCIAL_DATA.returned.price)}</td>
                <td>{formatPrice(FINANCIAL_DATA.returned.discount)}</td>
                <td>{FINANCIAL_DATA.returned.quantity.toLocaleString("fa-IR")}</td>
                <td>{formatPrice(FINANCIAL_DATA.returned.total)}</td>
              </tr>
            </tbody>
          </table>
          {returnFilterOpen && (
            <DateFilterPanel
              startDate={returnStart}
              endDate={returnEnd}
              setStartDate={setReturnStart}
              setEndDate={setReturnEnd}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default FinancialReport;