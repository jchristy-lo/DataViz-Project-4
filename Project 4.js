window.addEventListener("load", run);

var GLOBAL = {
        data: [],
        color: ["cyan","magenta","yellow","darkgrey","white","green"],
        filterSex: [],
        filterRace: [],
        filterCause: [],
        clickedRace: [],
        clickedSex: [],
        fData: []
}

function run() {
    d3.selectAll("svg")
	    .append("text")
		.attr("id","loading")
		.attr("x",100)
		.attr("y",150)
		.attr("dy","0.35em")
		.text("loading data...");

    getData("","",function(data) {
    	GLOBAL.data=data;
      GLOBAL.fData=GLOBAL.data.data;
    	genTimeline();
      filter();
      updateRaceView();
      updateSexView();
    });
}

function filter()
{
  GLOBAL.fData=[];
  // Fill the filter arrays appropriately
  if (GLOBAL.clickedSex.length===0){ // If nothing is selected, everything is shown
    GLOBAL.filterSex = ["M", "F"];
  }else{
    GLOBAL.filterSex = GLOBAL.clickedSex;
  }
  if (GLOBAL.clickedRace.length===0){
    GLOBAL.filterRace = Object.keys(RACE);
  }else{
    GLOBAL.filterRace = GLOBAL.clickedRace;
  }
  if (GLOBAL.filterCause.length===0){
    GLOBAL.filterCause = Object.keys(CAUSE);
  }

  GLOBAL.data.data.forEach(function(datum){
    if(datum["race"] in GLOBAL.filterRace){
      if(""+datum["cause"] in GLOBAL.filterCause){
        if(GLOBAL.filterSex.indexOf(datum["sex"])>-1){
            GLOBAL.fData.push(datum);
        }
      }
    }
    })
}

// Clear the existing visualization
function clear_viz(viz_name)
{
  var svg = document.getElementById(viz_name);
  // Delete all elements in the svg
  while (svg.lastChild)
  {
      svg.removeChild(svg.lastChild);
  }
}

// Get the total number of people satifying all the following criteria
// Takes in arrays of all of these
function getTotals(data, causes, races, sexes, years)
{
  var total = 0;
  for (i in GLOBAL.data.data)
  {
    datapt = GLOBAL.data.data[i]
    if (causes.indexOf(""+datapt["cause"]) > -1 && races.indexOf(""+datapt["race"]) > -1 && sexes.indexOf(""+datapt["sex"]) > -1)
    {
      total += datapt["total"]
    }
  }
  return total;
}

function genTimeline(){

	var svg = d3.select("#timeline");
  svg.selectAll('*').remove();
  GLOBAL.filterCause=[];

	svg.append("text")
	    .attr("x",+svg.attr("width")*1/2)
	    .attr("y", 10)
	    .attr("dy","0.35em")
	    .style("stroke","black")
	    .style("text-anchor","middle")
	    .text("Deaths by cause over time")

	// note: the width attribute holds strings
    var x2003 = +svg.attr("width")*1/9;
    var x2008 = +svg.attr("width")*1/2;
    var x2013 = +svg.attr("width")*8/9;

    svg.append("text")
	    .attr("x",x2003)
	    .attr("y", +svg.attr("height")-8)
	    .attr("dy","0.35em")
	    .style("stroke","black")
	    .style("text-anchor","middle")
	    .text("2003")

	 svg.append("text")
	    .attr("x",x2008)
	    .attr("y", +svg.attr("height")-8)
	    .attr("dy","0.35em")
	    .style("stroke","black")
	    .style("text-anchor","middle")
	    .text("2008")

	svg.append("text")
	    .attr("x",x2013)
	    .attr("y", +svg.attr("height")-8)
	    .attr("dy","0.35em")
	    .style("stroke","black")
	    .style("text-anchor","middle")
	    .text("2013")

    var y = function(deaths){
    	return ((+svg.attr("height")-20)-deaths/maxDeath*(+svg.attr("height")-50));
    }

	var y2003 = {};
	var y2008 = {};
	var y2013 = {};

	GLOBAL.data["causes"].forEach(function(cause){
	    y2003[cause] = 0;
	    y2008[cause] = 0;
	    y2013[cause] = 0;
    })

    var maxDeath = 0

    GLOBAL.fData.forEach(function(datum){
	    if(datum["year"]===2003){
	    	y2003[datum["cause"]] += datum.total;
	    	if(y2003[datum["cause"]]>maxDeath){maxDeath=y2003[datum["cause"]];}
	    }
	    if(datum["year"]===2008){
	    	y2008[datum["cause"]] += datum.total;
	    	if(y2008[datum["cause"]]>maxDeath){maxDeath=y2008[datum["cause"]];}
	    }
	    if(datum["year"]===2013){
	    	y2013[datum["cause"]] += datum.total;
	    	if(y2003[datum["cause"]]>maxDeath){maxDeath=y2003[datum["cause"]];}
	    }
    })

    GLOBAL.data["causes"].forEach(function(cause){

    var g = svg.append("g")
    g.attr("class","unclicked");
    g.attr("id","c"+cause);

	g.append("circle")
    .attr("id","deaths03")
		.attr("cx",x2003)
		.attr("cy",y(y2003[cause]))
		.attr("r","5")
		.style("fill","red")
		.style("stroke","none");

    g.append("circle")
    .attr("id","deaths08")
		.attr("cx",x2008)
		.attr("cy",y(y2008[cause]))
		.attr("r","5")
		.style("fill","red")
		.style("stroke","none");

    g.append("circle")
    .attr("id","deaths13")
		.attr("cx",x2013)
		.attr("cy",y(y2013[cause]))
		.attr("r","5")
		.style("fill","red")
		.style("stroke","none");

    g.append("line")
    .attr("id","line38")
    .attr("x1",x2003)
		.attr("y1",y(y2003[cause]))
		.attr("x2",x2008)
		.attr("y2",y(y2008[cause]))
		.style("stroke","red")
		.style("stroke-width","6px");

	g.append("line")
  .attr("id","line83")
    	.attr("x1",x2008)
		.attr("y1",y(y2008[cause]))
		.attr("x2",x2013)
		.attr("y2",y(y2013[cause]))
		.style("stroke","red")
		.style("stroke-width","6px");

    g.on("mouseover",function () {
    	if(d3.select(this).attr("class")==="unclicked"){
			d3.select(this).selectAll("line").style("stroke","lightblue");
			d3.select(this).selectAll("circle").style("fill","lightblue");
		}

		d3.select(this)
		    .append("text")
		    .attr("class","label")
		    .attr("x",+svg.attr("width")*1/9+10)
		    .attr("y", y(y2003[cause]))
		    .attr("dy","0.25em")
		    .style("stroke","black")
		    .text(CAUSE[cause])

		d3.select(this)
		    .append("text")
		    .attr("class","label")
		    .attr("x",+svg.attr("width")*1/9)
		    .attr("y", y(y2003[cause])+10)
		    .attr("dy","0.25em")
		    .attr("font-size", "10px")
		    .style("stroke","black")
		    .text(y2003[cause]+" deaths")

		d3.select(this)
		    .append("text")
		    .attr("class","label")
		    .attr("x",+svg.attr("width")*1/2)
		    .attr("y", y(y2008[cause])+10)
		    .attr("font-size", "10px")
		    .style("stroke","black")
		    .text(y2008[cause]+" deaths")

		d3.select(this)
		    .append("text")
		    .attr("class","label")
		    .attr("x",+svg.attr("width")*8/9)
		    .attr("y", y(y2013[cause])+10)
		    .attr("font-size", "10px")
		    .style("stroke","black")
		    .text(y2013[cause]+"\n deaths")
	     })

    .on("click",function(){
    	if(d3.select(this).attr("class")==="unclicked"){
        if(GLOBAL.filterCause.length===42){GLOBAL.filterCause=[];}
	    	GLOBAL.filterCause.push(""+cause);
	    	d3.select(this).selectAll("line").style("stroke","blue");
  			d3.select(this).selectAll("circle").style("fill","blue");
  			d3.select(this).attr("class","clicked");
  		}else{
  			GLOBAL.filterCause.splice(GLOBAL.filterCause.indexOf(cause), 1);
  			d3.select(this).attr("class","unclicked");
  			d3.select(this).selectAll("line").style("stroke","red");
  			d3.select(this).selectAll("circle").style("fill","red");
  		}
      filter();
      updateSexView();
      updateRaceView();
    })

	.on("mouseout",function() {
		if(d3.select(this).attr("class")==="unclicked"){
		d3.select(this).selectAll("line").style("stroke","red");
		d3.select(this).selectAll("circle").style("fill","red");
		}
		d3.select(this).selectAll(".label").remove();
    })

	})
}

function updateTimeline(){

  var svg = d3.select("#timeline");

  // note: the width attribute holds strings
    var x2003 = +svg.attr("width")*1/9;
    var x2008 = +svg.attr("width")*1/2;
    var x2013 = +svg.attr("width")*8/9;

  var y = function(deaths){
      return ((+svg.attr("height")-20)-deaths/maxDeath*(+svg.attr("height")-50));
    }

  var y2003 = {};
  var y2008 = {};
  var y2013 = {};

  GLOBAL.data["causes"].forEach(function(cause){
      y2003[cause] = 0;
      y2008[cause] = 0;
      y2013[cause] = 0;
    })

    var maxDeath = 0

    GLOBAL.data.data.forEach(function(datum){
      if(GLOBAL.filterRace.indexOf(datum["race"])>-1){
        if(GLOBAL.filterSex.indexOf(datum["sex"])>-1){

      if(datum["year"]===2003){
        y2003[datum["cause"]] += datum.total;
        if(y2003[datum["cause"]]>maxDeath){maxDeath=y2003[datum["cause"]];}
      }
      if(datum["year"]===2008){
        y2008[datum["cause"]] += datum.total;
        if(y2008[datum["cause"]]>maxDeath){maxDeath=y2008[datum["cause"]];}
      }
      if(datum["year"]===2013){
        y2013[datum["cause"]] += datum.total;
        if(y2013[datum["cause"]]>maxDeath){maxDeath=y2013[datum["cause"]];}
      }
    }}
    })

    GLOBAL.data["causes"].forEach(function(cause){

    var g = svg.select("#c"+cause);

    g.select("#deaths03")
      .transition()
      .attr("cy",y(y2003[cause]));

    g.select("#deaths08")
      .transition()
      .attr("cy",y(y2008[cause]));

    g.select("#deaths13")
      .transition()
      .attr("cy",y(y2013[cause]));

    g.select("#line38")
      .transition()
      .attr("x1",x2003)
      .attr("y1",y(y2003[cause]))
      .attr("x2",x2008)
      .attr("y2",y(y2008[cause]))

    g.select("#line83")
      .transition()
      .attr("x1",x2008)
      .attr("y1",y(y2008[cause]))
      .attr("x2",x2013)
      .attr("y2",y(y2013[cause]))

    g.on("mouseover",function () {
      if(d3.select(this).attr("class")==="unclicked"){
      d3.select(this).selectAll("line").style("stroke","lightblue");
      d3.select(this).selectAll("circle").style("fill","lightblue");
    }

    d3.select(this)
        .append("text")
        .attr("class","label")
        .attr("x",+svg.attr("width")*1/9+10)
        .attr("y", y(y2003[cause]))
        .attr("dy","0.25em")
        .style("stroke","black")
        .text(CAUSE[cause])

    d3.select(this)
        .append("text")
        .attr("class","label")
        .attr("x",+svg.attr("width")*1/9)
        .attr("y", y(y2003[cause])+10)
        .attr("dy","0.25em")
        .attr("font-size", "10px")
        .style("stroke","black")
        .text(y2003[cause]+" deaths")

    d3.select(this)
        .append("text")
        .attr("class","label")
        .attr("x",+svg.attr("width")*1/2)
        .attr("y", y(y2008[cause])+10)
        .attr("font-size", "10px")
        .style("stroke","black")
        .text(y2008[cause]+" deaths")

    d3.select(this)
        .append("text")
        .attr("class","label")
        .attr("x",+svg.attr("width")*8/9)
        .attr("y", y(y2013[cause])+10)
        .attr("font-size", "10px")
        .style("stroke","black")
        .text(y2013[cause]+"\n deaths")
       })

  })
}

function getData (sex,race,f) {

    d3.json("data")
	.header("Content-Type", "application/x-www-form-urlencoded")
	.get("sex="+encodeURIComponent(sex)+"%race="+encodeURIComponent(race),
	     function(error,data) {
		 if (error) {
		     d3.select("#loading").remove();
		     console.log(error);
		 } else {
		     d3.select("#loading").remove();
		     console.log(" data =", data);
		     f(data);
		 }
	     });
}

// Called to update the race view, based on the filters specified in
// GLOBAL.filterSex and GLOBAL.filterCause
function updateRaceView()
{
  clear_viz("race") // Clear the existing viz

  // Calculate race totals
  var races = []
  var total_count = 0
  for (var i = 0; i < Object.keys(RACE).length; i++)
  {
    var race = RACE[i]
    placeholder = "" + i

    var total = getTotals(GLOBAL.data, GLOBAL.filterCause, [placeholder], GLOBAL.filterSex, ["2003", "2008", "2013"])

    // Set up the json with data to create the viz
    races[i] = {}
    races[i]["index"] = i;
    races[i]["race"] = race;
    races[i]["total"] = total;
    total_count += total;
  }

  // calculate the race percents
  for (i in races)
  {
    races[i]["percent"] = (100 * races[i]["total"] / total_count)
  }

  // Draw
  var svg = d3.select("#race");

  // Margins
  var height = svg.attr("height");
  var width = svg.attr("width");
  var margin_y = 15;
  var margin_x = 10;
  // Wedge size variables
  var radius = (height - 2*margin_y) / 2;
  var radius_in = radius/2;
  var theta_prev = 0;

  // Caption
  var caption = svg.append("text")
    .attr("x", width/2)
    .attr("y", height - margin_y/2)
    .attr("dy","0.3em")
    .style("text-anchor","middle")
    .text("Hover over wedges to see information");

  // Create wedges
  var wedges = svg.selectAll("path")
    .data(races) // bind data
    .enter()
    .append("path") // Make wedge out of path objects
    .attr("d", function(d){
      // Function to calculate wedge shape based on data
      value = d["percent"];
      // Wedge shape
      var theta_new = value * Math.PI * 2 / 100;
      var center_x = width/2;
      var center_y = height/2;
      var x_0 = radius * Math.sin(theta_prev) + center_x;
      var y_0 = -1*radius * Math.cos(theta_prev) + center_y;
      var x_0_in = radius_in * Math.sin(theta_prev) + center_x;
      var y_0_in = -1*radius_in * Math.cos(theta_prev) + center_y;
      var x_f = radius * Math.sin(theta_prev + theta_new) + center_x;
      var y_f = -1*radius * Math.cos(theta_prev + theta_new) + center_y;
      var x_f_in = radius_in * Math.sin(theta_prev + theta_new) + center_x;
      var y_f_in = -1*radius_in * Math.cos(theta_prev + theta_new) + center_y;
      if (theta_new < Math.PI)
      {
        var path_string = "M"+x_0+","+y_0+
                          " A" + radius + "," + radius + " 0 0,1 " + x_f + "," + y_f +
                          " L"+x_f_in+","+y_f_in +
                          " A" + radius_in + "," + radius_in + " 0 0,0 " + x_0_in + "," + y_0_in;
      }
      else // path needs different of params for theta > 180 degrees
      {
        var path_string = "M"+x_0+","+y_0+
                          " A" + radius + "," + radius + " 0 1,1 " + x_f + "," + y_f +
                          " L"+x_f_in+","+y_f_in +
                          " A" + radius_in + "," + radius_in + " 0 1,0 " + x_0_in + "," + y_0_in;
      }
      // This is to account for the offset of where to start subsequent wedges
      theta_prev += theta_new;
      return path_string;
    })
    .attr("fill", function(d){
      return GLOBAL.color[d["index"]];
    })
    .attr("stroke", function(d){
      race = "" + d["index"];
      if (GLOBAL.clickedRace.indexOf(race) > -1)
      {
        this.style.stroke = "#000000";
      }
      else
      {
        this.style.stroke = "#BBBBBB";
      }
    })
    .attr("stroke-width", "2")
    .on("mouseover",function(d) {
      // When mouseover, change wedge color and display caption info
      this.style.fill = "#778888";
      caption.text(d["race"] + ": " + Math.round(d["percent"]) + "%");
  	})
    .on("mouseout",function(d) {
      // Reset to standard color and reset caption
      this.style.fill = GLOBAL.color[d["index"]];
      caption.text("Hover over wedges to see information");
    })
    .on("click",function(d){
      race = "" + d["index"]
      if (GLOBAL.clickedRace.indexOf(race) > -1)
      {
        // Add this race to the filter
        d3.select(this).attr("class","clicked");
        GLOBAL.clickedRace.splice(GLOBAL.clickedRace.indexOf(race), 1);
        filter()
        updateTimeline()
        updateSexView()
        this.style.stroke = "#BBBBBB";
      }
      else
      {
        // Remove this race from the filter
        d3.select(this).attr("class","unclicked");
        this.style.stroke = "#000000";
        GLOBAL.clickedRace.push(race);
        filter()
        updateTimeline()
        updateSexView()
      }
    })
}

// updates the sex view based on the contents of
// filterRace and filterCause
function updateSexView(){
  clear_viz("sex")

  // Calculate race totals
  var sexes = []
  var total_count = 0
  for (var i = 0; i < Object.keys(SEX).length; i++)
  {
    var sex = SEX[i+1]

    // This is because the data stores sex as "M" and "F"
    var sexabbrev
    if (i == 0)
    {
      sexabbrev = "M"
    }
    else if (i == 1)
    {
      sexabbrev = "F"
    }

    var total = getTotals(GLOBAL.data, GLOBAL.filterCause, GLOBAL.filterRace, [sexabbrev], ["2003", "2008", "2013"])

    sexes[i] = {}
    sexes[i]["index"] = i;
    sexes[i]["sex"] = sex;
    sexes[i]["total"] = total;
    total_count += total;
  }

  // calculate the race percents
  for (i in sexes)
  {
    sexes[i]["percent"] = (100 * sexes[i]["total"] / total_count)
  }

  var svg = d3.select("#sex");

  // Margins
  var height = svg.attr("height");
  var width = svg.attr("width");
  var margin_y = 15;
  var margin_x = 10;
  // Wedge size variables
  var radius = (height - 2*margin_y) / 2;
  var radius_in = radius/2;
  var theta_prev = 0;

  // Caption
  var caption = svg.append("text")
    .attr("x", width/2)
    .attr("y", height - margin_y/2)
    .attr("dy","0.3em")
    .style("text-anchor","middle")
    .text("Hover over wedges to see information");

  // Create wedges
  var wedges = svg.selectAll("path")
    .data(sexes) // bind data
    .enter()
    .append("path") // Make wedge out of path objects
    .attr("d", function(d){
      // Function to calculate wedge shape based on data
      value = d["percent"];
      // Wedge shape
      var theta_new = value * Math.PI * 2 / 100;
      var center_x = width/2;
      var center_y = height/2;
      var x_0 = radius * Math.sin(theta_prev) + center_x;
      var y_0 = -1*radius * Math.cos(theta_prev) + center_y;
      var x_0_in = radius_in * Math.sin(theta_prev) + center_x;
      var y_0_in = -1*radius_in * Math.cos(theta_prev) + center_y;
      var x_f = radius * Math.sin(theta_prev + theta_new) + center_x;
      var y_f = -1*radius * Math.cos(theta_prev + theta_new) + center_y;
      var x_f_in = radius_in * Math.sin(theta_prev + theta_new) + center_x;
      var y_f_in = -1*radius_in * Math.cos(theta_prev + theta_new) + center_y;
      if (theta_new < Math.PI)
      {
        var path_string = "M"+x_0+","+y_0+
                          " A" + radius + "," + radius + " 0 0,1 " + x_f + "," + y_f +
                          " L"+x_f_in+","+y_f_in +
                          " A" + radius_in + "," + radius_in + " 0 0,0 " + x_0_in + "," + y_0_in;
      }
      else // path needs different of params for theta > 180 degrees
      {
        var path_string = "M"+x_0+","+y_0+
                          " A" + radius + "," + radius + " 0 1,1 " + x_f + "," + y_f +
                          " L"+x_f_in+","+y_f_in +
                          " A" + radius_in + "," + radius_in + " 0 1,0 " + x_0_in + "," + y_0_in;
      }
      // This is to account for the offset of where to start subsequent wedges
      theta_prev += theta_new;
      return path_string;
    })
    .attr("fill", function(d){
      return GLOBAL.color[d["index"]];
    })
    .attr("stroke", function(d){
      sex = "" + (d["index"] + 1)
      var sexabbrev
      if (d["index"] == 0)
      {
        sexabbrev = "M"
      }
      else if (d["index"] == 1)
      {
        sexabbrev = "F"
      }
      if (GLOBAL.clickedSex.indexOf(sexabbrev) > -1)
      {
        this.style.stroke = "#000000";
      }
      else
      {
        this.style.stroke = "#BBBBBB";
      }
    })
    .attr("stroke-width", "2")
    .on("mouseover",function(d) {
      // When mouseover, change wedge color and display caption info
      this.style.fill = "#778888";
      caption.text(d["sex"] + ": " + Math.round(d["percent"]) + "%");
  	})
    .on("mouseout",function(d) {
      // Reset to standard color and reset caption
      this.style.fill = GLOBAL.color[d["index"]];
      caption.text("Hover over wedges to see information");
    })
    .on("click",function(d){
      sex = "" + (d["index"] + 1)
      var sexabbrev
      if (d["index"] == 0)
      {
        sexabbrev = "M"
      }
      else if (d["index"] == 1)
      {
        sexabbrev = "F"
      }
      if (GLOBAL.clickedSex.indexOf(sexabbrev) > -1)
      {
        d3.select(this).attr("class","clicked");
        GLOBAL.clickedSex.splice(GLOBAL.clickedSex.indexOf(sex), 1);
        filter()
        updateTimeline()
        updateRaceView()
        this.style.stroke = "#BBBBBB";
      }
      else
      {
        d3.select(this).attr("class","unclicked");
        this.style.stroke = "#000000";
        GLOBAL.clickedSex.push(sexabbrev);
        filter()
        updateTimeline()
        updateRaceView()
      }
    })
}

var RACE = {
	"0": "Other",
	"1": "White",
	"2": "Black",
	"3": "American Indian",
	"4": "Asian/Pacific Islander"
}

var SEX = {
	"1": "Males",
	"2": "Females",
}

var CAUSE = {
    "1":"Tuberculosis",
    "2":"Syphilis",
    "3":"Human immunodeficiency virus (HIV) disease",
    "4":"Malignant neoplasms",
    "5":"Malignant neoplasm of stomach",
    "6":"Malignant neoplasms of colon, rectum and anus",
    "7":"Malignant neoplasm of pancreas",
    "8":"Malignant neoplasms of trachea, bronchus and lung",
    "9":"Malignant neoplasm of breast",
    "10":"Malignant neoplasms of cervix uteri, corpus uteri and ovary",
    "11":"Malignant neoplasm of prostate",
    "12":"Malignant neoplasms of urinary tract",
    "13":"Non-Hodgkin's lymphoma",
    "14":"Leukemia",
    "15":"Other malignant neoplasms",
    "16":"Diabetes mellitus",
    "17":"Alzheimer's disease",
    "18":"Major cardiovascular diseases",
    "19":"Diseases of heart",
    "20":"Hypertensive heart disease",
    "21":"Ischemic heart diseases",
    "22":"Other diseases of heart",
    "23":"Essential (primary) hypertension and hypertensive renal disease",
    "24":"Cerebrovascular diseases",
    "25":"Atherosclerosis",
    "26":"Other diseases of circulatory system",
    "27":"Influenza and pneumonia",
    "28":"Chronic lower respiratory diseases",
    "29":"Peptic ulcer",
    "30":"Chronic liver disease and cirrhosis",
    "31":"Nephritis, nephrotic syndrome, and nephrosis",
    "32":"Pregnancy, childbirth and the puerperium",
    "33":"Certain conditions originating in the perinatal period",
    "34":"Congenital malformations, deformations and chromosomal abnormalities",
    "35":"Sudden infant death syndrome",
    "36":"Symptoms, signs and abnormal clinical and laboratory findings, not elsewhere classified",
    "37":"All other diseases (Residual)",
    "38":"Motor vehicle accidents",
    "39":"All other and unspecified accidents and adverse effects",
    "40":"Intentional self-harm (suicide)",
    "41":"Assault (homicide)",
    "42":"All other external causes"
}
