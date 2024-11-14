import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminPanel from './components/Admin/AdminPanel';
import { Page } from './components/Page.jsx';
import Products from './components/Products';
import Success from './components/Success.jsx';
import Vouchers from './components/Vouchers.jsx';
import WelcomePage from './components/WelcomePage.jsx';
import Footer from './components/Footer.jsx';
import FooterMobile from './components/FooterMobile.jsx';

const isAuthenticated = () => {
  return true;
};

const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/" />;
};

function App() {
  if (!localStorage.getItem('lang')) {
    localStorage.setItem('lang', 'bg');
  }

  const showFooter = !window.location.pathname.startsWith('/admin');

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WelcomePage />} />

        <Route path="/page/*" element={<Page />} />

        <Route path="/products" element={<Products />} />
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

      {showFooter && (window.innerWidth > 750 ? <Footer /> : <FooterMobile />)}
    </BrowserRouter>
  );
}

export default App;