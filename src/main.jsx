import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "./index.css";
import App from "./App";

import logo from "./assets/logo.png";


// Update browser favicon automatically
const favicon = document.querySelector("link[rel='icon']");

if (favicon) {
  favicon.href = logo;
} else {
  const newFavicon = document.createElement("link");

  newFavicon.rel = "icon";
  newFavicon.type = "image/png";
  newFavicon.href = logo;

  document.head.appendChild(newFavicon);
}


// Update browser title
document.title = "MedTrack | Pharmacy Inventory System";


ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);