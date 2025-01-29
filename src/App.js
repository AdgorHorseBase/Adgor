import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminPanel from './components/Admin/AdminPanel';
import { Page } from './components/Page.jsx';
import Products from './components/Products';
import Success from './components/Success.jsx';
import { Vouchers } from './components/Vouchers.jsx';
import WelcomePage from './components/WelcomePage.jsx';
import Footer from './components/Footer.jsx';
// import FooterMobile from './components/FooterMobile.jsx';
import { useEffect, useState } from 'react';
import ProductPage from './components/ProductPage.jsx';

const isAuthenticated = () => {
  return true;
};

const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/" />;
};

const ReturnToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  const returnToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 150) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  const styles = {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    backgroundColor: 'rgb(51, 28, 20)',
    color: '#fff',
    borderRadius: '50%',
    padding: '10px',
    cursor: 'pointer',
    zIndex: 1000,
  };

  return (
    isVisible && (
      <div className="return-to-top" onClick={returnToTop} style={styles}>
        <svg fill="#fff" height="28px" width="32px" viewBox="0 0 330 330"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path id="XMLID_224_" d="M325.606,229.393l-150.004-150C172.79,76.58,168.974,75,164.996,75c-3.979,0-7.794,1.581-10.607,4.394 l-149.996,150c-5.858,5.858-5.858,15.355,0,21.213c5.857,5.857,15.355,5.858,21.213,0l139.39-139.393l139.397,139.393 C307.322,253.536,311.161,255,315,255c3.839,0,7.678-1.464,10.607-4.394C331.464,244.748,331.464,235.251,325.606,229.393z"></path> </g></svg>
      </div>
    )
  );

};

function App() {
  if (!localStorage.getItem('lang')) {
    localStorage.setItem('lang', 'bg');
  }

  if (!localStorage.getItem('cart')) {
    localStorage.setItem('cart', JSON.stringify([]));
  }

  const showFooter = !window.location.pathname.startsWith('/admin');

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WelcomePage />} />

        <Route path="/page/*" element={<Page />} />

        <Route path="/products" element={<Products />} />
        <Route path="/product/:id" element={<ProductPage /> } />

        <Route path="/vouchers" element={<Vouchers />} />
        <Route path="/success" element={<Success />} />
        
        <Route 
          path="/admin/*" 
          element={
            <PrivateRoute>
              <AdminPanel />
            </PrivateRoute>
          } 
        />
      </Routes>

      <ReturnToTop />

      {showFooter && <Footer />}
      {/* {showFooter && (window.innerWidth > 750 ? <Footer /> : <FooterMobile />)} */}
    </BrowserRouter>
  );
}

export default App;