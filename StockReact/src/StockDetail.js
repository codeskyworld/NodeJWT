import React, { useState, useEffect } from "react";
import "./App.css";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Badge, Form, FormGroup, Col } from "reactstrap";

export default function StockDetail(props) {
  const [rowData, setRowData] = useState([]);

  const columns = [
    { headerName: "Timestamp", field: "timestamp" },
    { headerName: "Open", field: "open" },
    { headerName: "High", field: "high" },
    { headerName: "Low", field: "low" },
    { headerName: "Close", field: "close" },
    { headerName: "Volumes", field: "volumes" },
  ];

  useEffect(() => {
    fetch(`http://131.181.190.87:3000/stocks/${props.match.params.symbol}`)
      .then((res) => res.json())
      .then((items) => {
        let itemList = [];
        itemList[0] = items;

        return itemList.map((item) => {
          return {
            timestamp: new Date(
              item.timestamp.substring(0, 10)
            ).toLocaleDateString(),
            open: item.open,
            high: item.high,
            low: item.low,
            close: item.close,
            volumes: item.volumes,
          };
        });
      })
      .then((items) => {
        setRowData(items);
      });
  }, [props.match.params.symbol]);

  return (
    <div className="container mt-5">
      <Form>
        <h1>{props.match.params.symbol}</h1>
        <p>
          <Badge color="success">{rowData.length}</Badge>
          You can check history detail if loginning.
        </p>

        <FormGroup row>
          <Col sm={12} className="ag-theme-balham" style={{ height: "347px" }}>
            <AgGridReact
              columnDefs={columns}
              onGridReady={(params) => {
                params.api.sizeColumnsToFit();
              }}
              rowData={rowData}
              pagination={true}
              paginationPageSize={6}
            />
          </Col>
        </FormGroup>
        <Button
          color="info"
          size="ml"
          className="mt-3"
          href="https://www.intercontinentalexchange.com/index"
          target="_blank"
        >
          Go to Intercontinental Exchange
        </Button>
      </Form>
    </div>
  );
}
