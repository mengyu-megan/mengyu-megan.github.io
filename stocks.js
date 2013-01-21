// use functional style to simplify some statements
function map(arr, f)
{
    var result = [];
    arr.forEach(function(a) { result.push(f(a)); });
    return result;
}

// return the correlation of the given stocks
function corr(s1, s2)
{
    var result = 0;
    for (var i = 0; i < s1.length; i++)
        result += s1[i] * s2[i];
    return result;
}

function update(graph, stocks, data)
{
    // build links from the price correlation
    graph.links = [];
    for (var i = 0; i < stocks.length; i++)
        for (var j = 0; j < i; j++)
        {
            var strengh = Math.abs(corr(data[stocks[i]], data[stocks[j]]));
            if (strengh > 170)
                graph.links.push({"source": i, "target": j, "value": strengh / 100});
            console.log(stocks[i] + ', ' + stocks[j] + ': ' + corr(data[stocks[i]], data[stocks[j]]));
        }
    // invoke d3.js to visualize
    var color = d3.scale.category20();
    var width = 640;
    var height = 560;
    var force = d3.layout.force()
        .charge(-500)
        .linkDistance(160)
        .size([width, height]);

    var svg = d3.select("#svg");
    force.nodes(graph.nodes)
        .links(graph.links)
        .start();

    var node = svg.selectAll(".node")
        .data(graph.nodes)
        .enter()
        .append('g');

    node.append('text')
        .attr("dy", "1.2em")
        .style("text-anchor", "middle")
        .style('font-size', '0.9em')
        .text(function(d) { return d.name; });

    node.append("circle")
        .attr("class", "node")
        .attr("r", 5)
        .style("fill", function(d) { return color(d.group); })
        .call(force.drag);

    node.append("title")
        .text(function(d) { return d.name; });

    var link = svg.selectAll(".link")
        .data(graph.links)
        .enter().append("line")
        .attr("class", "link")
        .style("stroke-width", function(d) { return Math.sqrt(d.value); });

    force.on("tick", function() {
        link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node.attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; })
        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
    });

}

$(function(){
    $('#btnRun').click(function(){
        $('svg').empty();
        // download data from yahoo finance
        var stocks = $('#stocks').val().split(',');
        stocks = map(stocks, function(s) { return s.trim(); });
        var data = {};
        var graph = {};
        var updated = 0;
        graph.nodes = [];
        stocks.forEach(function(s) {
            // crawl
            var url = './stocks/' + s + '.txt';
            $.ajax({ 'url' : url })
            .done(function(d){
                // update the data  
                var prices = map(d.split('\n'), parseFloat);
                // normalization
                var sum = 0;
                var sumSquare = 0;
                prices.forEach(function(p) { sum += p; sumSquare += p * p; });
                sum /= prices.length;
                sumSquare /= prices.length;
                var std = Math.sqrt(sumSquare - sum * sum);
                prices = map(prices, function(p) { return (p - sum) / std; });
                // write to the data object
                data[s] = prices;
                updated++;
                if (updated == stocks.length)
                update(graph, stocks, data);
            }).error(function() { alert("Sorry, we don't have data for stock " + s); });
        graph.nodes.push({"name": s, "group": 1});
        });

    });
});
