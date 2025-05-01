import React, { useContext } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
<<<<<<< HEAD
import ChatWidget from "./components/ChatWidget";
import Footer from "./components/Footer";
import Home from "./components/Home";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import PrivacyPolicy from "./components/PrivacyPolicy";
import Profile from "./components/Profile";
import RefundPolicy from "./components/RefundPolicy";
import Register from "./components/Register";
import Regulations from "./components/Regulations";
import ShippingPolicy from "./components/ShippingPolicy";
import Post from "./components/Post";
=======
import ChatWidget from "./components/ChatWidget/ChatWidget";
import Footer from "./components/Footer/Footer";
import Home from "./components/Home/Home";
import Login from "./components/Login/Login";
import Navbar from "./components/Navbar/Navbar";
import PrivacyPolicy from "./components/PrivacyPolicy/PrivacyPolicy";
import ProfileBuyer from "./components/ProfileBuyer/ProfileBuyer";
import ProfileSeller from "./components/ProfileSeller/ProfileSeller";
import RefundPolicy from "./components/RefundPolicy/RefundPolicy";
import Register from "./components/Register/Register";
import Regulations from "./components/Regulations/Regulations";
import ShippingPolicy from "./components/ShippingPolicy/ShippingPolicy";
import Menu from "./components/Menu/Menu";
import About from "./components/About/About";
import FAQPage from "./components/FAQPage/FAQPage";
import Detail from "./components/Detail/Detail";
import OrderHistory from "./components/OrderHistory/OrderHistory";
>>>>>>> 075097176eba93929c402c28f97df623d305704a
import { UserContext, UserProvider } from "./context/UserContext";

function AppContent() {
  const { user } = useContext(UserContext);

  const ProtectedRoute = ({ role, element }) => {
    if (user && user.role === role) {
      return element;
    }
    // return <Navigate to="/" />;
    return element;
  };

  return (
    <Router>
      {user && <Navbar />}
      <Routes>
        <Route path="/" element={user ? <Home /> : <Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<About />} />
        <Route path="/qa" element={<FAQPage />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/menu/detail" element={<Detail />} />
        <Route
          path="/seller/profile"
          element={<ProtectedRoute role="seller" element={<ProfileSeller />} />}
        />
        <Route
          path="/order-history"
          element={<ProtectedRoute role="buyer" element={<OrderHistory />} />}
        />
        <Route
          path="/buyer/profile"
          element={<ProtectedRoute role="buyer" element={<ProfileBuyer />} />}
        />
        <Route
          path="/manager/profile"
          element={<ProtectedRoute role="manager" element={<ProfileBuyer />} />}
        />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/regulations" element={<Regulations />} />
        <Route path="/shipping-policy" element={<ShippingPolicy />} />
        <Route path="/return-refund" element={<RefundPolicy />} />
        <Route path="/posts" element={<Post />} />
      </Routes>
      {user && <Footer />}
      {user && <ChatWidget />}
    </Router>
  );
}

function App() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
}

export default App;