var d3 = require('d3')

var sample_cycle = [
    {name: "Lucille Bluth", email: "test@test.org", target: "Buster Bluth"},
    {name: "Buster Bluth", email: "test@test.org", target: "Michael Bluth"},
    {name: "Michael Bluth", email: "test@test.org", target: "Tobias Funke"},
    {name: "Tobias Funke", email: "test@test.org", target: "George Bluth"},
    {name: "George Bluth", email: "test@test.org", target: "Lindsday Bluth Funke"},
    {name: "Lindsay Bluth Funke", email: "test@test.org", target: "GOB Bluth"},
    {name: "GOB Bluth", email: "test@test.org", target: "Lucille Bluth"}
]

var Visualiser = (dom) => {
    var getGraph = (settings) => {
        var payload = sample_cycle
        return processCyclePayload(payload)
    }
    var processCyclePayload = (cycle) => {
        var id = 0
        var node_set = new Set()
        var nodes = []
        var links = []
        for (let edge of cycle) {
            links.push({
                source: edge.name,
                target: edge.target
            })
            if (!node_set.has(edge.name)) {
                nodes.push({
                    id: edge.name,
                    group: 1
                })
                node_set.add(edge.name)
            }
            if (!node_set.has(edge.target)) {
                nodes.push({
                    id: edge.target,
                    group: 1
                })
                node_set.add(edge.target)
            }
        }
        return {
            nodes,
            links
        }
    }
    var render = (settings) => {
        var graph = getGraph(settings)
        var svg = d3.select(dom)
        var width = svg.style("width").replace("px", "")
        var height = svg.style("height").replace("px", "")
        console.log("width: ", width);
        console.log("height: ", height);
        var color = d3.scaleOrdinal(d3.schemeCategory20)

        var simulation = d3.forceSimulation()
            .force("link", d3.forceLink().id(function(d) { return d.id; }))
            .force("charge", d3.forceManyBody())
            .force("center", d3.forceCenter(width / 2, height / 2));

        var link = svg.append("g")
            .attr("class", "links")
            .selectAll("line")
            .data(graph.links)
            .enter().append("line")
            .attr("stroke-width", function(d) { return Math.sqrt(d.value); });

        var node = svg.append("g")
            .attr("class", "nodes")
            .selectAll("circle")
            .data(graph.nodes)
            .enter().append("circle")
            .attr("r", 5)
            .attr("fill", function(d) { return color(d.group); })
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));

        node.append("title")
            .text(function(d) { return d.id; });

        simulation
            .nodes(graph.nodes)
            .on("tick", ticked);

        simulation.force("link")
            .links(graph.links);

        function ticked() {
            link
                .attr("x1", function(d) { return d.source.x; })
                .attr("y1", function(d) { return d.source.y; })
                .attr("x2", function(d) { return d.target.x; })
                .attr("y2", function(d) { return d.target.y; });

            node
                .attr("cx", function(d) { return d.x; })
                .attr("cy", function(d) { return d.y; });
        }

        function dragstarted(d) {
            if (!d3.event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }

        function dragged(d) {
            d.fx = d3.event.x;
            d.fy = d3.event.y;
        }

        function dragended(d) {
            if (!d3.event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }

    }
    return {
        render
    }
}

exports.Visualiser = Visualiser
