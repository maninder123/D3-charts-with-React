import React, {Component} from 'react';
import * as d3 from "d3";
import {scaleLinear, scaleTime} from 'd3-scale';
import {axisBottom} from 'd3-axis';
import {timeFormat, timeParse} from 'd3-time-format';
import {select} from 'd3-selection';
// import './chart.css';
import dollerIcon from './dollerIcon.png';

// main compnent to draw the chart
export class MultiLineAreaDiffChart extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        this.renderLineChart(this);
    }

    // function to render the area chart
    renderLineChart(that) {
        const node = this.node;
        // const imgSize = that.props.imgSize;
        var data = this.props.data;
        data.forEach(function (d) {
            d.upper = parseFloat(d.upper);
            d.median = parseFloat(d.median);
            d.lower = parseFloat(d.lower);
        });
        console.log(data);

        var parseTime = timeParse("%Y");

        //define width and height
        var width = that.props.width - that.props.margin.left - that.props.margin.right;
        var height = that.props.height - that.props.margin.top - that.props.margin.bottom;

        // adding tootip to the image
        var areaTooltip = select("body")
            .append("div")
            .style("display", "none")
            .style("position", "absolute")
            .html('<div class="area-tooltip" style="height:100px; opacity: 1; width: ' + 500 + 'px"><div class= "top-content-wrapper"><p>What you can expect to have in <span>' + data[data.length - 1].date + '</span></p><div class="first-circle"><span class="dot"><span class="first">Estim' +
                    'atedReturn</span></span></div><div class="second-circle"><span class="dot"><span' +
                    ' class="sec">PessimisticScenario</span></span></div><div class="third-circle"><s' +
                    'pan class="dot"><span class="thi">OptimisticScenario</span></span></div></div><d' +
                    'iv class="bottom-content-wrapper"><span class="first">' + ('$' + data[data.length - 1].median) + '</span><span class="sec">' + ('$' + data[data.length - 1].lower) + '</span><span class="thi">' + ('$' + data[data.length - 1].upper) + '</span></div> <i class="down"></i></div>');

        select(node).attr("transform", "translate(" + 0 + "," + that.props.margin.top * 2 + ")")

        const b_aExtent = d3.extent(data, function (d) {
            return d.upper
        });
        const o_aExtent = d3.extent(data, function (d) {
            return d.median
        });
        const o_bExtent = d3.extent(data, function (d) {
            return d.lower
        });

        const chartExtent = ([
            Math.min(b_aExtent[0], o_aExtent[0], o_bExtent[0]) - 5,
            Math.max(b_aExtent[1], o_aExtent[1], o_bExtent[1]) + 5
        ]);
        data.forEach(function (d) {
            d.x = parseTime(d.date);
        });

        const maxValue_x = Math.max(...data.map(d => d.x));
        const minValue_x = Math.min(...data.map(d => d.x));

        // defining x-scale 
        const xScale = scaleTime()
            .domain([minValue_x, maxValue_x])
            .range([0, width]);

        // defining y-scale
        const yScale = scaleLinear()
            .domain(chartExtent)
            .range([height, that.props.margin.top]);

        // defining x-Axis
        var xAxis = axisBottom()
            .scale(xScale)
            .ticks(4)
            .tickFormat(timeFormat("%Y"))

        // appending translate to the x-axis chart
        select(node)
            .append('g')
            .attr('className', 'axis axis--x')
            .attr("transform", "translate(" + that.props.margin.left + "," + (height + that.props.margin.top - 60) + ")")
            .call(xAxis);
        //  appending translate to the y-axis chart
        select(node)
            .append('g')
            .attr('className', 'axis axis--y')
            .attr("transform", "translate(" + that.props.margin.left + "," + that.props.margin.top + ")");
        // .call(yAxis); 
        
        //creating line for upper
        const b_aLine = d3
            .line()
            .x(function (d, i) {
                return xScale(d.x)
            })
            .y(function (d) {
                return yScale(d.upper)
            })
            .curve(d3.curveBasis);
        // creating line for median
        const o_aLine = d3
            .line()
            .x(function (d, i) {
                return xScale(d.x)
            })
            .y(function (d) {
                return yScale(d.median)
            })
            .curve(d3.curveBasis);
        // creating line for lower
        const o_bLine = d3
            .line()
            .x(function (d, i) {
                return xScale(d.x)
            })
            .y(function (d) {
                return yScale(d.lower)
            })
            .curve(d3.curveBasis);
        //appending area between the upper and median
        const b_aDifference = d3
            .area()
            .x(function (d, i) {
                return xScale(d.x)
            })
            .y0(function (d) {
                return yScale(Math.max(d.upper, d.median))
            })
            .y1(function (d) {
                return yScale(d.median)
            })
            .curve(d3.curveBasis);
        //appending area between the median and lower
        const o_aDifference = d3
            .area()
            .x(function (d, i) {
                return xScale(d.x)
            })
            .y0(function (d) {
                return yScale(Math.max(d.lower, d.median))
            })
            .y1(function (d) {
                return yScale(d.upper)
            })
            .curve(d3.curveBasis);
        //appending area between the upper and lower
        const o_bDifference = d3
            .area()
            .x(function (d, i) {
                return xScale(d.x)
            })
            .y0(function (d) {
                return yScale(Math.max(d.upper, d.median))
            })
            .y1(function (d) {
                return yScale(d.lower)
            })
            .curve(d3.curveBasis);
        //  appending line to end of the chart
        select(node)
            .append('line')
            .attr("x1", xScale(new Date('"' + data[data.length - 1].x + '"')) + 1)
            .attr("x2", xScale(new Date('"' + data[data.length - 1].x + '"')) + 1)
            .attr("y1", height - 40)
            .attr("y2", 0)
            .attr("transform", "translate(" + that.props.margin.left + "," + (that.props.margin.top - 20) + ")")
            .attr("stroke", "#879BAF")
            .attr("stroke-width", "2px")

        //appending line to the bottom of the chart
        select(node)
            .append('line')
            .attr("x1", 0)
            .attr("x2", width + that.props.margin.left + that.props.margin.right)
            .attr("y1", height + that.props.margin.top - 60 + 1) // 1 is the padding to adjust the line in center
            .attr("y2", height + that.props.margin.top - 60 + 1)
            .attr("stroke", "#D8D8D8")
            .attr("stroke-width", "2px")
        //appending image to chart
        select(node)
            .append("svg:image")
            .attr("x", xScale(new Date('"' + data[data.length - 1].x + '"')) + 28)
            .attr('y', yScale(data[data.length - 1].upper) - that.props.margin.bottom - 20)
            .attr('height', 40)
            .attr("xlink:href", dollerIcon)
            .on('mousemove', function () {
                var pageX = d3.event.pageX;
                 var pageY = d3.event.pageY;
                areaTooltip
                    .style("opacity", 1)
                    .style("left", (pageX-(400+10)) + "px") // 400 is tooltip width and +10 is margin
                    .style("display", "block")
                    .style("top", (pageY-(100+25)) + "px"); // 100 is height and +25 is margin

            })
            .on('mouseout', function () {
                areaTooltip.style("display", "none")
            });
        //appending upperamt path
        select(node)
            .append("path")
            .attr("class", "area")
            .style("fill", "#C7F6F5")
            .style("fill-opacity", 1)
            .attr("d", b_aDifference(data))
            .attr("transform", "translate(" + that.props.margin.left + "," + (0) + ")")
        //appending medianamt path
        select(node)
            .append("path")
            .attr("class", "area")
            .style("fill", "#C7F6F5")
            .style("fill-opacity", 1)
            .attr("d", o_aDifference(data))
            .attr("transform", "translate(" + that.props.margin.left + "," + (0) + ")")
        //appending loweramt path
        select(node)
            .append("path")
            .attr("class", "area")
            .style("fill", "#C7F6F5")
            .style("fill-opacity", 1)
            .attr("d", o_bDifference(data))
            .attr("transform", "translate(" + that.props.margin.left + "," + (0) + ")")
        //appending upperamt line
        select(node)
            .append("path")
            .style("fill", "none")
            .style("stroke-width", "1px")
            .style("stroke", "#26b72d")
            .attr("class", "line")
            .attr("d", b_aLine(data))
            .attr("transform", "translate(" + that.props.margin.left + "," + (0) + ")")

        //appending medianamt line

        select(node)
            .append("path")
            .style("fill", "none")
            .style("stroke-width", "1px")
            .style("stroke", "#4f4f4f")
            .attr("class", "line")
            .attr("d", o_bLine(data))
            .attr("transform", "translate(" + that.props.margin.left + "," + (0) + ")");

        //appending loweramt line
        select(node)
            .append("path")
            .style("fill", "none")
            .style("stroke-width", "2px")
            .style("stroke", "#009288")
            .attr("class", "line")
            .attr("d", o_aLine(data))
            .attr("transform", "translate(" + that.props.margin.left + "," + (0) + ")");

        //appending circle for upperamr line
        select(node)
            .append("circle")
            .attr("cx", function () {
                return xScale(data[data.length - 1].x);
            })
            .attr("cy", function () {
                return yScale(data[data.length - 1].upper);
            })
            .attr("r", 8)
            .style("fill", "#26b72d")
            .attr("transform", "translate(" + that.props.margin.left + "," + (0) + ")");

        //appending circle for medianamt line
        select(node)
            .append("circle")
            .attr("cx", function () {
                return xScale(data[data.length - 1].x);
            })
            .attr("cy", function () {
                return yScale(data[data.length - 1].median);
            })
            .attr("r", 8)
            .style("fill", "#009288")
            .attr("transform", "translate(" + that.props.margin.left + "," + (0) + ")");

        //appending circle for loweramt line
        select(node)
            .append("circle")
            .attr("cx", function () {
                return xScale(data[data.length - 1].x);
            })
            .attr("cy", function () {
                return yScale(data[data.length - 1].lower);
            })
            .attr("r", 8)
            .style("fill", "#4f4f4f")
            .attr("transform", "translate(" + that.props.margin.left + "," + (0) + ")");

        //appending text for upperamr line
        select(node)
            .append("text")
            .attr("x", function () {
                return xScale(data[data.length - 1].x) + 50;
            })
            .attr("y", function () {
                return yScale(data[data.length - 1].upper);
            })
            .attr("dy", ".35em")
            .text(function () {
                return "$" + data[data.length - 1].upper;
            })
            .style("font-size", "12px")
            .style("fill", "#879BAF");

        //appending text for upperamr line
        select(node)
            .append("text")
            .attr("x", function () {
                return xScale(data[data.length - 1].x) + 50;
            })
            .attr("y", function () {
                return yScale(data[data.length - 1].median);
            })
            .attr("dy", ".35em")
            .text(function () {
                return "$" + data[data.length - 1].median;
            })
            .style("font-size", "12px")
            .style("fill", "#879BAF");

        //appending text for upperamr line
        select(node)
            .append("text")
            .attr("x", function () {
                return xScale(data[data.length - 1].x) + 50;
            })
            .attr("y", function () {
                return yScale(data[data.length - 1].lower);
            })
            .attr("dy", ".35em")
            .text(function () {
                return "$" + data[data.length - 1].lower;
            })
            .style("font-size", "12px")
            .style("fill", "#879BAF");

    }
    render() {
        const svg = (
            <svg
                ref={node => this.node = node}
                className={'areaLineSvg'}
                width={this.props.width}
                height={this.props.height}></svg>
        );
        return (svg);
    }
}
