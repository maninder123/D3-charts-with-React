import React, {Component} from 'react';
import {timeFormat, timeParse} from 'd3-time-format';
import {GrowthAreachart} from './growthChart';
import educationMaker from './educationMaker.svg';
import retirementMaker from './retirementMaker.svg';

const goal_data = [
  {
    "actualYear": "2019",
    "value": 10000
  },
  {
    "actualYear": "2020",
    "value": 30000
  },
  {
    "actualYear": "2021",
    "value": 50000
  },
  {
    "actualYear": "2021",
    "value": 5000
  },
  {
    "actualYear": "2022",
    "value": 20000
  },
  {
    "actualYear": "2023",
    "value": 40000
  },
  {
    "actualYear": "2024",
    "value": 60000
  },
  {
    "actualYear": "2025",
    "value": 80000
  },
  {
    "actualYear": "2026",
    "value": 90000
  },
  {
    "actualYear": "2026",
    "value": 90000
  },
{
    "actualYear": "2027",
    "value": 80000
  },
  {
    "actualYear": "2028",
    "value": 60000
  },
  {
    "actualYear": "2029",
    "value": 40000
  },
  {
    "actualYear": "2030",
    "value": 20000
  },
  {
    "actualYear": "2031",
    "value": 0
  }
];

const goalsArray = [
{ "actualYear": "2021", "value": 60000, icon: {educationMaker} },
{ "actualYear": "2026", "value": 90000, icon: {retirementMaker} }
]

// calculating the peakPoint
let peakPoint = goalsArray[1].actualYear;
let tempValue = 0;

console.log('pickPoint',goalsArray)
// define the margins.
var margin = {
  top: 30,
  right: 20,
  bottom: 80,
  left: 40
};

// set the const values
const growingAmt = '$120,000';
const retirementAmt = '$862,169';
const chartColor = ["#DEE6FB", "#C7F6F5"];
const linestroke = ['#6864B4', '#519895'];
const minSvgWidth = 730;
const maxSvgWidth = 1060;
const minSvgHeight = 300;
const maxSvgHeight = 400;
const imgSize = 50;
const ascensionDescensionRect_width = 60;
const ascensionDescensionRect_height = 30;
const eduImageTextWidth = 200;
const retireImageTextWidth = 200;
var width = window.innerWidth;
var height = window.innerHeight;
// var width = 960;
// var height = 400;

var parseTime = timeParse("%Y");
var dateFormateData = goal_data;

// format the data for x-axis year formate
dateFormateData.forEach(function (d) {
  d.x = parseTime(d.actualYear);
  d.y = +d.value;
});

class Growth extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // data: data,
      dateFormateData: dateFormateData,
      goal_data: goal_data,
      goals: goalsArray,
      growingAmt: growingAmt,
      retirementAmt: retirementAmt,
      width: width,
      height: height,
      margin: margin,
      imgSize: imgSize,
      peakPoint: peakPoint,
      eduImageTextWidth: eduImageTextWidth,
      retireImageTextWidth: retireImageTextWidth,
      ascensionDescensionRect_width: ascensionDescensionRect_width,
      ascensionDescensionRect_height: ascensionDescensionRect_height,
      chartColor: chartColor,
      linestroke: linestroke,
      minSvgWidth: minSvgWidth,
      maxSvgWidth: maxSvgWidth,
      minSvgHeight: minSvgHeight,
      maxSvgHeight: maxSvgHeight,
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
      this.setState({width: minSvgWidth, height: minSvgHeight, eduImageTextWidth: 180, retireImageTextWidth: 180, resize: true});
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
      <div className="svg-container" style={{width: '100%'}}>
        <GrowthAreachart {...this.state}></GrowthAreachart>
      </div>
    );
  }
}

export default Growth;
