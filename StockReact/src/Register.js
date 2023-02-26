import React, { useState, useEffect, useCallback } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Form, FormGroup, Label, Input, Col } from "reactstrap";
import { Redirect } from "react-router-dom";

export default function Register() {
  //const testRef = useRef(false);
  const [email, setEmail] = useState([]);
  const [password, setPassword] = useState([]);
  const [mark, setMark] = useState(false);
  const [registered, setRegistered] = useState(false);

  const API_URL = "http://131.181.190.87:3000/user/register";
  const registerHandler = useCallback(() => {
    setMark(true);
    const url = `${API_URL}`;
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
        if (res.success) {
          localStorage.setItem("registered", true);
          alert("Register succeed! Please Login.");
        } else {
          alert("Register failed! Please try again.");
        }
      })
      .catch((error) => alert("Register failed! Please try again."));
  }, [email, password]);

  useEffect(() => {
    let registered = localStorage.getItem("registered");
    if (registered) {
      setRegistered(true);
    } else {
    }
  }, [mark]);

  if (registered) return <Redirect to="/" />;
  return (
    <div className="container d-flex justify-content-center ">
      <br></br>
      <br></br>
      <br></br>
      <Form>
        <br></br>
        <br></br>
        <br></br>
        <h1>Register</h1>
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

        <button onClick={registerHandler}>Register</button>
      </Form>
    </div>
  );
}
