// @ts-check

import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../Components/Home";
import Overview from "../Components/Overview";

function Routers() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/overview" element={<Overview />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default Routers;
