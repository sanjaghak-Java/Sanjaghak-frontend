import React, { useState } from 'react';
import "/src/styles/profile.css";
import Navbar from './navbar';
import Footer from './Footer';
import CartItem from './CartItem';
import ProfileMenu from './ProfileMenu';
import favorite from '../assets/favorite.png';

function Favorites() {
  const [favoriteItems, setFavoriteItems] = useState([
    // {
    //   id: 1,
    //   productname: 'هدفون بلوتوثی شیائومی',
    //   warranty: 'گارانتی 18 ماهه',
    //   inventory: 'موجود در انبار',
    //   color: 'black',
    //   price: 1200000,
    //   quantity: 1,
    //   image: './src/assets/images (1).jpg',
    // },
    // {
    //   id: 2,
    //   productname: 'لپ‌تاپ لنوو مدل IdeaPad',
    //   warranty: 'گارانتی 24 ماهه',
    //   inventory: 'موجود در انبار',
    //   color: 'gray',
    //   price: 23000000,
    //   quantity: 1,
    //   image: './src/assets/images (2).jpg',
    // }
  ]);

  const handleQuantityChange = (id, newQuantity) => {
    setFavoriteItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  return (
    <>
      <Navbar />
      <div className="profilecontent" style={{ display: 'flex', gap: '20px' }}>
        <ProfileMenu />
        <div className="orderdiv" style={{ flex: 1 }}>
          <div className='favitems'>
            <div className='titleprofile'>
              <img src={favorite} alt="" className='titleimg' />
              <h3 className="titlehprof">علاقه‌مندی‌ها</h3>
            </div>
            <hr />
            <div className="favitemscontainor">
              {favoriteItems.length === 0 ? (
                <p style={{textAlign : 'center', color : '#2d3748'}}>لیست علاقه مندی های شما خالیست.</p>
              ) : (
                favoriteItems.map(item => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onQuantityChange={handleQuantityChange}
                    showQuantityControls={false}
                    showDeleteButton={true}
                  />

                ))
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Favorites;
