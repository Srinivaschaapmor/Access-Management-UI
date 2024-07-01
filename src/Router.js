import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./components/Login/Login";
import Dashboard from "./components/AccessManagement/Dashboard";
import ProtectedRoute from "./protectedLayout";

import ListOfUsers from "./components/ListOfUsers/ListOfUsers";
import Home from "./components/home/Home";
import NotAuthorised from "./NotAuthorised";
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
          <Route path="/dashboard/home" element={<Home />} />
          <Route path="/dashboard/users-list" element={<ListOfUsers />}></Route>
          {/* <Route path="/user-access-settings/:id" element={<UserAccess />} /> */}
        </Route>

        <Route path="*" element={<NotAuthorised />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
