import React, {Component} from 'react';
import {timeFormat, timeParse} from 'd3-time-format';
import {Areachart} from './chart';

const data = [
  {
    "actualYear": "2019",
    "ProjectedValue": 20095.55
  }, {
    "actualYear": "2020",
    "ProjectedValue": 30287.56
  }, {
    "actualYear": "2021",
    "ProjectedValue": 40576.95
  }, {
    "actualYear": "2022",
    "ProjectedValue": 50964.65
  }, {
    "actualYear": "2023",
    "ProjectedValue": 61451.6
  }, {
    "actualYear": "2024",
    "ProjectedValue": 72038.76
  }, {
    "actualYear": "2025",
    "ProjectedValue": 82727.07
  }, {
    "actualYear": "2026",
    "ProjectedValue": 93517.51
  }, {
    "actualYear": "2027",
    "ProjectedValue": 104411.04
  }, {
    "actualYear": "2028",
    "ProjectedValue": 115408.66
  }, {
    "actualYear": "2028",
    "ProjectedValue": 115408.66
  }, {
    "actualYear": "2029",
    "ProjectedValue": 111985.7
  }, {
    "actualYear": "2030",
    "ProjectedValue": 108387.23000000001
  }, {
    "actualYear": "2031",
    "ProjectedValue": 104606.1
  }, {
    "actualYear": "2032",
    "ProjectedValue": 100634.86
  }, {
    "actualYear": "2033",
    "ProjectedValue": 96465.79
  }, {
    "actualYear": "2034",
    "ProjectedValue": 92090.87000000001
  }, {
    "actualYear": "2035",
    "ProjectedValue": 87501.70999999999
  }, {
    "actualYear": "2036",
    "ProjectedValue": 82689.65
  }, {
    "actualYear": "2037",
    "ProjectedValue": 77645.64
  }, {
    "actualYear": "2038",
    "ProjectedValue": 72360.29000000001
  }, {
    "actualYear": "2039",
    "ProjectedValue": 66823.85999999999
  }, {
    "actualYear": "2040",
    "ProjectedValue": 61026.159999999996
  }, {
    "actualYear": "2041",
    "ProjectedValue": 54956.66
  }, {
    "actualYear": "2042",
    "ProjectedValue": 48604.369999999995
  }, {
    "actualYear": "2043",
    "ProjectedValue": 41957.89
  }, {
    "actualYear": "2044",
    "ProjectedValue": 35005.36
  }, {
    "actualYear": "2045",
    "ProjectedValue": 27734.430000000008
  }, {
    "actualYear": "2046",
    "ProjectedValue": 20132.289999999994
  }, {
    "actualYear": "2047",
    "ProjectedValue": 12185.599999999991
  }, {
    "actualYear": "2048",
    "ProjectedValue": 3880.5100000000093
  }
];

// calculating the peakPoint
let pickPoint = 0;
let tempValue = 0;
for (const value of data) {
  if (tempValue >= value.ProjectedValue && pickPoint == 0) {
    tempValue = value.ProjectedValue;
    pickPoint = value.actualYear;
  } else {
    tempValue = value.ProjectedValue;
  }
}

// define the margins.
var margin = {
  top: 30,
  right: 20,
  bottom: 50,
  left: 40
};

// set the const values
const value = '5,720';
const amount = '$862,169';
const chartColor = ["#DEE6FB", "#C7F6F5"];
const minSvgWidth = 360;
const maxSvgWidth = 960;
const minSvgHeight = 280;
const maxSvgHeight = 320;
const imgSize = 50;
const ascensionDescensionRect_width = 50;
const ascensionDescensionRect_height = 30;
var width = window.innerWidth;
var height = window.innerHeight;
const tooltipWidth = minSvgWidth + margin.right;
const linestroke = ['#6864B4', '#519895'];

var parseTime = timeParse("%Y");
var dateFormateData = data;
// format the data for x-axis year formate
dateFormateData.forEach(function (d) {
  d.x = parseTime(d.actualYear);
  d.y = +d.ProjectedValue;
});

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: data,
      dateFormateData: dateFormateData,
      width: width,
      height: height,
      margin: margin,
      imgSize: imgSize,
      value: value,
      pickPoint: pickPoint,
      ascensionDescensionRect_width: ascensionDescensionRect_width,
      ascensionDescensionRect_height: ascensionDescensionRect_height,
      age: 81,
      amount: amount,
      chartColor: chartColor,
      linestroke: linestroke,
      minSvgWidth: minSvgWidth,
      maxSvgWidth: maxSvgWidth,
      minSvgHeight: minSvgHeight,
      maxSvgHeight: maxSvgHeight,
      tooltipWidth: tooltipWidth,
      resize: false
    };
  }

  /**
   * Calculate & Update state of new dimensions
   */
  updateDimensions() {
    if (window.innerWidth >= maxSvgWidth) {
      this.setState({width: maxSvgWidth, height: maxSvgHeight, resize: true});
    } else if (window.innerWidth <= minSvgWidth) {
      this.setState({width: minSvgWidth, height: minSvgHeight, resize: true});
      // let update_height = Math.round(update_width / 4.4);
    } else {
      this.setState({
        width: window.innerWidth - margin.left - margin.right,
        height: minSvgHeight,
        resize: true
      });
    }
  }

  /**
   * Add event listener
   */
  componentDidMount() {
    this.updateDimensions();
    window.addEventListener("resize", this.updateDimensions.bind(this));
  }

  /**
   * Remove event listener
   */
  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions.bind(this));
  }
  render() {
    return (
      <div className="svg-container" style={{
        width: '100%'
      }}>
        <Areachart {...this.state}></Areachart>
      </div>
    );
  }
}

export default App;
