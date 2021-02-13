import React, { Component } from 'react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
async function get_stock_data(stockname) {
  return fetch('https://histock.tw/stock/chip/chartdata.aspx?no=' + stockname + '&days=80&m=dailyk,volume')
    .then(function (data) {
      return data.json();
    })
}

async function show_graph(stockname) {
  console.log(stockname);
  let data = await get_stock_data(stockname);
  console.log(data);
  let data1 = JSON.parse(data.DailyK);
  let data2 = JSON.parse(data.Volume);


  // split the data set into ohlc and volume
  var ohlc = [],
    volume = [],
    dataLength = data1.length,
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
      data1[i][0], // the date
      data1[i][1], // open
      data1[i][2], // high
      data1[i][3], // low
      data1[i][4] // close
    ]);

    volume.push([
      data2[i][0], // the date
      data2[i][1] // the volume
    ]);
  }


  // create the chart
  let options = {

    rangeSelector: {
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
  let [selectResult, setSelect] = React.useState([0]);
  let [stocklist, setList] = React.useState([]);

  const handleChanged = (event) => {
    setSearch(event.target.value);
  };

  const handleSearch = () => {
    setResult(searchText);
  };

  const selectChanged = (event) => {
    console.log("選到了", event.target.value);
    setResult(event.target.value);

  };

  const AddStock = () => {
    setList([...stocklist, searchText]);
  };
  return (
    <div>
      <input val={searchText} onChange={handleChanged} />
      <button onClick={handleSearch}>Search</button>
      <button onClick={AddStock}>Add</button>
      <label>
        fav:
      <select value={selectResult} onChange={selectChanged}>
          <option>請選擇</option>
          {
            stocklist.map((data, index) => <option value={data}>{data}</option>)
          }
        </select>
      </label>

      <div>{result}</div>
      <StockGraph stockname={result} />
    </div>)
}

function StockGraph(props) {
  let stockname = props.stockname;
  let [data, setData] = React.useState([]);
  React.useEffect(() => {
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



