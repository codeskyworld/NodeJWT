import React, { useState, useEffect, useCallback } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Form, FormGroup, Label, Input, Col } from "reactstrap";
import { Redirect } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState([]);
  const [password, setPassword] = useState([]);
  const [clicked, setClicked] = useState(0);
  const [redirect, setRedirect] = useState(false);
  const API_URL = "http://131.181.190.87:3000";
  const Login = useCallback(() => {
    setClicked(clicked);
    const url = `${API_URL}/user/login`;
    fetch(url, {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.token !== undefined) localStorage.setItem("token", res.token);
        else alert("Uncorrect username or password. Login failed!");
      })
      .catch((error) => alert("Uncorrect username or password. Login failed!"));
  }, [email, password, clicked]);

  useEffect(() => {
    if (localStorage.hasOwnProperty("registered"))
      localStorage.removeItem("registered");
    let token = localStorage.hasOwnProperty("token");
    if (token) {
      setRedirect(true);
    }
  }, []);

  if (redirect) return <Redirect to="/" />;
  return (
    <div className="container d-flex justify-content-center ">
      <Form>
        <br></br>
        <br></br>
        <br></br>
        <h1>Log in</h1>
        <FormGroup row>
          <Label for="email" sm={4}>
            Email
          </Label>

          <Col sm={12}>
            <Input
              type="text"
              name="email"
              id="email"
              placeholder="email"
              onChange={(event) => {
                setEmail(event.target.value);
              }}
            />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label for="password" sm={4}>
            PassWord
          </Label>

          <Col sm={12}>
            <Input
              type="password"
              name="password"
              id="password"
              placeholder="password"
              onChange={(event) => {
                setPassword(event.target.value);
              }}
            />
          </Col>
        </FormGroup>

        <button onClick={Login}>Login</button>
      </Form>
    </div>
  );
}
