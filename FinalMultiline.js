var svg = d3.select("svg"),
    margin = {top: 20, right: 80, bottom: 50, left: 50},
    width = svg.attr("width") - margin.left - margin.right,
    height = svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var parseTime = d3.timeParse("%Y");

// X axis is time based on the width and y axis is linear based on the height
// The "z" here is used ot give the lines color later
var x = d3.scaleTime().range([0, width]),
    y = d3.scaleLinear().range([height, 0]),
    z = d3.scaleOrdinal(d3.schemeCategory10);

var line = d3.line()
    .curve(d3.curveLinear)
    .x(function(d) { return x(d.year); })
    .y(function(d) { return y(d.TEU); });

// These functions use axis and tick marks to serve as gridlines
function make_x_gridlines() {		
    return d3.axisBottom(x)
        .ticks(5)
}

function make_y_gridlines() {		
    return d3.axisLeft(y)
        .ticks(5)
}

d3.csv("TEUTranspose.csv", type, function(error, data) {
  if (error) throw error;

  // Creates an array containing the port names (col 1 of data except 1st element) and their values
  var ports = data.columns.slice(1).map(function(id) {
    return {
      id: id,
      values: data.map(function(d) {
        return {year: d.year, TEU: d[id]};
      })
    };
  });
    
  /*console.log(ports);
  console.log(data); // 2D array of year and data within that year
  console.log(data.columns); // A column for year and each port
  console.log(data.columns.slice(1)) // A column for each port*/
  
  // Sets the x domain to [min year, max year]
  x.domain(d3.extent(data, function(d) { return d.year; }));

  // Sets the y domain to [min BTU, max BTU]
  y.domain([
    d3.min(ports, function(c) { return d3.min(c.values, function(d) { return d.TEU; }); }),
    d3.max(ports, function(c) { return d3.max(c.values, function(d) { return d.TEU; }); })
  ]);
  
  // Sets the z domain to each color the lines will be
  z.domain(ports.map(function(c) { return c.id; }));
  
  // Makes the x gridlines
  g.append("g")			
    .attr("class", "grid")
    .attr("transform", "translate(0," + height + ")")
    .call(make_x_gridlines()
        .tickSize(-height)
        .tickFormat("")
    )

  // Makes the y gridlines
  g.append("g")			
      .attr("class", "grid")
      .call(make_y_gridlines()
          .tickSize(-width)
          .tickFormat("")
      )

  // Makes the x axis and its title
  g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
    .append("text")
      .attr("x", 450)
      .attr("dy", "2.5em")
      .attr("fill", "#000")
      .attr("font-size", "15px")
      .style("text-anchor", "middle")
      .text("Year");

  // Makes the y axis and its title
  g.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(y))
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -225)
      .attr("dy", "-2.5em")
      .attr("fill", "#000")
      .attr("font-size", "15px")
      .style("text-anchor", "middle")
      .text("Consumption (Million BTU/person)");

  // Sets up an appendable object for each port
  var port = g.selectAll(".port")
    .data(ports)
    .enter().append("g")
      .attr("class", "port")
      .attr("id", function(d) { return d.id; });

  /*function hover(elem) {
     //var attrs = elem.srcElement.attributes;
     //let id = attrs['data-id'].value;
     let path = port.select('#' + elem.id);
     /*if (path.attr('visibility') == 'hidden') {
      return;
     }
     port.selectAll('.line').style('stroke', d => {
      let target_id = d.id.substring(0, 3).toUpperCase();
      if (d.id == elem.id) {
          return z(d.id)
      }else {
          return '#fff'
      }
     });
  }

  function exit(elem) {
     //var attrs = elem.srcElement.attributes;
     //let id = attrs['data-id'].value;
     let path = port.select('#' + elem.id);
     /*if (path.attr('visibility') == 'hidden') {
        return;
     }
     port.selectAll('.line').style('stroke', d => {
        return z(d.id)
     });
  }

  function click(elem) {
    //var attrs = elem.srcElement.attributes;

    //let id = attrs['data-id'].value;

    let p = port.select('#' + elem.id);
      console.log(p);
      p.attr("opacity", 0);
    let visibility = p.attr("opacity");
    if (visibility == 'visible') {
    p.attr('visibility', 'hidden');
    port.selectAll('.line').style('stroke', d => {
     return z(d.id)
     });
    }else{
    p.attr('visibility', 'visible');
    port.selectAll('.line').style('stroke', d => {
      let target_id = d.id.substring(0, 3).toUpperCase();
      if (d.id.substring(0, 3).toUpperCase() == id) {
          return z(d.id)
      }else {
          return '#eaeaea'
      }
     });
    }
  }*/
    
  // Creates the lines for each port
  var path = port.append("path")
      .attr("class", "line")
      .attr("d", function(d) { return line(d.values); })
      // Gives the lines color using z
      .style("stroke", function(d) { return z(d.id); });

  // totalLength used in animation
  var totalLength = path.node().getTotalLength();

  // Creates an "ease in" animation for the lines
  path
      .attr("stroke-dasharray", totalLength + " " + totalLength)
      .attr("stroke-dashoffset", totalLength)
      .transition()
        .duration(2000)
        .ease(d3.easeLinear)
        .attr("stroke-dashoffset", 0);

  // Adds text at the end of each port's line
  port.append("text")
      .datum(function(d) { return {id: d.id, value: d.values[d.values.length - 1]}; })
      .attr("transform", function(d) { return "translate(" + x(d.value.year) + "," + y(d.value.TEU) + ")"; })
      .attr("x", 3)
      .attr("dy", "0.35em")
      .style("font", "10px sans-serif")
      .text(function(d) { return d.id; })

  /*port.on("mouseover", hover)
      .on("mouseout", exit)
      .on("click", click);*/

});

// Sets up the data cused to parse 
function type(d, _, columns) {
  d.year = parseTime(d.year);
  for (var i = 1, n = columns.length, c; i < n; ++i) d[c = columns[i]] = +d[c];
  return d;
}