import React, { useContext } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
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
import { UserContext, UserProvider } from "./context/UserContext";


function AppContent() {
  const { user } = useContext(UserContext);

  return (
    <Router>
      {user && <Navbar />}
      <Routes>
        <Route path="/" element={user ? <Home /> : <Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
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