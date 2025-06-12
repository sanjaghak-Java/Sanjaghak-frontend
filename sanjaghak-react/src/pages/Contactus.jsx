import React from 'react';
import '/src/styles/contactus.css';
import Navbar from "./navbar";
import Footer from "./Footer";

import headImg from '/src/assets/Frame 1890166319.jpg';
import logoImg from '/src/assets/sanjaghak-logo.png';
import communicationIcon from '/src/assets/icons8-communication-32.png';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIconPng from 'leaflet/dist/images/marker-icon.png';

const markerIcon = new L.Icon({
    iconUrl: markerIconPng,
    iconRetinaUrl: markerIconPng,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: null,
    shadowSize: null,
    shadowAnchor: null,
});

function Contactus() {
    const position = [38.05779661564375, 46.3384125754237];

    return (
        <>
            <Navbar />
            <div className='contactus-head'>
                <img src={headImg} alt="header" className='contactus-head-img' />
                <p className='contactus-head-p'>تماس با</p>
                <img src={logoImg} alt="سنجاقک لوگو" className='contactus-head-logo' />
            </div>
            <div className='contactus-upbody'>
                <img src={communicationIcon} alt="communication icon" className='contactus-upbody-img' />
                <p className='contactus-upbody-title'>
                    با <span id='contactus-span'>سنجاقک</span> در ارتباط باشید
                </p>
            </div>
            <p className='contactus-upbody-p'>
                ما همیشه آماده پاسخگویی به سوالات شما هستیم. اگر درباره محصولات، نحوه خرید، ارسال سفارش یا هر موضوع دیگری سوالی دارید، تیم پشتیبانی سنجاقک در کنار شماست.
                با ما از طریق فرم تماس زیر تماس بگیرید یا ایمیل بزنید.
                ما قصد داریم ظرف ۱-۲ روز کاری به شما پاسخ دهیم. رضایت شما اولویت ماست.
            </p>

            <div className='contactus-body'>
                <MapContainer
                    center={position}
                    zoom={13}
                    className="contactus-map"
                    scrollWheelZoom={false}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={position} icon={markerIcon}>
                        <Popup>موقعیت مورد نظر شما</Popup>
                    </Marker>
                </MapContainer>
                <div className='contactus-body-info'>
                    <div className='contactus-Support'>
                        <img src="/src/assets/support.png" alt="" className='contactus-Support-img' />
                        <p className='contactus-Support-p'>پشتیبانی 7/24 </p>
                    </div>
                    <p id='phone-num'>041-33333333      041-11111111</p>
                    <div className='contactus-Support'>
                        <img src="/src/assets/vector.png" alt="" className='contactus-Support-img' />
                        <p className='contactus-Support-p'>ایمیل</p>
                    </div>
                    <p id='gmail-add'>sanjaghak@gmail.com</p>
                    <div className='contactus-Support'>
                        <img src="/src/assets/marker-pin.png" alt="" className='contactus-Support-img' />
                        <p className='contactus-Support-p'>آدرس حضوری</p>
                    </div>
                    <p id='address'>تبریز ، دانشگاه تبریز ، دانشکده مهندسی برق و کامپیوتر</p>
                </div>
            </div>

            <Footer />
        </>
    );
}

export default Contactus;
