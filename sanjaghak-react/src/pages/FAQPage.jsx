import React, { useState } from 'react';
import Navbar from './navbar';    
import Footer from './Footer';    
import '/src/styles/FAQPage.css';
import more from  "../assets/arrow-up.png"; 

const faqs = [
  {
    question: "روش‌های پرداخت چه چیزهایی هستند؟",
    answer: [
      "می‌توانید با کارت بانکی پرداخت کنید.",
    ]
  },
  {
    question: "هزینه و زمان ارسال چقدر است؟",
    answer: [
      "سفارش‌ها معمولا بین ۲ تا ۵ روز کاری تحویل داده می‌شوند.",
      "هزینه ارسال بسته به شهر و وزن کالا متفاوت است."
    ]
  },
  {
    question: "شرایط بازگشت و مرجوعی کالا چیست؟",
    answer: [
      "می‌توانید کالای خریداری شده را تا 2 روز پس از تحویل بسته مرجوع کنید.",
      "کالا باید بدون ضربه و آسیب و در بسته‌بندی اصلی باشد."
    ]
  },
  {
    question: "نحوه ثبت سفارش چگونه است؟",
    answer: [
      "برای ثبت سفارش کافی است کالای مورد نظر را به سبد خرید اضافه کنید و مراحل پرداخت را انجام دهید.",
      "داشتن حساب کاربری برای ثبت سفارش الزامی است."
    ]
  },
  {
    question: "نحوه تماس با پشتیبانی چگونه است؟",
    answer: [
      "برای تماس با پشتیبانی می‌توانید از شماره تلفن 33340081-041 استفاده کنید."
    ]
  }
];

function FAQPage() {
  const [openIndexes, setOpenIndexes] = useState([]);

  const toggleAnswer = (index) => {
    setOpenIndexes(prev => {
      if (prev.includes(index)) {
        return prev.filter(i => i !== index);
      } else {
        return [...prev, index];
      }
    });
  }

  return (
    <div>
      <Navbar/>
      <div>
        <img src="/src/assets/realistic-phone-studio-social-media-concept.jpg" alt="" className='rulesimg' />
        <p className='FAQp'>سوالات متداول</p>
      </div>
      
      <div className="Maincontent1">
        <img src="./src/assets/sanjaghak-logo.png" alt="" className='aboutus-body-logo' />
        <div className="divscontainor">
          {faqs.map((faq, index) => {
            const isOpen = openIndexes.includes(index);
            return (
              <div key={index} className={`questiondiv ${isOpen ? "open" : ""}`}>
                <div className="titleandbutton">
                  <h3 className="questiontitle">{faq.question}</h3>
                  <button className='morebuttons' onClick={() => toggleAnswer(index)}>
                    <img
                      src={more}
                      alt={isOpen ? "بستن پاسخ" : "نمایش پاسخ"}
                      style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s ease" }}
                    />
                  </button>
                </div>
                {isOpen && (
                  <div className="answerdiv">
                    <span>✓</span>
                    {faq.answer.map((line, i) => (
                      <p key={i}>{line}</p>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <Footer/>
    </div>
  );
}

export default FAQPage;
