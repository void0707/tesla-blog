import React, { useEffect, useState } from "react";
import BlogGrid from "./components/BlogGrid";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import BlogPreviewPage from "./components/BlogPreviewPage";
import Home from "./components/Home";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/blog/:id" element={<BlogPreviewPage />} />
        <Route path="/" index element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
