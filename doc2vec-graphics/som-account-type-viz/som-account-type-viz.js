var accountTypeColorRange = [
	"rgb(65,143,204)",
	"rgb(232,66,47)",
	"rgb(102,190,199)",
	"rgb(186,128,195)",
	"rgb(190,199,102)"
];
var accountTypeDomain = [
	"lefttroll",
	"righttroll",
	"newsfeed",
	"hashtaggamer",
	"fearmonger"
];
var acountTypeNameRange = [
	"Left trolls",
	"Right trolls",
	"News feeders",
	"Hashtag gamers",
	"Fearmongers"
];

d3.json("data/data.json").then(function(data) {
	var validAccountTypeMap = {
		lefttroll: ["rgb(65,143,204)", "Left trolls"],
		righttroll: ["rgb(232,66,47)", "Right trolls"]
	};

	var gridCount = 20;
	var gridPositionsXCount = 3;
	var gridPositionsYCount = 3;
	var padding = {
		top: 100,
		right: 0,
		bottom: 0,
		left: 20,
		grid: 20
	};
	var sizes = {
		gridElementWidth: 250,
		gridElementHeight: 250
	};
	sizes.width = gridPositionsXCount * (sizes.gridElementWidth + padding.grid);
	sizes.height =
		gridPositionsYCount * (sizes.gridElementHeight + padding.grid);
	sizes.fullWidth = padding.left + sizes.width + padding.right;
	sizes.fullHeight = padding.top + sizes.height + padding.bottom;

	var svg = d3
		.select("#som-account-type-graphic-wrapper")
		.append("svg")
		.attr("width", sizes.fullWidth)
		.attr("height", sizes.fullHeight)
		.style("background-color", "#ececec");

	var title = svg
		.append("text")
		.style("font-size", 20)
		.style("font-weight", "800")
		.style("font-family", "Montserrat")
		.attr("y", 25)
		.attr("x", padding.left);

	title
		.append("tspan")
		.attr("x", padding.left)
		.attr("dy", 0)
		.text(
			"Different kinds of Russian trolls, as represented by their tweets in the run-"
		);

	title
		.append("tspan")
		.attr("x", padding.left)
		.attr("dy", 25)
		.text(
			"up to the 2016 election, laid out so that trolls who post similarly are close"
		);

	title
		.append("tspan")
		.attr("x", padding.left)
		.attr("dy", 25)
		.text("together, and those who post dissimilarly are far apart.");

	var guts = svg
		.append("g")
		.attr("transform", `translate(${padding.left},${padding.top})`);

	var makeGridImage = function(g, gridSize, xScale, yScale) {
		g.append("rect")
			.attr("width", gridSize)
			.attr("height", gridSize)
			.style("fill", "#ececec")
			.attr("x", 0)
			.attr("y", 0);
		for (var i = 0; i < gridCount; i++) {
			for (var j = 0; j < gridCount; j++) {
				g.append("rect")
					.attr("width", gridSize / gridCount - 1)
					.attr("height", gridSize / gridCount - 1)
					.attr("x", xScale(i))
					.attr("y", yScale(j))
					.style("fill", "white");
			}
		}
	};

	var redGrid = {};
	var blueGrid = {};
	for (var i = 0; i < data.authors.length; i++) {
		var author = data.authors[i];
		if (author.account_type.toLowerCase() === "righttroll") {
			var point = data.som[i].join(",");
			redGrid[point] = redGrid[point] ? redGrid[point] + 1 : 1;
		}
		if (author.account_type.toLowerCase() === "lefttroll") {
			var point = data.som[i].join(",");
			blueGrid[point] = blueGrid[point] ? blueGrid[point] + 1 : 1;
		}
	}
	var redOpacityScale = d3
		.scaleLinear()
		.domain([0, d3.max(Object.values(redGrid))])
		.range([0.05, 1]);
	var blueOpacityScale = d3
		.scaleLinear()
		.domain([0, d3.max(Object.values(blueGrid))])
		.range([0.05, 1]);

	var g = guts.append("g").attr("transform", "translate(0,0)");
	var textString =
		'<tspan style="color:rgb(65,143,204)">Left trolls</tspan> and <tspan style="rgb(232,66,47)">Right trolls</tspan>';
	g.append("text")
		.html(textString.toUpperCase())
		.attr("x", 0)
		.attr("y", -5)
		.style("font-size", 10 - 2)
		.style("font-weight", "800")
		.style("font-family", "Montserrat")
		.style("letter-spacing", 1);

	var xScale = d3
		.scaleLinear()
		.domain([0, gridCount])
		.range([0, sizes.gridElementWidth * 2 + padding.grid]);
	var yScale = d3
		.scaleLinear()
		.domain([0, gridCount])
		.range([0, sizes.gridElementHeight * 2 + padding.grid]);

	makeGridImage(g, sizes.gridElementWidth * 2 + padding.grid, xScale, yScale);

	g.selectAll("rect.grid-blue")
		.data(Object.keys(blueGrid))
		.enter()
		.append("rect")
		.classed("grid", true)
		.classed("grid-blue", true)
		.style("stroke", "transparent")
		.attr(
			"width",
			(sizes.gridElementWidth * 2 + padding.grid) / gridCount - 1
		)
		.attr(
			"height",
			(sizes.gridElementHeight * 2 + padding.grid) / gridCount - 1
		)
		.attr("x", function(d) {
			return xScale(d.split(",")[0]);
		})
		.attr("y", function(d) {
			return yScale(d.split(",")[1]);
		})
		.style("fill", function(d) {
			return validAccountTypeMap["lefttroll"][0];
			// return colorScale(blueGrid[d]);
		})
		.style("opacity", function(d) {
			return blueOpacityScale(blueGrid[d]);
		});

	g.selectAll("rect.grid-red")
		.data(Object.keys(redGrid))
		.enter()
		.append("rect")
		.classed("grid", true)
		.classed("grid-red", true)
		.style("stroke", "transparent")
		.attr(
			"width",
			(sizes.gridElementWidth * 2 + padding.grid) / gridCount - 1
		)
		.attr(
			"height",
			(sizes.gridElementHeight * 2 + padding.grid) / gridCount - 1
		)
		.attr("x", function(d) {
			return xScale(d.split(",")[0]);
		})
		.attr("y", function(d) {
			return yScale(d.split(",")[1]);
		})
		.style("fill", function(d) {
			return validAccountTypeMap["righttroll"][0];
			// return colorScale(redGrid[d]);
		})
		.style("opacity", function(d) {
			return redOpacityScale(redGrid[d]);
		});

	var positions = [[2, 0], [2, 1]];
	Object.keys(validAccountTypeMap).forEach(function(accountType, index) {
		var grid = {};
		for (var i = 0; i < data.authors.length; i++) {
			var author = data.authors[i];
			if (author.account_type.toLowerCase() === accountType) {
				var point = data.som[i].join(",");
				grid[point] = grid[point] ? grid[point] + 1 : 1;
			}
		}
		var opacityScale = d3
			.scaleLinear()
			.domain([0, d3.max(Object.values(grid))])
			.range([0.05, 1]);
		var colorScale = d3
			.scaleLinear()
			.domain([0, d3.max(Object.values(grid))])
			.range(["white", validAccountTypeMap[accountType][0]]);
		var gx = positions[index][0] * (sizes.gridElementWidth + padding.grid);
		var gy = positions[index][1] * (sizes.gridElementHeight + padding.grid);
		var g = guts.append("g").attr("transform", `translate(${gx},${gy})`);

		g.append("text")
			.text(validAccountTypeMap[accountType][1].toUpperCase())
			.attr("x", 0)
			.attr("y", -5)
			.style("font-size", 10 - 2)
			.style("font-weight", "800")
			.style("font-family", "Montserrat")
			.style("letter-spacing", 1);

		var xScale = d3
			.scaleLinear()
			.domain([0, gridCount])
			.range([0, sizes.gridElementWidth]);
		var yScale = d3
			.scaleLinear()
			.domain([0, gridCount])
			.range([0, sizes.gridElementHeight]);

		makeGridImage(g, sizes.gridElementWidth, xScale, yScale);

		g.selectAll("rect.grid")
			.data(Object.keys(grid))
			.enter()
			.append("rect")
			.classed("grid", true)
			.style("stroke", "transparent")
			.attr("width", sizes.gridElementWidth / gridCount - 1)
			.attr("height", sizes.gridElementHeight / gridCount - 1)
			.attr("x", function(d) {
				return xScale(d.split(",")[0]);
			})
			.attr("y", function(d) {
				return yScale(d.split(",")[1]);
			})
			.style("fill", function(d) {
				return validAccountTypeMap[accountType][0];
				// return colorScale(grid[d]);
			})
			.style("opacity", function(d) {
				return opacityScale(grid[d]);
			});
	});

	var positions = [[0, 2], [1, 2], [2, 2]];
	var validClusterKeys = {
		"3": [0, "exclusive left trolls"],
		"0": [1, "exclusive right trolls"],
		"1": [2, "mix of left and right"]
	};
	Object.keys(validClusterKeys)
		.sort(function(a, b) {
			return validClusterKeys[a][0] > validClusterKeys[b][0] ? 1 : -1;
		})
		.forEach(function(clusterKey, index) {
			var grid = {};
			for (var i = 0; i < data.clusters.length; i++) {
				var cluster = data.clusters[i];
				if (
					cluster === +clusterKey ||
					(clusterKey === "0" && cluster === 7)
				) {
					var point = data.som[i].join(",");
					grid[point] = grid[point] ? grid[point] + 1 : 1;
				}
			}
			var opacityScale = d3
				.scaleLinear()
				.domain([0, d3.max(Object.values(grid))])
				.range([0.05, 1]);
			var colorScale = d3
				.scaleLinear()
				.domain([0, d3.max(Object.values(grid))]);
			// .range(["white", validAccountTypeMap[accountType][0]]);
			var gx =
				positions[index][0] * (sizes.gridElementWidth + padding.grid);
			var gy =
				positions[index][1] * (sizes.gridElementHeight + padding.grid);
			var g = guts
				.append("g")
				.attr("transform", `translate(${gx},${gy})`);

			// g.append("text")
			// 	.text(validAccountTypeMap[accountType][1].toUpperCase())
			// 	.attr("x", 0)
			// 	.attr("y", -5)
			// 	.style("font-size", 10 - 2)
			// 	.style("font-weight", "800")
			// 	.style("font-family", "Montserrat")
			// 	.style("letter-spacing", 1);

			var xScale = d3
				.scaleLinear()
				.domain([0, gridCount])
				.range([0, sizes.gridElementWidth]);
			var yScale = d3
				.scaleLinear()
				.domain([0, gridCount])
				.range([0, sizes.gridElementHeight]);

			makeGridImage(g, sizes.gridElementWidth, xScale, yScale);

			g.selectAll("rect.grid")
				.data(Object.keys(grid))
				.enter()
				.append("rect")
				.classed("grid", true)
				.style("stroke", "transparent")
				.attr("width", sizes.gridElementWidth / gridCount - 1)
				.attr("height", sizes.gridElementHeight / gridCount - 1)
				.attr("x", function(d) {
					return xScale(d.split(",")[0]);
				})
				.attr("y", function(d) {
					return yScale(d.split(",")[1]);
				})
				.style("fill", function(d) {
					return "black";
					// return validAccountTypeMap[accountType][0];
					// return colorScale(grid[d]);
				})
				.style("opacity", function(d) {
					return 1;
					// return opacityScale(grid[d]);
				});
		});
});
