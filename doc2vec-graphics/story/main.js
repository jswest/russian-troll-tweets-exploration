var accountTypeColorRange = [
	"rgb(65,143,204)",
	"rgb(232,66,47)",
	"rgb(102,190,199)",
	"rgb(186,128,195)",
	"rgb(190,199,102)",
	"rgb(199,102,190)",
	"rgb(47,232,66)",
	"rgb(150,150,150)"
];
var accountTypeDomain = [
	"lefttroll",
	"righttroll",
	"newsfeed",
	"hashtaggamer",
	"fearmonger",
	"commercial",
	"nonenglish",
	"unknown"
];
var clusterColorRange = [];
var clusterDomain = ["0", "1", "2", "3", "4", "5", "6", "7"];
clusterDomain.forEach(function(d) {
	var colorScale = d3.scaleLinear().domain([0,3.5,8]).range(["red", "blue", "green"]).interpolate(d3.interpolateRgb)
	clusterColorRange.push(colorScale(+d))
	// clusterColorRange.push(d3.interpolateRgb("rgb(102,190,199)", "rgb(199,102,190)", "rgb(47,232,66)")(
});

d3.json("data.json").then(function(data) {
	var gridCount = 20;
	var padding = {
		top: 1,
		right: 0,
		bottom: 0,
		left: 1
	};

	var buildSizes = function() {
		var sizes = {
			innerWidth: document.getElementById("viz-wrapper").offsetWidth - 20
		};
		sizes.innerHeight = sizes.innerWidth;
		sizes.outerWidth = sizes.innerWidth + padding.left + padding.right;
		sizes.outerHeight = sizes.innerHeight + padding.top + padding.bottom;
		return sizes;
	};

	var buildSvg = function(sizes) {
		return d3
			.select("#viz-wrapper")
			.append("svg")
			.attr("width", sizes.outerWidth)
			.attr("height", sizes.outerHeight)
			.style("background-color", "#ececec");
	};

	var buildGuts = function(svg) {
		return svg
			.append("g")
			.attr("transform", `translate(${padding.left}, ${padding.top})`);
	};

	var buildXScale = function(sizes) {
		return d3
			.scaleLinear()
			.domain([0, gridCount])
			.range([0, sizes.innerWidth]);
	};

	var buildYScale = function(sizes) {
		return d3
			.scaleLinear()
			.domain([0, gridCount])
			.range([0, sizes.innerHeight]);
	};

	var buildGridBackground = function(guts, sizes, xScale, yScale) {
		for (var i = 0; i < gridCount; i++) {
			for (var j = 0; j < gridCount; j++) {
				guts.append("rect")
					.classed("grid-background", true)
					.attr("width", sizes.innerWidth / gridCount - 1)
					.attr("height", sizes.innerWidth / gridCount - 1)
					.attr("x", xScale(i))
					.attr("y", yScale(j))
					.style("fill", "white");
			}
		}
	};

	var sizes = buildSizes();
	var svg = buildSvg(sizes);
	var guts = buildGuts(svg);
	var xScale = buildXScale(sizes);
	var yScale = buildYScale(sizes);
	buildGridBackground(guts, sizes, xScale, yScale);

	var active = 0;
	var gridElements;
	var blockGridElements;
	var activate = function() {
		var instruct = instructions[active];
		var grid = {};
		for (var i = 0; i < gridCount; i++) {
			for (var j = 0; j < gridCount; j++) {
				grid[`${i},${j}`] = {};
				instruct.segments.forEach(function(s) {
					grid[`${i},${j}`][s] = 0;
				});
			}
		}
		if (!gridElements) {
			gridElements = guts
				.selectAll("rect.grid-element")
				.data(Object.keys(grid))
				.enter()
				.append("rect")
				.classed("grid-element", true)
				.attr("width", sizes.innerWidth / gridCount - 1)
				.attr("height", sizes.innerHeight / gridCount - 1)
				.attr("x", function(d) {
					return xScale(d.split(",")[0]);
				})
				.attr("y", function(d) {
					return yScale(d.split(",")[1]);
				})
				.style("fill", "white")
				.style("opacity", 0);
		}
		for (var i = 0; i < data.authors.length; i++) {
			var segment;
			if (instruct.segment_by === "account_types") {
				segment = data.authors[i].account_type.toLowerCase();
			} else if (instruct.segment_by === "clusters") {
				segment = "" + data.clusters[i];
			}
			if (instruct.segments.indexOf(segment) > -1) {
				var point = data.som[i].join(",");
				grid[point][segment]++;
			}
		}
		var blockGrid = {};
		for (var i = 0; i < gridCount; i++) {
			for (var j = 0; j < gridCount; j++) {
				blockGrid[`${i},${j}`] = {};
				instruct.blocks.forEach(function(s) {
					blockGrid[`${i},${j}`][s] = 0;
				});
			}
		}
		for (var i = 0; i < data.authors.length; i++) {
			var block;
			if (instruct.block_by === "account_types") {
				block = data.authors[i].account_type.toLowerCase();
			} else if (instruct.block_by === "clusters") {
				block = "" + data.clusters[i];
			}
			if (instruct.blocks.indexOf(block) > -1) {
				var point = data.som[i].join(",");
				blockGrid[point][block]++;
			}
		}
		var niceBlockGrid = {};
		Object.keys(blockGrid).forEach(function(d) {
			var winnerSegment = false;
			var winnerValue = 0;
			Object.keys(blockGrid[d]).forEach(function(segment) {
				if (winnerValue < blockGrid[d][segment]) {
					winnerSegment = segment;
					winnerValue = blockGrid[d][segment];
				}
			});
			niceBlockGrid[d] = winnerSegment ? winnerSegment : false;
		});
		if (!blockGridElements) {
			blockGridElements = guts
				.selectAll("rect.block-grid-element")
				.data(Object.keys(niceBlockGrid))
				.enter()
				.append("rect")
				.classed("grid-element", true)
				.attr("width", sizes.innerWidth / gridCount - 1)
				.attr("height", sizes.innerHeight / gridCount - 1)
				.attr("x", function(d) {
					return xScale(d.split(",")[0]);
				})
				.attr("y", function(d) {
					return yScale(d.split(",")[1]);
				})
				.style("fill", "white")
				.style("opacity", 0);
		}
		var opacityScale = d3
			.scaleLinear()
			.domain([
				1,
				d3.max(Object.keys(grid), function(d) {
					return Object.values(grid[d]).reduce(function(a, c) {
						return (a += c);
					}, 0);
				})
			])
			.range([0.05, 1]);
		gridElements
			.data(Object.keys(grid))
			.attr("width", sizes.innerWidth / gridCount - 1)
			.attr("height", sizes.innerHeight / gridCount - 1)
			.attr("x", function(d) {
				return xScale(d.split(",")[0]);
			})
			.attr("y", function(d) {
				return yScale(d.split(",")[1]);
			})
			.transition()
			.duration(500)
			.style("fill", function(d) {
				if (instruct.colored_by === "none") {
					return "rgb(100,100,100)";
				} else if (instruct.colored_by === "clusters") {
					return instruct.segments[0]
						? clusterColorRange[
								clusterDomain.indexOf(instruct.segments[0])
						  ]
						: "white";
				} else if (instruct.colored_by === "account_types") {
					return instruct.segments[0]
						? accountTypeColorRange[
								accountTypeDomain.indexOf(instruct.segments[0])
						  ]
						: "white";
				}
			})
			.style("opacity", function(d) {
				var value = grid[d]
					? Object.values(grid[d]).reduce(function(a, c) {
							return (a += c);
					  }, 0)
					: 0;
				return value > 0 ? opacityScale(value) : 0;
			});

		blockGridElements
			.data(Object.keys(niceBlockGrid))
			.attr("width", sizes.innerWidth / gridCount - 1)
			.attr("height", sizes.innerHeight / gridCount - 1)
			.attr("x", function(d) {
				return xScale(d.split(",")[0]);
			})
			.attr("y", function(d) {
				return yScale(d.split(",")[1]);
			})
			.transition()
			.duration(500)
			.style("fill", function(d) {
				if (instruct.block_by === "clusters") {
					return niceBlockGrid[d]
						? clusterColorRange[
								clusterDomain.indexOf(niceBlockGrid[d])
						  ]
						: "white";
				} else {
					return "white";
				}
			})
			.style("opacity", function(d) {
				return niceBlockGrid[d] ? 0.5 : 0;
			});
	};

	activate();
	window.addEventListener("resize", function() {
		svg.remove();
		sizes = buildSizes();
		svg = buildSvg(sizes);
		guts = buildGuts(svg);
		xScale = buildXScale(sizes);
		yScale = buildYScale(sizes);
		buildGridBackground(guts, sizes, xScale, yScale);
		activate();
	});

	document
		.getElementById("text-wrapper")
		.addEventListener("scroll", function(event) {
			var pEls = document.getElementsByTagName("p");
			for (var i = 0; i < pEls.length; i++) {
				var rect = pEls[i].getBoundingClientRect();
				if (
					rect.top < window.innerWidth / 2 &&
					rect.bottom > 0 &&
					rect.top
				) {
					if (i !== active) {
						active = i;
						activate();
					}
				}
			}
		});
});
