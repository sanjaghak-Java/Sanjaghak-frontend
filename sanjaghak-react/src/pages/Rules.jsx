import React from 'react';
import Navbar from './navbar';    
import Footer from './Footer';    
import '/src/styles/Rules.css';

function Rules() {
  return (
    <div>
        <Navbar/>
        <div>
            <img src="/src/assets/modern-smartphone-with-live-abstract-wallpaper-coming-out-screen.jpg" alt="" className='rulesimg' />
            <p className='rulesp'>شرایط و قوانین سنجاقک</p>
        </div>
        <div className="maincontainorrules">
            <img src="./src/assets/sanjaghak-logo.png" alt="" className='aboutus-body-logo' />
            <div className='rulescontainor'>
                <div className="paragraphsdiv">
                    <p className='welcametext'>                        
                        به وب‌سایت ما خوش آمدید.
                    </p>
                    <p className='welcametext'>
                        لطفاً پیش از استفاده از خدمات و امکانات این وب‌سایت، قوانین و مقررات زیر را به دقت مطالعه فرمایید. ورود کاربران به این سایت و استفاده از آن به منزله پذیرش کامل این مقررات می‌باشد. این قوانین جهت حفظ حقوق کاربران و اطمینان از ارائه خدمات منظم و منصفانه تدوین شده‌اند و ممکن است در هر زمان به‌روزرسانی شوند.
                    </p>
                </div>
                <div className="blinking-line"></div>
                <div className="uldiv">
                <h3>۱. حساب کاربری</h3>
                    <ul>
                        <li className="lipart"> کاربران برای خرید از سنجاقک نیاز به ثبت‌نام و ایجاد حساب کاربری دارند.</li>
                        <li className="lipart"> مسئولیت حفظ امنیت اطلاعات حساب (نام کاربری و رمز عبور) بر عهده کاربر است.</li>
                        <li className="lipart"> اطلاعات ثبت‌شده باید صحیح، دقیق و به‌روز باشد. در غیر این صورت سفارش قابل پیگیری نخواهد بود.</li>
                    </ul>

                    <br />

                        <h3>۲. ثبت و پردازش سفارش</h3>
                        <ul>
                            <li className="lipart"> ثبت سفارش به منزله نهایی شدن خرید نیست و ممکن است به دلایلی مانند اتمام موجودی یا مشکل در پرداخت لغو شود.</li>
                            <li className="lipart"> سنجاقک تلاش می‌کند اطلاعات محصولات از جمله قیمت و موجودی به‌روز باشد، اما در صورت بروز خطا، حق لغو سفارش یا اصلاح آن برای فروشگاه محفوظ است.</li>
                        </ul>

                        <br />

                        <h3>۳. ارسال و تحویل سفارش</h3>
                        <ul>
                            <li className="lipart"> زمان تقریبی ارسال سفارش بسته به محل سکونت بین ۲ تا ۵ روز کاری است.</li>
                            <li className="lipart"> مسئولیت تحویل سفارش به صورت صحیح تا درب منزل بر عهده سنجاقک و شرکت پستی طرف قرارداد است.</li>
                        </ul>

                        <br />

                        <h3>۴. بازگشت و تعویض کالا</h3>
                        <ul>
                            <li className="lipart"> بازگشت کالا تنها در صورت آسیب‌دیدگی در حمل‌ونقل یا مغایرت با سفارش ظرف مدت ۴۸ ساعت از زمان تحویل امکان‌پذیر است.</li>
                            <li className="lipart"> محصول باید در وضعیت اولیه و بدون استفاده بازگردانده شود.</li>
                        </ul>

                        <br />

                        <h3>۵. حقوق مالکیت فکری</h3>
                        <ul>
                            <li className="lipart"> تمام محتوا، طراحی‌ها، تصاویر و متون درج‌شده در سایت متعلق به سنجاقک است و هرگونه استفاده غیرمجاز از آن پیگرد قانونی دارد.</li>
                        </ul>

                        <br />

                        <h3>۶. حفظ حریم خصوصی کاربران</h3>
                        <ul>
                            <li className="lipart"> اطلاعات شخصی کاربران صرفاً برای پردازش سفارش و خدمات پس از فروش استفاده می‌شود و به هیچ عنوان در اختیار اشخاص ثالث قرار نمی‌گیرد.</li>
                        </ul>

                        <br />
                    </div>
            </div>
 
        </div>
        

        <Footer/>
    </div>
    
  );
}

export default Rules;
