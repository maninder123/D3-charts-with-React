import React, {Component} from 'react';
import * as d3 from "d3";
import {scale} from "d3-scale";
import {path} from "d3-path";
import {interpolate} from "d3-interpolate";
import {scaleLinear, scaleOrdinal, scaleBand, scaleTime} from 'd3-scale';
import {axisBottom as axisBottom, axisLeft as axisLeft} from 'd3-axis';
import {timeFormat, timeParse} from 'd3-time-format';
import {min, max} from 'd3-array';
import {area, monotoneX as curveMonotoneX} from 'd3-shape';
import {select} from 'd3-selection';
import PropTypes from 'prop-types';
import './App.css';
import Logo from './Logo.png';

// main compnent for the chart
export class Areachart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            color: props.color,
            data1: props.data1,
            margin: props.margin
        };
    }
    componentDidMount() {
        this.renderchart(this)
    }

    // function to render the area chart
    renderchart(that) {
        console.log('In render : ', that.props)
        const node = this.node;
        const imgSize = 50;
        var dataset = this.props.data1;
        // var margin = {     top: 50,     right: 20,     bottom: 50,     left: 40 };
        // adding tootip
        var tooltip = select("body")
            .append("div")
            .style("display", "none")
            .style("position", "absolute")
            .html('<div class="tooltip" style="opacity: 1; "><div class= "top-content-wrapper"><p>Y' +
                    'ou will have <span>$' + that.props.value + '/month</span> to spend in retirement</p></div><div class= "bottom-content-wrappe' +
                    'r"><p>Assuming the average life expectancy of <span>' + that.props.age + ' year old</span>,you can receive a total of <span>' + that.props.amount + '</span> when you retire at 65</p></div> <i class="right"></i></div>');

        var width = that.props.width - that.props.margin.left - that.props.margin.right;
        var height = that.props.height - that.props.margin.top - that.props.margin.bottom;

        var max_close = max(that.props.data1, function (d) {
            return d.close;
        });
        var parseTime = timeParse("%Y");
        var demo = that.props.data1;

        // format the data for x-axis year formate
        demo.forEach(function (d) {
            d.date1 = parseTime(d.date);
            d.close = +d.close;
        });
        //defining x-scale
        const x = scaleTime().domain([
            min(demo, function (d) {
                return d.date1;
            }),
            max(demo, function (d) {
                return d.date1;
            })
        ]).range([0, width]);
        // defining y-scale
        const y = scaleLinear()
            .range([height, that.props.margin.top])
            .domain([
                min(that.props.data1, function (d) {
                    return d.close;
                }),
                max(that.props.data1, function (d) {
                    return d.close;
                })
            ]);

        var xAxis = axisBottom()
            .scale(x)
            .tickFormat(timeFormat("%Y"))
        // appending initial text to the chart
        select(node)
            .append("text")
            .attr("transform", "translate(" + (2 * that.props.margin.left) + " ," + (height + that.props.margin.top + 25) + ")")
            .style("text-anchor", "start")
            .attr('fill', "#555555")
            .attr("stroke", "none")
            .text("Today");

        //appending rect for the year text to highlight
        select(node)
            .append("rect")
            .attr("transform", "translate(" + (x(new Date(that.props.pickPoint)) + that.props.margin.left) + " ," + (height + that.props.margin.top) + ")")
            .attr("width", 50)
            .attr("height", 30)
            .attr("rx", 10)
            .attr("ry", 10)
            .attr("x", 0)
            .attr("y", 5)
            .style('fill', '#E0E9FF');

        //appending text to the rectangle at end of x-axis
        var len = that.props.data1.length;
        var text = that.props.data1[len - 1].date;
        select(node)
            .append("text")
            .attr("transform", "translate(" + (x(new Date(that.props.pickPoint)) + that.props.margin.left * 2) + " ," + (height + that.props.margin.top + that.props.margin.bottom / 2) + ")")
            .style("text-anchor", "end")
            .attr('fill', "black")
            .attr("stroke", "none")
            .text(text);

        //appending text at the end of the chart axis
        select(node)
            .append("text")
            .attr("transform", "translate(" + (x(new Date(that.props.pickPoint)) + that.props.margin.left * 4) + " ," + (height + that.props.margin.top + that.props.margin.bottom / 2) + ")")
            .style("text-anchor", "end")
            .attr('fill', "#DADADA")
            .style("font-style", "italic")
            .attr("stroke", "none")
            .text("(Age 65)");

        //appending image to the chart to show the tooltip console.log(that.props)
        select(node)
            .append("svg:image")
            .attr('x', function () {
                return x(new Date(that.props.pickPoint)) + that.props.margin.left - (imgSize / 2)
            })
            .attr('y', imgSize - that.props.margin.left)
            .attr('width', imgSize)
            .attr('height', imgSize)
            .attr("xlink:href", Logo)
            .on("mouseover", function (d) {
                var pageX = d3.event.pageX;
                var pageY = d3.event.pageY;
                console.log("pageY: " + pageY)
                console.log("pageX: " + pageX, (width / 2) - that.props.margin.left)
                if (pageY < that.props.margin.top) {
                    pageY = that.props.margin.top;
                } else {
                    pageY = d3.event.pageY;
                }
                if (pageX > (that.props.width) - that.props.height + that.props.margin.right) {
                    pageX = pageX - imgSize;
                }
                tooltip
                    .style("opacity", 1)
                    .style("left", (pageX - (width / 2 - that.props.margin.left)) + "px")
                    .style("display", "block")
                    .style("top", (pageY - 28) + "px");
                //  .style("left", (90) + "px") .style("display", "block")   .style("top", (7) +
                // "px");
            })
            .on("mouseout", function (d) {
                tooltip.style("display", "none")
            });
        //calling y-axis and appending
        var yAxis = axisLeft().scale(y)
        select(node)
            .append('g')
            .attr('className', 'axis axis--x')
            .attr("transform", "translate(" + that.props.margin.left + "," + (height + that.props.margin.top) + ")")
        // appending line to the bottom of the chart
        select(node)
            .append('line')
            .attr("x1", 0)
            .attr("x2", width + that.props.margin.left + that.props.margin.right)
            .attr("y1", height + that.props.margin.top + 1)
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
                return x(d.date1);
            })
            .y0(height)
            .y1(function (d) {
                return y(d.close);
            });
        // define the line
        var valueline = d3
            .line()
            .x(function (d) {
                return x(d.date1);
            })
            .y(function (d) {
                return y(d.close);
            });

        // sorting the data
        dataset = dataset.sort(function (x, y) {
            return d3.ascending(x.date, y.date);
        })
        // creating two sets of data for different paths.
        var datanew = [];
        var data1 = [],
            data2 = [];
        console.log(that.props)
        dataset.forEach(function (d) {
            if (d.date < parseInt(that.props.pickPoint)) {
                data1.push(d)
            } else if (d.date == parseInt(that.props.pickPoint)) {
                data1.push(d);
                data2.push(d);
            } else {
                data2.push(d);
            }
        })
        datanew.push(data2);
        datanew.push(data1);
        //datanew will hold the chunk of data with close > 2028.
        datanew.forEach(function (d, i) { //iterate through the chunks
            if (d[i].date >= parseInt(that.props.pickPoint)) {
                var c = "#DEE6FB";
                var stroke = "blue";
            } else {
                var c = "#C7F6F5";
                var stroke = "green";
            }
            select(node)
                .append("path")
                .datum(d)
                .attr("class", "area")
                .style("fill", c)
                .attr("d", area)
                .attr("transform", "translate(" + that.props.margin.left + "," + that.props.margin.top + ")");

        });
    }
    render() {
        const svg = (
            <svg
                ref={node => this.node = node}
                id={this.props.id}
                width={this.props.width}
                height={this.props.height}></svg>
        );
        return (svg);
    }
}
