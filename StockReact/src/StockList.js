import React, { useState, useEffect } from "react";
import "./App.css";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Form, FormGroup, Label, Input, Badge, Col } from "reactstrap";
import { useHistory } from "react-router-dom";

export default function StockList() {
  const [rowData, setRowData] = useState([]);
  const [items, setItems] = React.useState([]);
  const [value, setValue] = React.useState();
  const history = useHistory();

  React.useEffect(() => {
    if (localStorage.hasOwnProperty("registered"))
      localStorage.removeItem("registered");
    async function getCharacters() {
      const response = fetch("http://131.181.190.87:3000/stocks/symbols");
      const body = await response.json();
      const industryData = body.map((item) => item.industry);
      const distinct = (value, index, self) => {
        return self.indexOf(value) === index;
      };
      const industryList = industryData.filter(distinct);

      setItems(
        industryList.map((industry) => ({
          label: industry,
          value: industry,
        }))
      );
    }
    getCharacters();
  }, []);

  const columns = [
    { headerName: "Name", field: "name", sortable: true, filter: true },
    { headerName: "Symbol", field: "symbol", sortable: true, filter: true },
    { headerName: "Industry", field: "industry", sortable: true, filter: true },
  ];

  useEffect(() => {
    var url = "http://131.181.190.87:3000/stocks/symbols";
    if (!!value && value !== "") url += "?industry=" + value;
    fetch(url)
      .then((res) => res.json())
      .then((items) => {
        let itemList = Object.values(items);
        if (itemList.length !== 0) {
          return itemList.map((item) => {
            return {
              name: item.name,
              symbol: item.symbol,
              industry: item.industry,
            };
          });
        }
      })
      .then((items) => setRowData(items));
    //.catch((error) => alert("Industry sector not found"));
  }, [value]);

  return (
    <div className="container mt-5">
      <div>
        <h1>Stock History Index</h1>
        <p>
          <Badge color="success">{rowData.length}</Badge>
          The data from 2019-11-06 to 2020-03-24
        </p>
      </div>
      <Form>
        <FormGroup row>
          <Label for="industry" sm={1}>
            Industry
          </Label>
          <Col sm={6}>
            <select
              value={value}
              onChange={(event) => {
                setValue(event.currentTarget.value);
              }}
            >
              <option key={0} value={""}>
                All Industries
              </option>
              {items.map(({ label, value }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label for="industry" sm={1}>
            Industry
          </Label>
          <Col sm={3}>
            <Input
              type="text"
              name="industry"
              id="industry"
              placeholder="put into an industry"
              onChange={(event) => {
                setValue(event.target.value);
              }}
            />
          </Col>
        </FormGroup>

        <FormGroup row>
          <Col sm={12} className="ag-theme-balham" style={{ height: "347px" }}>
            <AgGridReact
              columnDefs={columns}
              rowData={rowData}
              pagination={true}
              onGridReady={(params) => {
                params.api.sizeColumnsToFit();
              }}
              paginationPageSize={10}
              onRowClicked={(e) => {
                if (localStorage.hasOwnProperty("token")) {
                  history.push(`/LoginStockDetail/${e.data.symbol}`);
                } else {
                  history.push(`/StockDetail/${e.data.symbol}`);
                }
              }}
            />
          </Col>
        </FormGroup>
      </Form>
      <Button
        color="info"
        size="ml"
        className="mt-3"
        href="https://www.intercontinentalexchange.com/index"
        target="_blank"
      >
        Go to Intercontinental Exchange
      </Button>
    </div>
  );
}
