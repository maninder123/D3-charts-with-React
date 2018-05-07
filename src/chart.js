import React, {Component} from 'react';
import * as d3 from "d3";
import {scale} from "d3-scale";
import {path} from "d3-path";
import {interpolate, interpolateDate} from "d3-interpolate";
import {scaleLinear, scaleOrdinal, scaleBand, scaleTime} from 'd3-scale';
import {axisBottom as axisBottom, axisLeft as axisLeft} from 'd3-axis';
import {timeFormat, timeParse} from 'd3-time-format';
import {min, max} from 'd3-array';
import {curveBasis, area, monotoneX as curveMonotoneX} from 'd3-shape';
import {select, selectAll} from 'd3-selection';
import PropTypes from 'prop-types';
import './App.css';
import Logo from './Logo.png';

// main compnent to draw the chart
export class Areachart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chartColor: props.chartColor,
            data: props.data,
            margin: props.margin
        };
    }

    componentDidMount() {
        this.renderChart(this);
        // this.getTexWidth(this);
    }

    // function to render the area chart
    renderChart(that) {
        const node = this.node;
        const imgSize = that.props.imgSize;
        var dataset = this.props.data;
        const rectWith = that.props.ascensionDescensionRect_width;
        let rectHeight = that.props.ascensionDescensionRect_height;
        let tooltipWidth = that.props.tooltipWidth;

        //define width and height
        var width = that.props.width - that.props.margin.left - that.props.margin.right;
        var height = that.props.height - that.props.margin.top - that.props.margin.bottom;

        // adding tootip to the image
        var tooltip = select("body")
            .append("div")
            .style("display", "none")
            .style("position", "absolute")
            .html('<div class="tooltip" style="opacity: 1; width: ' + tooltipWidth + 'px"><div class= "top-content-wrapper"><p>You will have <span>$' + that.props.value + '/month</span> to spend in retirement</p></div><div class= "bottom-content-wrappe' +
                    'r"><p>Assuming the average life expectancy of <span>' + that.props.age + ' year old</span>,you can receive a total of <span>' + that.props.amount + '</span> when you retire at 65</p></div> <i class="right"></i></div>');

        // adding tootip to the chart
        var tooltipChart = select("body")
            .append("div")
            .style("display", "none")
            .style("position", "absolute");

        var max_close = max(that.props.data, function (d) {
            return d.y;
        });
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
                min(that.props.data, function (d) {
                    return d.y;
                }),
                max(that.props.data, function (d) {
                    return d.y;
                })
            ]);
        // defining x-Axis
        var xAxis = axisBottom()
            .scale(xScale)
            .tickFormat(timeFormat("%Y"))
        // appending initial text to the chart
        select(node)
            .append("text")
            .attr("transform", "translate(" + (that.props.margin.left) + " ," + (that.props.height - that.props.margin.top) + ")")
            .style("text-anchor", "start")
            .attr('fill', "#555555")
            .attr("stroke", "none")
            .text("Today");

        //appending rectangle to highlight the max year
        select(node)
            .append("rect")
            .attr("transform", "translate(" + (xScale(new Date(that.props.pickPoint)) + that.props.margin.left - rectWith / 2) + " ," + (height + that.props.margin.top) + ")")
            .attr("width", rectWith)
            .attr("height", rectHeight)
            .attr("rx", 10)
            .attr("ry", 10)
            .attr("x", 0)
            .attr("y", 5)
            .style('fill', '#E0E9FF');

        //appending text to the rectangle as max-year
        var len = that.props.data.length;
        var text = that.props.data[len - 1].actualYear;
        select(node)
            .append("text")
            .attr("transform", "translate(" + (xScale(new Date(that.props.pickPoint)) + (that.props.margin.left * 2) - rectWith / 2 + 2) + " ," + (height + that.props.margin.top + that.props.margin.bottom / 2) + ")") // +2 added as the padding to fit text into center of rectangle
            .style("text-anchor", "end")
            .attr('fill', "black")
            .attr("stroke", "none")
            .text(text);

        //appending text at x-axis after max-year rectangle
        select(node)
            .append("text")
            .attr("transform", "translate(" + (xScale(new Date(that.props.pickPoint)) + (that.props.margin.left * 4) - rectWith / 2) + " ," + (height + that.props.margin.top + that.props.margin.bottom / 2) + ")")
            .style("text-anchor", "end")
            .attr('fill', "#DADADA")
            .style("font-style", "italic")
            .attr("stroke", "none")
            .text("(Age 65)");

        //appending image to the chart to show the tooltip console.log(that.props)
        select(node)
            .append("svg:image")
            .attr('x', function () {
                return xScale(new Date(that.props.pickPoint)) + that.props.margin.left - (imgSize / 2)
            })
            .attr('y', imgSize - that.props.margin.left)
            .attr('width', imgSize)
            .attr('height', imgSize)
            .attr("xlink:href", Logo)
            .on("mousemove", function (d) {
                var pageX = d3.event.pageX;
                var pageY = d3.event.pageY;

                if (pageY < that.props.margin.top) {
                    pageY = that.props.margin.top;
                } else {
                    pageY = d3.event.pageY;
                }
                if (pageX > (that.props.width) - that.props.height + that.props.margin.right) {
                    pageX = pageX - imgSize;
                }
                // console.log(pageX, pageY)
                tooltip
                    .style("opacity", 1)
                    .style("left", (pageX - (width / 2 - that.props.margin.left)) + "px")
                    .style("display", "block")
                    .style("top", (pageY - 28) + "px"); // 28 is the margin to bring the tooltip exactly in middle

            })
            .on("mouseout", function (d) {
                tooltip.style("display", "none")
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
            .attr("y1", height + that.props.margin.top + 1) // 1 s the padding to adjust the line in center
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
            if (d.actualYear < parseInt(that.props.pickPoint)) {
                ascensionData.push(d)
            } else if (d.actualYear == parseInt(that.props.pickPoint)) {
                ascensionData.push(d);
                descensionData.push(d);
            } else {
                descensionData.push(d);
            }
        })
        datanew.push(descensionData);
        datanew.push(ascensionData);
        console.log(datanew);
        //datanew will hold the chunk of data with y > 2028.
        datanew.forEach(function (data, i) { //iterate through the dataset
            if (data[i].actualYear >= parseInt(that.props.pickPoint)) {
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
                    var year = xScale.invert(d3.mouse(this)[0])
                    var value_y;
                    for (const value of data) {
                        if (year.getFullYear() == parseInt(value.actualYear)) {
                            value_y = value.y;
                        }
                      }
                    if(value_y){
                    tooltipChart
                        .style("opacity", 1)
                        .style("left", (d3.event.pageX - 160) + "px") // 140 is the tooltip width and 20 is padding to maintain
                        .style("display", "block")
                        .style("top", (d3.event.pageY - 25) + "px") // 25 to bring the tooltip in middle (padding)
                        .html('<div class="tooltipChart" style="opacity: 1; width: ' + 140 + 'px"><div class= "chart-tooltip-content"><span>Year : ' +
                         year.getFullYear() + '</span></br><span>Value : ' + parseFloat(value_y).toFixed(2) + '</span></div><i class="right"></i></div>');
                    }
                })
                .on("mouseout", function (d) {
                    tooltipChart.style("display", "none")
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
    }
    render() {
        if (this.props.resize) {
            // remove the svg element first on resize window d3.selectAll("svg >
            // *").remove();
            d3.selectAll(".mainSvg > *").remove();
            // render the chart
            const foo = this.renderChart(this);
        } else {
            console.log("else: : ", this.props.resize);
        }
        const svg = (
            <svg
                ref={node => this.node = node}
                className={'mainSvg'}
                width={this.props.width}
                height={this.props.height}></svg>
        );
        return (svg);

    }
}
