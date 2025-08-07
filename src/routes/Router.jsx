import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import OrderMethod from "../pages/OrderMethod";
// 추후 추가될 페이지들을 위한 임포트 (현재는 주석 처리)
// import Chat from "./pages/Chat";
// import About from "./pages/About";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import Profile from "./pages/Profile";
// import Settings from "./pages/Settings";
// import NotFound from "./pages/NotFound";

export default function AppRouter() {
  return (
    <Router>
      <Routes>
        {/* 메인 홈페이지 */}
        <Route path="/" element={<Home />} />
        <Route path="/order-method" element={<OrderMethod />}/>
        {/* 추후 추가될 라우트들 */}
        {/* <Route path="/chat" element={<Chat />} /> */}
        {/* <Route path="/about" element={<About />} /> */}
        {/* <Route path="/login" element={<Login />} /> */}
        {/* <Route path="/register" element={<Register />} /> */}
        {/* <Route path="/profile" element={<Profile />} /> */}
        {/* <Route path="/settings" element={<Settings />} /> */}

        {/* 404 페이지 (모든 라우트의 마지막에 위치) */}
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </Router>
  );
}
