pcBrushed = false;

function myChart() {
	
	//create dataset of items to show on list (make possible to use datamaps), gives brushed countries a different color than default
	function createDataset(data){
			var dataset = {};
				data.forEach(function (item) {
					if (item.CountryID === "null") {
					} else {
					var iso = item.CountryID;
					dataset[iso] = { fillColor: "#009688",
						countryData: item
						}
					}
				});
			return dataset;
	} //end createDataset()
	var map;
	//creates datamap with default grey color for non-brushed contries
	function createMap(dataset){
		
		map = new Datamap({
			element: document.getElementById('world'),
			//projection: 'mercator'
			fills: {defaultFill: "#B0BEC5"},
			data: dataset,
			geographyConfig: {
				highlightFillColor: "#FFA000", //color of "country of interest"/hover over
				popupTemplate: function(geography, data) {
			                	cID = geography.id;
			                	dID = String(cID);
			                	if (!dataset[dID]){  //if the country is not dataset, unhighlight pc for less confusion
			                		parcoords.unhighlight();
			                	} else { //highlights pc when you hover on a country that is in dataset
				                	console.log("d3 select", d3.select('td'));
				                	countryHighlight = dataset[dID].countryData;
				                	parcoords.highlight([countryHighlight]);
				                	//d3.select('td')

				     //            	cID = String(d.CountryID)
									// d3.selectAll('.datamaps-subunit.'+ cID)
									// 	.style("fill", "#FFA000");


			    				}
			    				return '<div class="hoverinfo"><strong>' +geography.properties.name +'</strong></div>';
			    }
			},		
			done: function(datamap) { //unhighlights pc when you move out of the svg
				d3.select('#world')
            		.on("mouseout", function(d) {
            			parcoords.unhighlight()
            		});
        	}
		});
	}//end createMap()

	//range of different colors for lines
	var colors = d3.scale.linear()
		.domain([1, 9])
		.range(["#6A1B9A", "#009688", "#006064"])
		.interpolate(d3.interpolate);

	//color is based on the value in one column
	var color = function(d) { return colors(d['SatisfactionLife']); };

	//initiates the pc and set them to div #vis
	var parcoords = d3.parcoords()("#vis")
		.color(color)
		.alpha(0.4)

	//creates the view/chart were the d3 is shown, selector = div, rawData = loaded data
	var chart = function chart(selector, rawData) {
		//clears the map div to avoid duplicates
		document.getElementById('world').innerHTML = "";

		// sets rawData to data
		var data = rawData; 

		//create dataset to work with datamaps
		dataset = createDataset(data);

		//create map using datamaps
		createMap(dataset, data);


		//set dimensions on axes (currently not working)
		var dimensions = {
			"SatisfactionLife": {
				title: "Satisfaction w Life",
				ticks: 6,
				tickValues: [0, 2, 4, 6, 8, 10],
				orient: "left",

			},
			"DemocraticGov": {
				title: "Perceived Democracy",
				type: "number",
				ticks: 6,
				tickValues: [0, 2, 4, 6, 8, 10],
				orient: "left",
				innerTickSize: 2,
				outerTickSize: 10,
				tickPadding: 1
			},
			"Trust": {
				title: "Trust",
				type: "number",
				ticks: 6,
				tickValues: [0, 2, 4, 6, 8, 10],
				orient: "left",
				innerTickSize: 2,
				outerTickSize: 10,
				tickPadding: 1
			},
			"NationalityPride": {
				title: "Pride in Nationality",
				type: "number",
				ticks: 6,
				tickValues: [0, 2, 4, 6, 8, 10],
				orient: "left",
				innerTickSize: 2,
				outerTickSize: 10,
				tickPadding: 1
			},
			"GNI": {
				title: "GNI/Capita($K)",
				type: "number",
				ticks: 6,
				tickValues: [0, 20, 40, 60, 80, 100],
				orient: "left",
				innerTickSize: "2",
				outerTickSize: "10",
				tickPadding: 1
			},
			"ConfidenceInPress": {
				title: "Confidence in the Press",
				type: "number",
				ticks: 6,
				tickValues: [0, 2, 4, 6, 8, 10],
				orient: "left",
				innerTickSize: 2,
				outerTickSize: 10,
				tickPadding: 1
			},
			"WillingnessToFight": {
				title: "Willingness To Fight",
				type: "number",
				ticks: 6,
				tickValues: [0, 2, 4, 6, 8, 10],
				orient: "left",
				innerTickSize: 2,
				outerTickSize: 10,
				tickPadding: 1
			},
			"HumanRights": {
				title: "Human Rights",
				type: "number",
				ticks: 6,
				tickValues: [0, 2, 4, 6, 8, 10],
				orient: "left",
				innerTickSize: 2,
				outerTickSize: 10,
				tickPadding: 1
			}
		};


		//creates the pc + attributes etc
		parcoords
			.data(data)
			//.dimensions(dimensions)
			.hideAxis(["Country", "CountryID", "Homicide/100 000", "Internet/100", "Refugees", "People/km^2", "% gov spend military"])
			.render()
			.brushMode("1D-axes") //enables brushing
			.interactive()
			.reorderable() 
			.updateAxes();

		//update data table and map on brush event
		parcoords.on("brush", function(d) {
			// d3.select("#grid")
			// 	.datum(d.slice(0,40))
			// 	.call(grid)
			// 	.selectAll(".row")
			// 	.on({
			// 		"mouseover": function(d) {
			// 			parcoords.highlight([d])
			// 		},
			// 		"mouseout": parcoords.unhighlight

			// 	});

			var brushed = parcoords.brushed();
			
			if(brushed.length > 0) { //if any data is brushed on pc, the map will update
				pcBrushed = true;

				document.getElementById('world').innerHTML = "";
				dataset = createDataset(brushed); //create dataset to work with datamaps
				createMap(dataset, brushed);
				dataTable(brushed);
			} 
		});

		//sets up the grid w country specs listed
		// var grid = d3.divgrid();
		// d3.select("#grid")
		// 	.datum(data.slice(0,40))
		// 	.call(grid)
		// 	.selectAll(".row")
		// 	.on({
		// 		"mouseover": function(d) { 
		// 			parcoords.highlight([d])},
		// 		"mouseout": parcoords.unhighlight
				
		// 	});
		var list = ["CountryID", "SatisfactionLife", "DemocraticGov", "NationalityPride", "GNI/Capita($K)", "ConfidenceInPress", "WillingnessToFight", "HumanRights", "Trust"];
		function inList(data) {
			for (var i=0; i < list.length; i++) {
				console.log("i", i);
				console.log("lista", list[i]);
				console.log("data", data);
				if(list[i] == data) {
					return true;
				} else {
					return false;
				}
			} 
		}
		function inList1(data) {
			for (var i=0; i < list.length; i++) {
				console.log("i", i);
				console.log("lista", list[i]);
				console.log("data", data);
				if(list[i] == data) {
					return true;
				} else {
					return false;
				}
			} 
		}
		function inList2(data) {
			for (var i=0; i < list.length; i++) {
				console.log("i", i);
				console.log("lista", list[i]);
				console.log("data", data);
				if(list[i] == data) {
					return true;
				} else {
					return false;
				}
			} 
		}

		var dataTable = function dataTable(data) {
			document.getElementById('grid').innerHTML = "";

			var sortAscending = true;
			var table = d3.select('#grid').append('table');
			var titles = d3.keys(data[0]);
			var headers = table.append('thead').append('tr')
				.selectAll('th')
				.data(titles).enter()
				.append('th')
				.text(function (d) {
					if (list.indexOf(d) == -1) {
						return d;
					} 
				})
				.on('click', function (d) {
					headers.attr('class', 'header');
					if (sortAscending) {
						rows.sort(function(a, b) { return b[d] < a[d]; });
						sortAscending = false;
						this.className = 'aes';
					} else {
						rows.sort(function(a, b) { return b[d] > a[d]; });
						sortAscending = true;
						this.className = 'des';
					}
			                	   
					}, 
					{'mouseout': function(d) {
						parcoords.unhighlight();
					}}
				);

			  
			var rows = table.append('tbody').selectAll('tr')
				.data(data).enter()
				.append('tr')
				.on({'mouseover': function(d) {
					parcoords.highlight([d]);
					console.log("d", d.CountryID);
					cID = String(d.CountryID)
					d3.selectAll('.datamaps-subunit.'+ cID)
						.style("fill", "#FFA000");
					},
					'mouseout': function(d) {
						console.log("mouseout", cID);
						parcoords.unhighlight();
						d3.selectAll('.datamaps-subunit.'+cID)
						.style("fill", "#009688");
					}
				});
			rows.selectAll('td')
				.data(function (d) {
					return titles.map(function (k) {
						return { 'value': d[k], 'name': k};
					});
				}).enter()
				.append('td')
				.attr('data-th', function (d) {

					if (list.indexOf(d.name) == -1) {
						return d.name;
					} 
				})
				.text(function (d) {
					if (list.indexOf(d.name) == -1) {
						return d.value;
					} 
				});
		} //end new grid
		dataTable(data);
	} //end chart

	return chart;
}

//updates the chart if different year is selected
function toggleChart(displayName) {

	if (displayName === "1995 - 1999") {
		d3.csv('data/data9599.csv', display);
	} else if (displayName === "2000 - 2004") {
		d3.csv('data/data0004.csv', display);
	} else if (displayName === "2005 - 2009") {
		d3.csv('data/data0509.csv', display);
	} else if (displayName === "2010 - 2014") {
		d3.csv('data/data1014.csv', display);
	} 
}

var newChart = myChart();


function display (error, data) {
	if (error) {
		console.log(error);
	}
	newChart('#vis', data); //calls on new chart to be created
}

//connects the buttons to ind. actions
function setupButtons() {
	d3.select('#butts')
		.selectAll('.btn-primary')
		.on('click', function() {
			d3.selectAll('.btn-primary').classed('active', false);

			var button = d3.select(this);

			button.classed('active', true);

			var buttonId = button.attr('id');

			toggleChart(buttonId);
		});
}

//initalizes code
d3.csv('data/data1014.csv', display);
setupButtons();


