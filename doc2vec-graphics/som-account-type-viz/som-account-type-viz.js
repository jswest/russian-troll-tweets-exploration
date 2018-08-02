var validAccountTypeMap = {
	lefttroll: ["rgb(65,143,204)", "Left troll"],
	righttroll: ["rgb(232,66,47)", "Right troll"],
	newsfeed: ["rgb(102,190,199)", "News feed"],
	hashtaggamer: ["rgb(186,128,195)", "Hashtag gamer"]
};
var padding = {
	top: 55,
	right: 0,
	bottom: 10,
	left: 10,
	middle: 10
};
var boxWidth = 300;
var boxHeight = 300;
var width =
	(boxWidth + padding.middle) * Object.keys(validAccountTypeMap).length +
	padding.left +
	padding.right;
var height = boxHeight + padding.top + padding.bottom;
var svg = d3
	.select("#som-account-type-graphic-wrapper")
	.append("svg")
	.attr("width", width)
	.attr("height", height);
svg.append("rect")
	.attr("width", width)
	.attr("height", height)
	.style("fill", "#ececec");
svg.append("text")
	.text(
		"Different types of Russian Twitter trolls talked about different things in the lead-up to the election."
	)
	.style("font-size", 20)
	.style("font-weight", "800")
	.style("font-family", "Montserrat")
	.attr("y", 25)
	.attr("x", padding.left);
	
d3.json("data/data.json").then(function(data) {
	xScale = d3
		.scaleLinear()
		.domain([0, 20])
		.range([0, boxWidth]);
	yScale = d3
		.scaleLinear()
		.domain([20, 0])
		.range([0, boxHeight]);

	Object.keys(validAccountTypeMap).forEach(function(accountType, index) {
		// Find the point with the most entries.
		var grid = {};
		for (var i = 0; i < data.authors.length; i++) {
			var author = data.authors[i];
			if (author.account_type.toLowerCase() === accountType) {
				var point = data.som[i].join(",");
				grid[point] = grid[point] ? grid[point] + 1 : 1;
			}
		}
		var colorScale = d3
			.scaleLinear()
			.domain([-1, d3.max(Object.values(grid))])
			.range(["white", validAccountTypeMap[accountType][0]]);

		var g = svg.append("g").attr("transform", "translate(0,0)");
		svg.append("text")
			.text(validAccountTypeMap[accountType][1].toUpperCase())
			.attr("x", padding.left + (boxWidth + padding.middle) * index)
			.attr("y", 45)
			.style("font-size", 10)
			.style("font-weight", "400")
			.style("font-family", "Montserrat")
			.style("letter-spacing", 1);
		g.append("rect")
			.attr("width", boxWidth)
			.attr("height", boxHeight)
			.style("fill", "#ececec")
			.attr("x", padding.left + (boxWidth + padding.middle) * index)
			.attr("y", padding.top);
		for (var i = 0; i < 20; i++) {
			for (var j = 20; j > 0; j--) {
				g.append("rect")
					.attr("width", boxWidth / 20 - 1)
					.attr("height", boxWidth / 20 - 1)
					.attr(
						"x",
						xScale(i) +
							padding.left +
							index * (boxWidth + padding.middle)
					)
					.attr("y", yScale(j) + padding.top)
					.style("fill", "white");
			}
		}
		g.selectAll("rect.grid")
			.data(Object.keys(grid))
			.enter()
			.append("rect")
			.classed("grid", true)
			.style("stroke", "transparent")
			.attr("width", boxWidth / 20 - 1)
			.attr("height", boxWidth / 20 - 1)
			.attr("x", function(d) {
				return (
					xScale(d.split(",")[0]) +
					padding.left +
					(boxWidth + padding.middle) * index
				);
			})
			.attr("y", function(d) {
				return yScale(d.split(",")[1]) + padding.top;
			})
			.style("fill", function(d) {
				return colorScale(grid[d]);
			});
	});
});
