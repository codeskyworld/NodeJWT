import React, { useState, useEffect } from "react";
import "./App.css";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import StockList from "./StockList";
import StockDetail from "./StockDetail";
import LoginStockDetail from "./LoginStockDetail";
import Login from "./Login";
import Logout from "./Logout";
import Register from "./Register";

const Header = (props) => {
  return (
    <header>
      <div className="container">
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <ul className="navbar-nav mr-auto">
            <li>
              <Link to="/">StockList</Link>
            </li>
            <li id="login" className={props.logged ? "hide" : ""}>
              <Link to="/Login">Login</Link>
            </li>
            <li id="register" className={props.logged ? "hide" : ""}>
              <Link to="/Register">Register</Link>
            </li>
            <li id="logout" className={props.logged ? "" : "hide"}>
              <Link to="/Logout">Logout</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default function App() {
  const [logged, setLogged] = useState(false);
  useEffect(() => {
    if (localStorage.hasOwnProperty("token")) {
      setLogged(true);
    } else {
      setLogged(false);
    }
  }, [logged]);

  return (
    <div>
      <Router>
        <Header logged={logged}></Header>
        <Switch>
          <Route exact path="/" component={StockList} />
          <Route exact path="/Login" component={Login} />
          <Route exact path="/Logout" component={Logout} />
          <Route exact path="/Register" component={Register} />
          <Route path="/StockDetail/:symbol" component={StockDetail} />
          <Route
            path="/LoginStockDetail/:symbol"
            component={LoginStockDetail}
          />
        </Switch>
      </Router>
    </div>
  );
}
