var d3 = require('d3')

var sample_cycle = [
    {name: "Lucille Bluth", email: "test@test.org", target: "Buster Bluth"},
    {name: "Buster Bluth", email: "test@test.org", target: "Michael Bluth"},
    {name: "Michael Bluth", email: "test@test.org", target: "Tobias Funke"},
    {name: "Tobias Funke", email: "test@test.org", target: "George Bluth"},
    {name: "George Bluth", email: "test@test.org", target: "Lindsay Bluth Funke"},
    {name: "Lindsay Bluth Funke", email: "test@test.org", target: "GOB Bluth"},
    {name: "GOB Bluth", email: "test@test.org", target: "Lucille Bluth"}
]

//http://stackoverflow.com/questions/8567114/how-to-make-an-ajax-call-without-jquery
function get(url) {
    return new Promise((resolve, reject) => {
        const req = new XMLHttpRequest();
        req.open('GET', url);
        req.onload = () => req.status === 200 ? resolve(req.response) : reject(Error(req.statusText));
        req.onerror = (e) => reject(Error(`Network Error: ${e}`));
        req.send();
    });
}

function post(url, data) {
    return new Promise((resolve, reject) => {
        const req = new XMLHttpRequest()
        req.open('POST', url, true)
        req.setRequestHeader("Content-type", "application/json")
        req.onload = () => req.status === 200 ? resolve(req.response) : reject(Error(req.statusText))
        req.onerror = (e) => reject(Error(`Network Error: ${e}`))
        req.send(JSON.stringify(data))
    });
}
exports.post = post

var Visualiser = (dom) => {
    var getGraph = (settings, callback) => {
        get("http://localhost:5000").then((response) => {
            callback(response)
        }).catch((error) => {
            console.log("error: ", error);
        })
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
    var renderGraph = (graph) => {
        var svg = d3.select(dom)
        var width = svg.style("width").replace("px", "")
        var height = svg.style("height").replace("px", "")
        var color = d3.scaleOrdinal(d3.schemeCategory20)

        var simulation = d3.forceSimulation()
            .force("link", d3.forceLink().id(function(d) { return d.id; }).distance(60))
            .force("charge", d3.forceManyBody().strength(-100))
            .force("center", d3.forceCenter(width / 2, height / 2));

        simulation
            .nodes(graph.nodes)
            .on("tick", ticked)

        simulation.force("link")
            .links(graph.links);

        // build the arrow.
        svg.append("svg:defs").selectAll("marker")
            .data(["end"])      // Different link/path types can be defined here
            .enter().append("svg:marker")    // This section adds in the arrows
            .attr("id", String)
            .attr("viewBox", "0 -5 10 10")
            .attr("refX", 15)
            .attr("refY", -1.5)
            .attr("markerWidth", 6)
            .attr("markerHeight", 6)
            .attr("orient", "auto")
            .append("svg:path")
            .attr("d", "M0,-5L10,0L0,5");

        var link = svg.append("g")
            .attr("class", "links")
            .selectAll("path")
            .data(graph.links)
            .enter().append("path")
            .attr("class", "link")
            .attr("marker-end", "url(#end)");

        var node = svg.append("g")
            .attr("class", "nodes")
            .selectAll(".node")
            .data(graph.nodes)
            .enter().append("g")
            .attr("class", "node")
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended))

        node.append('circle')
            .attr("r", 5)
            .attr("fill", function(d) { return color(d.group); })

        node.append("text")
            .text(function(d) {return d.id})
            .attr("dx", 5)
            .attr("dy", 15)

        function ticked() {
            link
                .attr("d", linkArc)

            node
                .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
        }

        function linkArc(d) {
            var dx = d.target.x - d.source.x,
                dy = d.target.y - d.source.y,
                dr = Math.sqrt(dx * dx + dy * dy);
            return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
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
    var render = (settings) => {
        //getGraph(settings, (cycle) => {
            var graph = processCyclePayload(sample_cycle)
            renderGraph(graph)
        //})
    }
    return {
        render
    }
}

exports.Visualiser = Visualiser
