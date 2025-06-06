import "/src/styles/product.css";
import { Link } from 'react-router-dom';
import Navbar from "./navbar";
import Footer from "./Footer";
import ProductIntroduction from "./PorductIntroduction";
import React, { useRef, useState } from 'react';
import Cartreport from './Cartreport';
import ProductDetail from "./Productdetail";

function Product() {
    const [showCartReport, setShowCartReport] = useState(false);

    const handleAddToCart = () => setShowCartReport(true);
    const handleCloseCartReport = () => setShowCartReport(false);

    const introRef = useRef(null);
    const specsRef = useRef(null);

    const scrollToSection = (ref) => {
        if (ref.current) {
            ref.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <>
            <Navbar />
            <ProductDetail onAddToCart={handleAddToCart} />

            <hr className="hr-side" />

            <div className="Information">
                <input
                    type="radio"
                    name="section"
                    value="intro"
                    id="intro"
                    className="Introduction"
                    onChange={() => scrollToSection(introRef)}
                />
                <label htmlFor="intro">معرفی</label>

                <input
                    type="radio"
                    name="section"
                    value="specs"
                    id="specs"
                    className="specs"
                    onChange={() => scrollToSection(specsRef)}
                />
                <label htmlFor="specs">مشخصات</label>
            </div>

            <ProductIntroduction introRef={introRef} />
            <p className="Information-title" ref={specsRef}>مشخصات</p>

            {showCartReport && <Cartreport onClose={handleCloseCartReport} />}
            <Footer />
        </>
    );
}

export default Product;
