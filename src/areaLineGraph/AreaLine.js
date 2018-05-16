import React, {Component} from 'react';
import * as d3 from "d3";
import {timeFormat, timeParse} from 'd3-time-format';
import dummy from './data/areaLine';
import {MultiLineAreaDiffChart} from './differenceChart';
var Currentdata = dummy;


var margin = {
  top: 60,
  right: 80,
  bottom: 40,
  left: 40
};

// set the const values
const chartColor = ["#DEE6FB", "#C7F6F5"];
const minSvgWidth = 360;
const maxSvgWidth = 960;
const minSvgHeight = 280;
const maxSvgHeight = 320;
const imgSize = 50;
// var width = window.innerWidth;
// var height = window.innerHeight;
var width = 660
var height = 480;
const tooltipWidth = minSvgWidth + margin.right;
const linestroke = ['#6864B4', '#519895'];


var finalDataObj = {};
var data = [];

Currentdata
  .response
  .projectedAmtLowerArray[0]
  .forEach(function (d) {
    finalDataObj[d.actualYear] = {
      "date": d.actualYear,
      "lower": d.projectedAmt
    }
  });
Currentdata
  .response
  .projectedAmtMedianArray[0]
  .forEach(function (d) {
    finalDataObj[d.actualYear].median = d.projectedAmt;
  });
Currentdata
  .response
  .projectedAmtUpperArray[0]
  .forEach(function (d) {
    finalDataObj[d.actualYear].upper = d.projectedAmt;
  });

var keys = (Object.keys(finalDataObj));
keys.forEach(function (d) {
  data.push({"date": (d), "lower": finalDataObj[d].lower, "median": finalDataObj[d].median, "upper": finalDataObj[d].upper})
})

class AreaLine extends Component {
  constructor(props) {
      super(props);
    this.state = {
      data: data,
      width: width,
      height: height,
      margin: margin,
      imgSize: imgSize,
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

  render() {
    return (
      <div className="svg-container" style={{width: '100%'}}>
         <MultiLineAreaDiffChart {...this.state} />
      </div>
    );
  }
}

export default AreaLine;
