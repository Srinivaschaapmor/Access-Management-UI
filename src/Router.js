import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./components/Login/Login";
import Dashboard from "./components/Dashboard/Dashboard";
import ProtectedRoute from "./protectedLayout";
import UserAccess from "./components/Dashboard/UserAccess";
// import Data from "./Data/Data";
// import { Json } from "./dataFolder";

const Router = () => {
  // console.log(Json);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/" element={<ProtectedRoute />}>
          {" "}
          <Route path="/dashboard/access-management" element={<Dashboard />} />
          {/* <Route path="/user-access-settings/:id" element={<UserAccess />} /> */}
        </Route>

        <Route path="*" element={<p>Invalid Path</p>} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
