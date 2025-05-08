import React, { useContext } from "react";
import { Route, BrowserRouter as Router, Routes, Navigate } from "react-router-dom";
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
import CreateQuestion from "./components/FAQPage/createQuestion";
import AnswerQuestion from "./components/FAQPage/answerQuestion";
import Detail from "./components/Detail/Detail";
import OrderHistory from "./components/OrderHistory/OrderHistory";
import Post from "./components/Posts/User/Post";
import PostDetail from "./components/Posts/User/PostDetail";
import NewsList from "./components/Posts/Admin/NewsList";
import { UserContext, UserProvider } from "./context/UserContext";
import AdminCommentManager from "./components/Posts/Admin/AdminCommentManager";
import Cart from "./components/Cart/Cart";
import AdminMenu from "./components/Admin/AdminMenu/AdminMenu";
import AdminOrderHistory from "./components/Admin/AdminHistory/AdminOrderHistory";
import Wallet from "./components/Wallet/Wallet";


function AppContent() {
  const { user } = useContext(UserContext);

  const ProtectedRoute = ({ role, element }) => {
    if (!user || user.role !== role) {
      return <Navigate to="/" />;
    }
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
        <Route path="/qa/create-question" element={<CreateQuestion />} />
        <Route path="/qa/answer-question" element={<AnswerQuestion />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/detail/:productId" element={<Detail />} />
        <Route
          path="/seller/profile"
          element={<ProtectedRoute role="seller" element={<ProfileSeller />} />}
        />
        <Route
          path="/seller/manageProduct"
          element={<ProtectedRoute role="seller" element={<AdminMenu />} />}
        />
        <Route
          path="/order-history"
          element={<ProtectedRoute role="buyer" element={<OrderHistory />} />}
        />
        <Route
          path="/manager/order-history"
          element={<ProtectedRoute role="manager" element={<AdminOrderHistory />} />}
        />
        <Route
          path="/buyer/profile"
          element={<ProtectedRoute role="buyer" element={<ProfileBuyer />} />}
        />
         <Route
          path="/buyer/balance"
          element={<ProtectedRoute role="buyer" element={<Wallet/>} />}
        />
        <Route
          path="/buyer/cart"
          element={<ProtectedRoute role="buyer" element={<Cart />} />}
        />
        <Route
          path="/manager/profile"
          element={<ProtectedRoute role="manager" element={<ProfileBuyer />} />}
        />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/regulations" element={<Regulations />} />
        <Route path="/shipping-policy" element={<ShippingPolicy />} />
        <Route path="/return-refund" element={<RefundPolicy />} />
        {/* <Route path="/posts" element={<Post />} /> */}
        <Route path="/posts/:id" element={<PostDetail />} />
        <Route path="/admin/comments" element={<AdminCommentManager />} />

        <Route
          path="/posts"
          element={
            user?.role === "manager"
              ? <NewsList />
              : <Post />
          }
        />
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