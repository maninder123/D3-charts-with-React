import React, {Component} from 'react';
import logo from './logo.svg';
import {Areachart} from './chart';

const ascending = [
  {
    "date": "2019",
    "close": 20095.55
  }, {
    "date": "2020",
    "close": 30287.56
  }, {
    "date": "2021",
    "close": 40576.95
  }, {
    "date": "2022",
    "close": 50964.65
  }, {
    "date": "2023",
    "close": 61451.6
  }, {
    "date": "2024",
    "close": 72038.76
  }, {
    "date": "2025",
    "close": 82727.07
  }, {
    "date": "2026",
    "close": 93517.51
  }, {
    "date": "2027",
    "close": 104411.04
  }, {
    "date": "2028",
    "close": 115408.66
  }, {
    "date": "2029",
    "close": 111985.7
  }, {
    "date": "2030",
    "close": 108387.23000000001
  }, {
    "date": "2031",
    "close": 104606.1
  }, {
    "date": "2032",
    "close": 100634.86
  }, {
    "date": "2033",
    "close": 96465.79
  }, {
    "date": "2034",
    "close": 92090.87000000001
  }, {
    "date": "2035",
    "close": 87501.70999999999
  }, {
    "date": "2036",
    "close": 82689.65
  }, {
    "date": "2037",
    "close": 77645.64
  }, {
    "date": "2038",
    "close": 72360.29000000001
  }, {
    "date": "2039",
    "close": 66823.85999999999
  }, {
    "date": "2040",
    "close": 61026.159999999996
  }, {
    "date": "2041",
    "close": 54956.66
  }, {
    "date": "2042",
    "close": 48604.369999999995
  }, {
    "date": "2043",
    "close": 41957.89
  }, {
    "date": "2044",
    "close": 35005.36
  }, {
    "date": "2045",
    "close": 27734.430000000008
  }, {
    "date": "2046",
    "close": 20132.289999999994
  }, {
    "date": "2047",
    "close": 12185.599999999991
  }, {
    "date": "2048",
    "close": 3880.5100000000093
  }
]

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data1: ascending,
      width: 960,
      height: 300,
    };
  }

  render() {
    return (
      <div className="App">
        <Areachart {...this.state}></Areachart>
      </div>
    );
  }
}

export default App;
