import React, { useContext } from "react";
import { Route, BrowserRouter as Router, Routes, Navigate } from "react-router-dom";
import ChatWidget from "./components/ChatWidget";
import Footer from "./components/Footer";
import Home from "./components/Home";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import PrivacyPolicy from "./components/PrivacyPolicy";
import ProfileSeller from "./components/ProfileSeller";
import ProfileBuyer from "./components/ProfileBuyer";
import Register from "./components/Register";
import RefundPolicy from "./components/RefundPolicy";
import Regulations from "./components/Regulations";
import ShippingPolicy from "./components/ShippingPolicy";
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
        <Route
          path="/seller/profile"
          element={<ProtectedRoute role="seller" element={<ProfileSeller />} />}
        />
        <Route
          path="/buyer/profile"
          element={<ProtectedRoute role="buyer" element={<ProfileBuyer />} />}
        />
        <Route
          path="/manager/profile"
          element={<ProtectedRoute role="manager" element={<ProfileBuyer />} />}
        />

        {/* Các trang chung cho tất cả các role */}
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/regulations" element={<Regulations />} />
        <Route path="/shipping-policy" element={<ShippingPolicy />} />
        <Route path="/return-refund" element={<RefundPolicy />} />
      </Routes>
      {user && <Footer />}
      <ChatWidget />
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
