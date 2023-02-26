import React, { useState, useEffect, useCallback } from "react";
import "./App.css";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useHistory } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Line } from "+";
import { Col, Button, Form, FormGroup, Label } from "reactstrap";

export default function LoginStockDetail(props) {
  const [rowData, setRowData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [startDate, setStartDate] = React.useState();
  const [endDate, setEndDate] = React.useState();
  const [name, setName] = React.useState([]);
  const history = useHistory();
  const token = localStorage.getItem("token");
  const headers = {
    accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const columns = [
    { headerName: "Timestamp", field: "timestamp" },
    { headerName: "Open", field: "open" },
    { headerName: "High", field: "high" },
    { headerName: "Low", field: "low" },
    { headerName: "Close", field: "close" },
    { headerName: "Volumes", field: "volumes" },
  ];

  const fetchRequest = useCallback(() => {
    let filtered = allData.filter((r) => {
      if (
        Date.parse(r.timestamp) >= Date.parse(startDate) &&
        Date.parse(r.timestamp) <= Date.parse(endDate)
      ) {
        return r;
      } else {
        return null;
      }
    });

    setRowData(filtered);
  }, [startDate, endDate, allData]);

  useEffect(() => {
    var url = `http://131.181.190.87:3000/stocks/authed/${props.match.params.symbol}?from=2019-11-06T00%3A00%3A00.000Z&to=2020-03-24T00%3A00%3A00.000Z`;
    //var url = `http://131.181.190.87:3000/stocks/authed/AAL?from=2020-03-15T00%3A00%3A00.000Z&to=2020-03-20T00%3A00%3A00.000Z`;

    fetch(url, { headers })
      .then((res) => res.json())

      .then((items) => {
        let itemList = Object.values(items);
        if (itemList.length >= 1) {
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
        }
      })
      .then((items) => {
        setRowData(items);
        setAllData(items);
      });
    // .catch((error) => alert("Unvalid Token and Data not found"));
  }, []);
  const labelList = rowData.map((v) => v.timestamp);
  const closeList = rowData.map((v) => v.close);
  const data = {
    labels: labelList,
    datasets: [
      {
        label: "Close Price",
        fill: false,
        lineTension: 0.1,
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
        borderCapStyle: "butt",
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: "miter",
        pointBorderColor: "rgba(75,192,192,1)",
        pointBackgroundColor: "#fff",
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "rgba(75,192,192,1)",
        pointHoverBorderColor: "rgba(220,220,220,1)",
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: closeList,
      },
    ],
  };
  useEffect(() => {
    if (localStorage.hasOwnProperty("mark2")) localStorage.removeItem("mark2");
    fetch(`http://131.181.190.87:3000/stocks/${props.match.params.symbol}`)
      .then((res) => res.json())
      .then((items) => {
        if (typeof items == "object") setName(items.name);
      });
  }, [props.match.params.symbol]);

  return (
    <div className="container mt-5">
      <div>
        <h3>
          {props.match.params.symbol} - {name}
        </h3>
      </div>
      <div>
        <Form>
          <FormGroup row>
            <Label for="From" sm={1}>
              from
            </Label>
            <Col sm={2}>
              <DatePicker
                selected={startDate}
                onChange={(v) => {
                  setStartDate(v);
                }}
              />
            </Col>

            <Label for="To" sm={1} ml={1}>
              to
            </Label>
            <Col sm={2}>
              <DatePicker
                selected={endDate}
                onChange={(v) => {
                  setEndDate(v);
                }}
              />
            </Col>
            <Col sm={6} mb={5}>
              <Button color="info" size="sm" onClick={fetchRequest}>
                search
              </Button>
            </Col>
          </FormGroup>
          <FormGroup row>
            <Col
              sm={12}
              className="ag-theme-balham"
              style={{ height: "347px" }}
            >
              <AgGridReact
                columnDefs={columns}
                rowData={rowData}
                defaultColDef={{ resizable: true }}
                colResizeDefault="shift"
                onGridReady={(params) => {
                  params.api.sizeColumnsToFit();
                }}
                pagination={true}
                paginationPageSize={10}
                onRowClicked={(e) => {
                  history.push(`/StockDetail/${e.data.symbol}`);
                }}
              />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Col sm={12}>
              <Line data={data} />
            </Col>
          </FormGroup>
        </Form>
      </div>
    </div>
  );
}
