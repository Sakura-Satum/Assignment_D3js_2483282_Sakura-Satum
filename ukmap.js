function load(val) {

  const width = 900;
  const height = 900;
  var psize = ''

  var svg = d3.select('#map')
    .append('svg').attr('id', 'sid')
    .attr('width', width).attr('height', height)
    .append('g')
    .attr('id', 'gid');


  var tooltip = d3.select('body')
    .append('div')
    .attr('class', 'tooltips');


//map projection
  var prog = d3.geoMercator()
    .translate([width / 2, height / 1.5])
    .scale(2500)
    .center([-2, 52]);

  var path = d3.geoPath()
    .projection(prog);


    //drow map

  d3.json("https://yamu.pro/gb.json", function (error, uk) {
    
   
    if (error) throw error;


    svg.selectAll("land")
      .data(uk.features)
      .enter()
      .append("path")
      .attr("class", "land")
      .attr("d", path);

    console.log(uk.features);
  });

  //Circle(town)
  setTimeout(() => {
    d3.json('http://34.78.46.186/Circles/Towns/' + val, function (error, cities) {

      var maxval =   d3.max(cities, function(d) { return d.Population; });
      var minval =   d3.min(cities, function(d) { return d.Population; });



      console.log(maxval)
      console.log(minval)
      svg.selectAll('cities')
        .data(cities)
        .enter()
        .append('circle')
        .attr('class', 'cities')
        .attr('id', function (d, i) { return 'u' + i; })
        .attr('r', function (d, i) {
          psize = d.Population / 11000

          if (psize < 10) {
            svg.select('#u' + i)
              .attr('style', 'fill:blue');

            return psize;
          }
          else {
            svg.select('#u' + i)
              .attr('style', 'fill:yellow');

            return psize;
          }

        })

        .on("mouseover", function (d) {
          
          d3.select(this).classed("selected", false)
          d3.select(this).attr("r", psize)
          d3.select(this).classed("selected", true)
          d3.select(this).attr("r", "20")
          //ttooptips
          tooltip.html("<b class='tltp_cntry'>Town: </b>" + d.Town + "<br> <b class='tltp_cunty'>County: </b>" + d.County + "<br>" + "<b class='tltp_ppltion'>Population: </b>" + d3.format(",")(d.Population)); return tooltip.style("visibility", "visible");

        })
        //hold the tooltips
        .on("mousemove", function () { return tooltip.style("top", (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px"); })
        //hide the tooltips
        .on("mouseout", function () { d3.select(this).classed("selected", false).attr("r",function(d){return d.Population/11000;}); d3.select("#showTooltps").html(""); return tooltip.style("visibility", "hidden") })
        .transition()
        .duration(800)

        .attr('cx', function (d) {
          var town = prog([d.lng, d.lat]);
          return town[0];
        })
        .attr('cy', function (d) {
          var town = prog([d.lng, d.lat]);
          return town[1];
        })

      svg.selectAll('cityname')
        .data(cities)
        .enter()
        .append('text')
        .attr('class', 'cityname')
        .attr('x', function (d) {
          
          var town = prog([d.lng, d.lat, d.Town])
          return town[0];
        
        })
        .attr('y', function (d) {
          var town = prog([d.lng, d.lat, d.Town])

          return town[1];
        })
        .text(function (d) {
          return d.Town
        })
        .attr('dx',function(d){
          if(psize >= 15){
            return 30;
          }
          if(psize >= 10){
            return 25;
          }
          if(psize <  10){
            return 10;
          }
          
          
        } )
        .attr('dy', 4)

        .on("mouseover", function (d) {
                    d3.select(this).classed("selected", false)
                    d3.select(this).attr("style", 'font-weight: normal')
                    d3.select(this).classed("selected", true)
                    d3.select(this).attr("style", 'font-weight: bold')
          //ttooptips
          tooltip.html("<b class='tltp_cntry'>Town: </b>" + d.Town + "<br> <b class='tltp_cunty'>County: </b>" + d.County + "<br>" + "<b class='tltp_ppltion'>Population: </b>" + d3.format(",")(d.Population)); return tooltip.style("visibility", "visible");

        })
        //hold the tooltips
        .on("mousemove", function () { return tooltip.style("top", (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px"); })
        //hide the tooltips
        .on("mouseout", function () { d3.select(this).classed("selected", false).attr("style",'font-weight: normal'); d3.select("#showTooltps").html(""); return tooltip.style("visibility", "hidden") })

    svg.selectAll('cityximg')
    .data(cities)
    .enter()
    .append('svg:image')
    .attr("class","cityximg")
    .attr("transform",function(d){
      return"translate("+ -10 +","+ -10 +")";
    })
    .attr("xlink:href",function(d){
      if (d.Population === maxval){
      return "locpin.png";
      }
    })
    .attr("x",function(d){
      if (d.Population === maxval){
      var lnglat = prog([d.lng, d.lat])


     return lnglat[0]
      }
    })
    .attr("y",function(d){
      if (d.Population === maxval){
      var lnglat = prog([d.lng, d.lat])
      return lnglat[1]
      }
    })
    .on("mouseover", function (d) {
      //reseting the map hovers
      d3.select(this).classed("selected", false)
      d3.select(this).attr("style", 'width: 25px')
      d3.select(this).classed("selected", true)
      d3.select(this).attr("style", 'width: 30px')
//ttooptips
tooltip.html("<b class='tltp_cntry'>Town: </b>" + d.Town + "<br> <b class='tltp_cunty'>County: </b>" + d.County + "<br>" + "<b class='tltp_ppltion'>Population: </b>" + d3.format(",")(d.Population)); return tooltip.style("visibility", "visible");

})
//hold the tooltips
.on("mousemove", function () { return tooltip.style("top", (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px"); })
//hide the tooltips
.on("mouseout", function () { d3.select(this).classed("selected", false).attr("style",'width: 25px'); d3.select("#showTooltps").html(""); return tooltip.style("visibility", "hidden") })


    svg.selectAll('citymimg')
    .data(cities)
    .enter()
    .append('svg:image')
    .attr("class","citymimg")
    .attr("transform",function(d){
      return"translate("+ -10 +","+ -10 +")";
    })
    .attr("xlink:href",function(d){
      if (d.Population === minval){
      return "locpin.png";
      }
    })
    .attr("x",function(d){
      if (d.Population === minval){
      var lnglat = prog([d.lng, d.lat])


     return lnglat[0]
      }
    })
    .attr("y",function(d){
      if (d.Population === minval){
      var lnglat = prog([d.lng, d.lat])
      return lnglat[1]
      }
    })
    
    .on("mouseover", function (d) {
      d3.select(this).classed("selected", false)
      d3.select(this).attr("style", 'width: 15px')
      d3.select(this).classed("selected", true)
      d3.select(this).attr("style", 'width: 20px')
//ttooptips
tooltip.html("<b class='tltp_cntry'>Town: </b>" + d.Town + "<br> <b class='tltp_cunty'>County: </b>" + d.County + "<br>" + "<b class='tltp_ppltion'>Population: </b>" + d3.format(",")(d.Population)); return tooltip.style("visibility", "visible");

})
//hold the tooltips
.on("mousemove", function () { return tooltip.style("top", (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px"); })
//hide the tooltips
.on("mouseout", function () { d3.select(this).classed("selected", false).attr("style",'width: 15px'); d3.select("#showTooltps").html(""); return tooltip.style("visibility", "hidden") })



  });

  }, 500);

}

//  var slider = d3.select('#slider')
//               .on('slide',function(evt, value)
//                 {
//                   console.log(value)
//                 });


//Slider
var slider = document.getElementById('slider');
var h1 = document.getElementById('rangeh');
slider.oninput = function () {


  console.log(this.value);
  h1.innerHTML = this.value;
  document.getElementById('map').innerHTML = " ";
  load(this.value);
}


//refresh button
d3.select('#refb')
  .on("click", function () {
    var rval = h1.innerHTML
    document.getElementById('map').innerHTML = " ";
    load(rval);
    // d3.select('#refb').attr('data-vl',h1.innerHTML);
    console.log(h1.innerHTML)
  })



