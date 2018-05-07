import React, {Component} from 'react';
import * as d3 from "d3";
import {scale} from "d3-scale";
import {path} from "d3-path";
import {interpolate, interpolateDate} from "d3-interpolate";
import {scaleLinear, scaleOrdinal, scaleBand, scaleTime} from 'd3-scale';
import {axisBottom as axisBottom, axisLeft as axisLeft} from 'd3-axis';
import {timeFormat, timeParse} from 'd3-time-format';
import {min, max} from 'd3-array';
import {curveBasis, area} from 'd3-shape';
import {select, selectAll} from 'd3-selection';
import PropTypes from 'prop-types';
import Running from './Running.svg';

// main compnent to draw the chart
export class GrowthAreachart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chartColor: props.chartColor,
            data: props.data,
            margin: props.margin
        };
    }

    componentDidMount() {
        this.renderGrowChart(this);
        // this.getTexWidth(this);
    }

    // function to render the area chart
    renderGrowChart(that) {
        const node = this.node;
        const imgSize = that.props.imgSize;
        var dataset = this.props.goal_data;
        const rectWith = that.props.ascensionDescensionRect_width;
        let rectHeight = that.props.ascensionDescensionRect_height;

        //define width and height
        var width = that.props.width - that.props.margin.left - that.props.margin.right;
        var height = that.props.height - that.props.margin.top - that.props.margin.bottom;

        var dateFormateData = that.props.dateFormateData;
        //defining x-scale
        const xScale = scaleTime().domain([
            min(dateFormateData, function (d) {
                return d.x;
            }),
            max(dateFormateData, function (d) {
                return d.x;
            })
        ]).range([0, width]);

        // defining y-scale
        const yScale = scaleLinear()
            .range([height, that.props.margin.top])
            .domain([
                min(that.props.goal_data, function (d) {
                    return d.y;
                }),
                max(that.props.goal_data, function (d) {
                    return d.y;
                })
            ]);

        // defining x-Axis
        var xAxis = axisBottom()
            .scale(xScale)
            .tickFormat(timeFormat("%Y"))

            console.log(xScale(new Date(that.props.goals[0].actualYear)), that.props.eduImageTextWidth)
    // adding tootip to the first target
        var tooltipFirstGoal = select("body")
            .append("div")
            .attr("id", "eduDiv")
            .style("display", "block")
            .style("position", "absolute")
            .style("left", (xScale(new Date(that.props.goals[0].actualYear))) - (that.props.eduImageTextWidth/2) - 10 + "px")
            .style("top", yScale(that.props.goals[0].value) + "px")
            .html('<div class="tooltip-education" style="opacity: 1; width:'+ that.props.eduImageTextWidth +'px "><p>Growing Wealth Goal</p> <h2><span>'+ 
            that.props.growingAmt +'</span></h2></div>');

        // adding tootip to the peak point
        var tooltipSecondGoal = select("body")
            .append("div")
            .attr("id", "retireDiv")
            .style("display", "block")
            .style("position", "absolute")
            .style("left",xScale(new Date(that.props.peakPoint)) - (that.props.retireImageTextWidth/2) - 10 + "px")
            .style("top","10px")
            .html('<div class="tooltip-retirement" style="opacity: 1; width:'+ that.props.retireImageTextWidth +'px "><p>Retirement Savings Goal </p><h2><span>'+ 
            that.props.retirementAmt +'</span></h2> </div>');

        // Adding first legend rectangle
        select(node)
            .append("rect")
            .attr("transform", "translate(" + (xScale(new Date(that.props.goals[0].actualYear)) - (that.props.margin.right))+ " ," + (height + that.props.margin.bottom) + ")")
            .attr("width", 20)
            .attr("height", 20)
            .attr("x", 0)
            .attr("y", 5)
            .style('fill', that.props.chartColor[1])
            .style('stroke',that.props.linestroke[1])
            .style('stroke-width','1px')

  // Adding first legend text
            select(node)
            .append("text")
            .attr("transform", "translate(" + (xScale(new Date(that.props.goals[0].actualYear)) + 15)+ " ," + (height + that.props.margin.bottom + that.props.margin.top - 10) + ")") // +15 and -10 is the padding between rect and text.
            .attr('fill', "#555555")
            .attr("stroke", "none")
            .text("Amount you invest");

    // Adding second legend rectangle
        select(node)
            .append("rect")
            .attr("transform", "translate(" + (xScale(new Date(that.props.goals[0].actualYear)) * 2 + (that.props.margin.left))+ " ," + (height + that.props.margin.bottom) + ")")
            .attr("width", 20)
            .attr("height", 20)
            .attr("x", 0)
            .attr("y", 5)
            .style('fill', that.props.chartColor[0])
            .style('stroke',that.props.linestroke[0])
            .style('stroke-width','1px')
            
    // Adding second legend text
          select(node)
          .append("text")
          .attr("transform", "translate(" + (xScale(new Date(that.props.goals[0].actualYear)) * 2 +(that.props.margin.left + that.props.margin.right)+15)+ " ," + (height + that.props.margin.bottom + that.props.margin.top - 10) + ")") // +15 and -10 is the padding between rect and text.
          .attr('fill', "#555555")
          .attr("stroke", "none")
          .text("Amount you can spend");

        // appending initial text to the chart
        select(node)
            .append("text")
            .attr("transform", "translate(" + (that.props.margin.left) + " ," + (height + that.props.margin.top*2) + ")")
            .style("text-anchor", "start")
            .attr('fill', "#555555")
            .attr("stroke", "none")
            .text("Today");

        //appending rectangle to highlight first Target year
        select(node)
            .append("rect")
            .attr("transform", "translate(" + (xScale(new Date(that.props.goals[0].actualYear)) + that.props.margin.left - rectWith / 2) + " ," + (height + that.props.margin.top) + ")")
            .attr("width", rectWith)
            .attr("height", rectHeight)
            .attr("rx", 10)
            .attr("ry", 10)
            .attr("x", 0)
            .attr("y", 5)
            .style('fill', that.props.chartColor[1]);

        //appending text to the rectangle first Target year
        const len = that.props.goal_data.length;
        const text = that.props.goal_data[len - 1].actualYear;
        select(node)
            .append("text")
            .attr("transform", "translate(" + (xScale(new Date(that.props.goals[0].actualYear)) + (that.props.margin.left * 2) - rectWith / 2 + 8) + " ," + (height + that.props.margin.bottom - that.props.margin.top+5) + ")") // +6 added as the padding to fit text into center of rectangle
            .style("text-anchor", "end")
            .attr('fill', "black")
            .attr("stroke", "none")
            .text(text);

        //appending rectangle to highlight Peak year
        select(node)
            .append("rect")
            .attr("transform", "translate(" + (xScale(new Date(that.props.peakPoint)) + that.props.margin.left - rectWith / 2) + " ," + (height + that.props.margin.top) + ")")
            .attr("width", rectWith)
            .attr("height", rectHeight)
            .attr("rx", 10)
            .attr("ry", 10)
            .attr("x", 0)
            .attr("y", 5)
            .style('fill', that.props.chartColor[1]);

        //appending text to the rectangle for peak year
        select(node)
            .append("text")
            .attr("transform", "translate(" + (xScale(new Date(that.props.peakPoint)) + (that.props.margin.left * 2) - rectWith / 2 + 8) + " ," + (height + that.props.margin.bottom - that.props.margin.top+5) + ")") // +2 and +5 added as the padding to fit text into center of rectangle
            .style("text-anchor", "end")
            .attr('fill', "black")
            .attr("stroke", "none")
            .text('2033');

        //appending text at x-axis after peak year rectangle
        select(node)
            .append("text")
            .attr("transform", "translate(" + (xScale(new Date(that.props.peakPoint)) + (that.props.margin.left * 4)) + " ," + (height + that.props.margin.bottom - that.props.margin.top+5) + ")")
            .style("text-anchor", "end")
            .attr('fill', "#DADADA")
            .style("font-style", "italic")
            .attr("stroke", "none")
            .text("(Age 65)");
            
        //appending image to the first target education Maker
                select(node)
                .append("svg:image")
                .attr('x', function () {
                    return xScale(new Date(that.props.goals[0].actualYear)) + that.props.margin.left - (imgSize / 2)
                })
                .attr('y', yScale(that.props.goals[0].value)+5) // +5 is the margin of the image.
                .attr('width', imgSize)
                .attr('height', imgSize)
                .attr("xlink:href", that.props.goals[0].icon.educationMaker)
                .on('mousemove', function(){
                })
                .on('mouseout', function(){

                })

        //appending image for the peak year retirement Maker
        select(node)
            .append("svg:image")
            .attr('x', function () {
                return xScale(new Date(that.props.peakPoint)) + that.props.margin.left - (imgSize / 2)
            })
            .attr('y', imgSize - that.props.margin.left)
            .attr('width', imgSize)
            .attr('height', imgSize)
            .attr("xlink:href", that.props.goals[1].icon.retirementMaker)          
            .on("mousemove", function (d) {
            })
            .on("mouseout", function (d) {
            });

        // mouse hover on the chart calling y-axis and appending
        var yAxis = axisLeft().scale(yScale)

        select(node)
            .append('g')
            .attr('className', 'axis axis--x')
            .attr("transform", "translate(" + that.props.margin.left + "," + (height + that.props.margin.top) + ")")
            //.call(yAxis) 
        
        //appending line to the bottom of the chart
        select(node)
            .append('line')
            .attr("x1", 0)
            .attr("x2", width + that.props.margin.left + that.props.margin.right)
            .attr("y1", height + that.props.margin.top + 1) // 1 is the padding to adjust the line in center
            .attr("y2", height + that.props.margin.top + 1)
            .attr("stroke", "#D7D7D7")
            .attr("stroke-width", "2px")

        //appending translate to the x-axis chart
        select(node)
            .append('g')
            .attr('className', 'axis axis--y')
            .attr("transform", "translate(" + that.props.margin.left + "," + that.props.margin.top + ")")

        // definine the area
        var area = d3
            .area()
            .x(function (d) {
                return xScale(d.x);
            })
            .y0(height)
            .y1(function (d) {
                return yScale(d.y);
            });

        // define the line on top of the area
        var valueline = d3
            .line()
            .x(function (d) {
                return xScale(d.x);
            })
            .y(function (d) {
                return yScale(d.y);
            })

        dataset = dataset.sort(function (x, y) {
            return d3.ascending(x.actualYear, y.actualYear);
        })
        // creating two sets of data for different paths.
        var datanew = [];
        var ascensionData = [],
            descensionData = [];
        dataset.forEach(function (d) {
            if (d.actualYear < parseInt(that.props.peakPoint)) {
                ascensionData.push(d)
            } else if (d.actualYear == parseInt(that.props.peakPoint)) {
                ascensionData.push(d);
                descensionData.push(d);
            } else {
                descensionData.push(d);
            }
        })
        datanew.push(descensionData);
        datanew.push(ascensionData);
        //datanew will hold the chunk of data with y > 2028.
        datanew.forEach(function (data, i) { //iterate through the dataset
            if (data[i].actualYear >= parseInt(that.props.peakPoint)) {
                var color = that.props.chartColor[0];
                var linestroke = that.props.linestroke[0];
            } else {
                var color = that.props.chartColor[1];
                var linestroke = that.props.linestroke[1];
            }
            select(node)
                .append("path")
                .datum(data)
                .attr("class", "area")
                .style("fill", color)
                .attr("d", area)
                .attr("transform", "translate(" + that.props.margin.left + "," + that.props.margin.top + ")")
                .on("mousemove", function (d, i) {
                })
                .on("mouseout", function (d) {
                });

            // add the valueline path.
            select(node)
                .append("path")
                .datum(data)
                .attr("class", "pathLine")
                .attr('fill', 'none')
                .style("stroke", linestroke)
                .style("stroke-width", '2px')
                .attr("d", valueline)
                .attr("transform", "translate(" + that.props.margin.left + "," + that.props.margin.top + ")");
        });
                //appending line to the bottom of the first target
                select(node)
                .append('line')
                .attr("x1", xScale(new Date("2021"))+that.props.margin.left)
                .attr("x2", xScale(new Date("2021"))+that.props.margin.left)
                .attr("y1", yScale(that.props.goals[0].value) + that.props.margin.bottom)//height + that.props.margin.top + 1) // 1 s the padding to adjust the line in center
                .attr("y2", height + that.props.margin.top)
                .attr("stroke", "#25B3B0")
                .attr("stroke-width", "0.50px")

                //appending line to the bottom of the second target 
                select(node)
                .append('line')
                .attr("x1", xScale(new Date(that.props.peakPoint))+that.props.margin.left)
                .attr("x2", xScale(new Date(that.props.peakPoint))+that.props.margin.left)
                .attr("y1", yScale(that.props.goals[1].value) + that.props.margin.top)
                .attr("y2", height + that.props.margin.top)
                .attr("stroke", "#25B3B0")
                .attr("stroke-width", "0.50px")

    //appending person image at starting point...
        select(node)
            .append("svg:image")
            .attr('x', function () {
                return xScale(new Date(that.props.goal_data[0].actualYear))-15 // -15 is to maintain the distance from the chart
            })
            .attr('y', yScale(that.props.goal_data[0].value)-that.props.margin.top + (10)) // +10 is to touch the lines by persons feet
            .attr('width', 80)
            .attr('height', 80)
            .attr("xlink:href", Running)

    }
    render() {
        if (this.props.resize) {
            // remove the svg element first on resize window 
            d3.selectAll("svg > *").remove();
            d3.selectAll("#retireDiv").remove();
            d3.selectAll("#eduDiv").remove();
            // render the chart
            const foo = this.renderGrowChart(this);
        } else {
            console.log("else: : ", this.props.resize);
        }
        const svg = (
            <svg
                ref={node => this.node = node}
                className={'growthSvg'}
                width={this.props.width}
                height={this.props.height}></svg>
        );
        return (svg);

    }
}
