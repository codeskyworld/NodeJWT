import React, { useState, useEffect } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Redirect } from "react-router-dom";

export default function Logout() {
  const [loggedout, setLoggedout] = useState([]);
  useEffect(() => {
    if (localStorage.hasOwnProperty("token")) {
      localStorage.removeItem("token");
      if (localStorage.hasOwnProperty("registered"))
        localStorage.removeItem("registered");
      setLoggedout(true);
      window.location.reload(false);
    }
  }, [loggedout]);

  return loggedout ? <Redirect to="/" /> : "";
}
