window.addEventListener("load", run);

var GLOBAL = { 
        data: [],
        filterSex: [],
        filterRace: [],
        filterCause: [],
        fData: {}
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
    	updateTimeline(data.data);
       });
}

function filter(){
	if(GLOBAL.filterSex.length===0 & GLOBAL.filterRace.length===0 & GLOBAL.filterCause.length===0){
		GLOBAL.fData=GLOBAL.data;
	}else{
		// fData=[];
		GLOBAL.data.data.forEach(function (r) {
    });
	}
}

function updateTimeline (data){
	var svg = d3.select("#timeline");

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

    data.forEach(function(datum){
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

	g.append("circle")
		.attr("cx",x2003)
		.attr("cy",y(y2003[cause]))
		.attr("r","5")
		.style("fill","red")
		.style("stroke","none");

    g.append("circle")
		.attr("cx",x2008)
		.attr("cy",y(y2008[cause]))
		.attr("r","5")
		.style("fill","red")
		.style("stroke","none");

    g.append("circle")
		.attr("cx",x2013)
		.attr("cy",y(y2013[cause]))
		.attr("r","5")
		.style("fill","red")
		.style("stroke","none");

    g.append("line")
    	.attr("x1",x2003)
		.attr("y1",y(y2003[cause]))
		.attr("x2",x2008)
		.attr("y2",y(y2008[cause]))
		.attr("x3",x2013)
		.attr("y3",y(y2013[cause]))
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
		    .attr("x",+svg.attr("width")*1/9+20)
		    .attr("y", y(y2003[cause]))
		    .attr("dy","0.35em")
		    .style("stroke","black")
		    .style("text-anchor","start")
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
		    .text(y2013[cause]+" deaths")
	     })

    .on("click",function(){
    	if(d3.select(this).attr("class")==="unclicked"){
	    	GLOBAL.filterCause.push(cause);
	    	d3.select(this).selectAll("line").style("stroke","blue");
			d3.select(this).selectAll("circle").style("fill","blue");
			d3.select(this).attr("class","clicked");
			filter();
			// updateSex();
			// updateRace();
		}else{
			GLOBAL.filterCause.splice(GLOBAL.filterCause.indexOf(cause), 1);
			d3.select(this).attr("class","unclicked");
			d3.select(this).selectAll("line").style("stroke","red");
			d3.select(this).selectAll("circle").style("fill","red");
		}
    })

	.on("mouseout",function() { 
		if(d3.select(this).attr("class")==="unclicked"){
		d3.select(this).selectAll("line").style("stroke","red");
		d3.select(this).selectAll("circle").style("fill","red");
		}
		d3.select(this).selectAll(".label").remove();
	});

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

var RACE = {
	"0": "Other",
	"1": "White",
	"2": "Black",
	"3": "American Indian",
	"4": "Asian/Pacific Islander"

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