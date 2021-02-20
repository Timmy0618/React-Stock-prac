import React, { Component } from 'react'
import Highcharts from 'highcharts/highstock'
import HighchartsReact from 'highcharts-react-official'
import Button from 'react-bootstrap/Button';
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import NavDropdown from 'react-bootstrap/NavDropdown'
import FormControl from 'react-bootstrap/FormControl'
import Form from 'react-bootstrap/Form'

/*
async function get_stock_data(stockname) {
  return fetch('https://histock.tw/stock/chip/chartdata.aspx?no=' + stockname + '&days=80&m=dailyk,volume')
    .then(function (data) {
      return data.json();
    })
}
*/

async function get_stock_data(stockname) {
  return fetch(`/get_stock_data?stockname=${stockname}`)
    .then(function (data) {
      return data.json();
    })
}


async function show_graph(stockname) {
  console.log(stockname);
  if (stockname === "")
    return "";
  let data = await get_stock_data(stockname);
  //let data1 = JSON.parse(data.DailyK);
  //let data2 = JSON.parse(data.Volume);


  // split the data set into ohlc and volume
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

  const handleChanged = (event) => {
    setSearch(event.target.value);
  };

  const handleSearch = () => {
    setResult(searchText);
  };

  const clickChange = (data) => {
    setResult(data);
  };
  const selectChanged = (event) => {
    console.log("選到了", event.target.value);
    setSelect(event.target.value);
    setResult(event.target.value);
  };

  const AddStock = () => {
    if (stocklist.indexOf(searchText) === -1) {
      setList([...stocklist, searchText]);
    }
  };

  console.log(stocklist,);
  return (
    <div>
      <Navbar bg="light" expand="lg">
        <Navbar.Brand >React-Bootstrap</Navbar.Brand>
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
      <StockGraph stockname={result} />
    </div>
  )
}

function StockGraph(props) {
  let stockname = props.stockname;
  let [data, setData] = React.useState([]);
  console.log(data, stockname, data.length);
  React.useEffect(() => {
    console.log(stockname);
    show_graph(stockname)
      .then((resp) => {
        setData(resp);
      });
  }, [stockname]);
  if (!stockname) return <h1>no stockname</h1>;
  if (data.length === 0) return <h1>Loading</h1>;
  return (
    <HighchartsReact
      highcharts={Highcharts}
      constructorType={"stockChart"}
      options={data}
    />
  );
}

export default Stock



