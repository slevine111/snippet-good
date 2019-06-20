import React, { Component } from 'react'
import { scaleLinear, scaleBand } from 'd3-scale'
import { max } from 'd3-array'
import { select } from 'd3-selection'
import { axisBottom, axisLeft } from 'd3-axis'
import 'd3-transition'

class RatingBarChart extends Component {
    constructor(props) {
        super(props)

    }
    componentDidMount() {
        this.createBarChart()
    }
    componentDidUpdate() {
        this.createBarChart()
    }
    createBarChart = () => {

        //get all stretch ratings by cohort in an object
        console.log(this.props.stretchAnswers)
        var ratingsByCohort = {}
        this.props.stretchAnswers.map(stretch => {
            if (Object.keys(ratingsByCohort).includes(stretch.cohortName)) {
                ratingsByCohort[stretch.cohortName].push(stretch.rating)
            } else {
                ratingsByCohort[stretch.cohortName] = [stretch.rating]
            }
        })

        //Average all scores
        Object.keys(ratingsByCohort).map(key => {
            let total = ratingsByCohort[key].reduce((p, c) => (p + c))
            ratingsByCohort[key] = (total / ratingsByCohort[key].length)
        })

        //formatting for D3
        const formattedData = []
        Object.keys(ratingsByCohort).map(key => formattedData.push({ 'Cohort': key, 'Avg': ratingsByCohort[key] }))
        console.log(formattedData)

        // set the dimensions and margins of the graph
        var margin = { top: 20, right: 20, bottom: 40, left: 40 },
            width = 500 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

        const node = this.node

        const dataMax = max(formattedData.map(d => d.Avg))
        const yScale = scaleLinear()
            .domain([0, dataMax])
            .range([height, 0])

        const xScale = scaleBand()
            .rangeRound([0, width])
            .paddingInner(0.05)
            .domain(formattedData.map(d => d.Cohort))

        var svg = select(node)
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        select(node)
            .selectAll('rect')
            .data(formattedData)
            .enter()
            .append('rect')
            .style('fill', '#3f51b5')
            .attr("height", height)
            .attr("width", 0)//this is the initial value
            .transition()
            .duration(1500)
            .attr('x', d => xScale(d.Cohort))
            .attr('width', (d) => formattedData.length > 0 ? xScale.bandwidth() : xScale.bandwidth() / 2)
            .attr('y', d => yScale(d.Avg))
            .attr('height', d => height - yScale(d.Avg))
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")")
        // .on("mouseover", d => {
        //     div.transition()
        //         .duration(200)
        //         .style("opacity", .9);
        //     div.html(formatTime(d.date) + "<br/>" + d.close)
        //         .style("left", (d3.event.pageX) + "px")
        //         .style("top", (d3.event.pageY - 28) + "px");
        // })
        // .on("mouseout", function (d) {
        //     div.transition()
        //         .duration(500)
        //         .style("opacity", 0);
        // });

        select(node)
            .selectAll('rect')
            .data(formattedData)
            .exit()
            .remove()

        // Add the x Axis
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(axisBottom(xScale));

        // text label for the x axis
        svg.append("text")
            .attr("transform",
                "translate(" + (width / 2) + " ," +
                (height + margin.top + 20) + ")")
            .style("text-anchor", "middle")
            .text("Cohort");

        //Add the y Axis
        svg.append("g")
            .call(axisLeft(yScale));

        // text label for the y axis
        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Average submission rating");

        //Title
        svg.append("text")
            .attr("x", (width / 2))
            .attr("y", 0 + (margin.top))
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("text-decoration", "underline")
            .text(`Average Stretch Score by Cohort`);

    }

    render() {
        console.log('here')
        return (
            <svg ref={node => this.node = node}>
            </svg>
        )
    }
}
export default RatingBarChart