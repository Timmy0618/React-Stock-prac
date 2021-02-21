import React, { Component } from 'react'
import Highcharts, { getDeferredAnimation } from 'highcharts/highstock'
import HighchartsReact from 'highcharts-react-official'
import Button from 'react-bootstrap/Button';
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import NavDropdown from 'react-bootstrap/NavDropdown'
import FormControl from 'react-bootstrap/FormControl'
import Form from 'react-bootstrap/Form'
import Table from 'react-bootstrap/Table'
import axios from 'axios';

/*
async function get_stock_data(stockname) {
  return fetch('https://histock.tw/stock/chip/chartdata.aspx?no=' + stockname + '&days=80&m=dailyk,volume')
    .then(function (data) {
      return data.json();
    })
}
*/

async function get_stock_data(stockname) {
  return axios.get(`/get/stock/data?stockname=${stockname}`)
    .then(function (response) {
      console.log(response.data);
      return response.data;
    })
}


function show_graph(stockname, data) {
  console.log(stockname);
  console.log(data);
  if (stockname === "" || data.length === 0)
    return "";
  //let data1 = JSON.parse(data.DailyK);
  //let data2 = JSON.parse(data.Volume);


  // split the data set into ohlc and volume
  console.log('start');
  var ohlc = [],
    volume = [],
    dataLength = data.timestamp.length,
    // set the allowed units for data grouping
    groupingUnits = [[
      'day',                         // unit name
      [1]                             // allowed multiples
    ], [
      'month',
      [1, 2, 3, 4, 6]
    ]],

    i = 0;

  for (i; i < dataLength; i += 1) {
    ohlc.push([
      data.timestamp[i] * 1000, // the date
      Number(data.open[i].toFixed(2)), // open
      Number(data.high[i].toFixed(2)), // high
      Number(data.low[i].toFixed(2)), // low
      Number(data.close[i].toFixed(2)) // close
    ]);

    volume.push([
      data.timestamp[i] * 1000, // the date
      data.volume[i] // the volume
    ]);
  }

  console.log('69');
  // create the chart
  let options = {

    rangeSelector: {
      /*
      buttons: [
        {
          type: 'month',
          count: 1,
          text: 'month'
        }, {
          type: 'All',
          count: 1,
          text: 'All'
        }],
        */
      selected: 1,
      inputEnabled: false
    },

    title: {
      text: stockname + ' Historical'
    },

    yAxis: [{
      labels: {
        align: 'right',
        x: -3
      },
      title: {
        text: 'OHLC'
      },
      height: '60%',
      lineWidth: 2,
      resize: {
        enabled: true
      }
    }, {
      labels: {
        align: 'right',
        x: -3
      },
      title: {
        text: 'Volume'
      },
      top: '65%',
      height: '35%',
      offset: 0,
      lineWidth: 2,
      resize: {
        enabled: true
      },
      distance: '100%',
      y: 100
    }],

    tooltip: {
      split: true
    },

    series: [{
      type: 'candlestick',
      //color: '#FF0000',
      name: stockname,
      data: ohlc,
      dataGrouping: {
        units: groupingUnits
      }
    }, {
      type: 'column',
      name: 'Volume',
      data: volume,
      yAxis: 1,
      dataGrouping: {
        units: groupingUnits
      },
    }],
    plotOptions: {
      candlestick: {
        color: 'green',
        upColor: 'red'
      }
    },
  };
  return options;
}

function Stock() {

  let [searchText, setSearch] = React.useState("");
  let [result, setResult] = React.useState("");
  let [selectResult, setSelect] = React.useState("0");
  let [stocklist, setList] = React.useState([]);
  let [stockdata, setdata] = React.useState([]);

  const handleChanged = (event) => {
    setSearch(event.target.value);
  };

  const handleSearch = () => {
    setResult(searchText);
    get_stock_data(searchText).then(
      data =>
        setdata(data)
    );
  };

  const clickChange = (data) => {
    setResult(data);
  };

  const AddStock = () => {
    if (stocklist.indexOf(searchText) === -1) {
      setList([...stocklist, searchText]);
    }
  };

  console.log(stocklist, stockdata);
  return (
    <div>
      <Navbar bg="light" expand="lg">
        <Navbar.Brand >STOCK</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <NavDropdown title="最愛" >
              {
                stocklist.map((data, index) => <NavDropdown.Item herf="#" value={data} onClick={() => clickChange(data)} key={index}>{data}</NavDropdown.Item>)
              }
            </NavDropdown>
          </Nav>
          <Form inline>
            <FormControl type="text" placeholder="Stockname" className="mr-sm-2" val={searchText} onChange={handleChanged} />
            <Button variant="outline-success" onClick={handleSearch}>Search</Button>
            <Button variant="primary" onClick={AddStock}>加入最愛</Button>
          </Form>
        </Navbar.Collapse>
      </Navbar>
      <StockGraph stockname={result} data={stockdata} />
      <Stock_history_data data={stockdata} />
    </div>
  )
}


function Stock_history_data(props) {
  let data = props.data;
  var newDate = new Date();

  console.log(data);
  if (data.length === 0)
    return <></>;
  let ary = [];
  let classvolume = ""
  let classclose = ""
  console.log(data.timestamp.length)
  for (let i = data.timestamp.length - 1; i > 0; i--) {
    classvolume = "";
    classclose = ""
    newDate.setTime(data.timestamp[i] * 1000);
    if (data.volume[i] > data.volume[i - 1] * 1.4)
      classvolume = "table-danger";
    if (data.close[i] > data.close[i - 1] * 1.05)
      classclose = "table-danger";
    if (data.close[i] < data.close[i - 1] * 0.95)
      classclose = "table-success";
    ary.push(<tr>
      <td>{newDate.toLocaleDateString()}</td>
      <td>{data.open[i].toFixed(2)}</td>
      <td>{data.high[i].toFixed(2)}</td>
      <td>{data.low[i].toFixed(2)}</td>
      <td class={classclose}>{data.close[i].toFixed(2)}</td>
      <td class={classvolume} >{data.volume[i]}</td>
    </tr>)
  }
  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Date</th>
          <th>Open</th>
          <th>High</th>
          <th>Low</th>
          <th>Close</th>
          <th>Volume</th>
        </tr>
      </thead>
      <tbody>
        {ary}
      </tbody>
    </Table>
  )
}

function StockGraph(props) {
  console.log(props);
  let stock_name = props.stockname;
  let stock_data = props.data;
  let [option, setData] = React.useState([]);
  console.log(stock_data, stock_name, stock_data.length);

  console.log(stock_name);
  //let stock_data = await get_stock_data(stockname);
  React.useEffect(() => {
    console.log(stock_name);
    setData(() => show_graph(stock_name, stock_data));
    //setData(show_graph(stock_name, stock_data));
  }, [stock_data])



  if (!stock_name) return <h1>no stockname</h1>;
  console.log(option);
  if (option.length === 0) return <h1>Loading</h1>;
  return (
    <HighchartsReact
      highcharts={Highcharts}
      constructorType={"stockChart"}
      options={option}
    />
  );
}

export default Stock



