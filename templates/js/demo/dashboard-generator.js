// Set new default font family and font color to mimic Bootstrap's default styling
(Chart.defaults.global.defaultFontFamily = "Nunito"),
	'-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = "#858796";

// Area Chart Example

async function updateTop() {
	let response = await fetch("http://localhost:4000/top", {
		method: "GET",
	});
	var data = await response.text();
	return JSON.parse(data);
}

updateTop().then((data) => {
	document.getElementById("last_dtm").innerHTML = data.last_dtm;
	document.getElementById("energy").innerHTML = data.daily_consume.toFixed(2);
	document.getElementById("building_id").innerHTML = data.building_id;
	document.getElementById("anomalies").innerHTML = data.daily_anomalies;

	var pcx = document.getElementById("myPieChart");
	var myPieChart = new Chart(pcx, {
		type: "doughnut",
		data: {
			labels: ["Normal", "Anomalía"],
			datasets: [
				{
					data: [data.count, data.daily_anomalies],
					backgroundColor: ["#1cc88a", "#dc3545"],
					hoverBackgroundColor: ["#17a673", "#ad1d2b"],
					hoverBorderColor: "rgba(234, 236, 244, 1)",
				},
			],
		},
		options: {
			maintainAspectRatio: false,
			tooltips: {
				backgroundColor: "rgb(255,255,255)",
				bodyFontColor: "#858796",
				borderColor: "#dddfeb",
				borderWidth: 1,
				xPadding: 15,
				yPadding: 15,
				displayColors: false,
				caretPadding: 10,
			},
			legend: {
				display: false,
			},
			cutoutPercentage: 80,
		},
	});
});

async function updateChart() {
	let response = await fetch("http://localhost:4000/data", {
		method: "GET",
	});
	var data = await response.text();
	return JSON.parse(data);
}

updateChart().then((data) => {
	var colors_area = [];
	var labels_area = [];
	var values_area = [];

	var labels_bar = [
		"06:00",
		"07:00",
		"08:00",
		"09:00",
		"10:00",
		"11:00",
		"12:00",
		"13:00",
		"14:00",
		"15:00",
		"16:00",
		"17:00",
	];
	var values_bar = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	console.log(data);
	for (point of data) {
		let value = parseFloat(point.value);
		colors_area.push(point.color);
		labels_area.push(point.hour);
		values_area.push(value.toFixed(2));

		let i = parseInt(point.hour.slice(0, 2)) - 6;
		console.log(i);
		if ((i >= 0) & (i < 12)) {
			values_bar[i] = values_bar[i] + value;
		}
	}

	var cax = document.getElementById("myAreaChart");
	var myLineChart = new Chart(cax, {
		type: "line",
		data: {
			labels: labels_area,
			datasets: [
				{
					label: "Consumo",
					lineTension: 0.3,
					backgroundColor: "rgba(78, 115, 223, 0.05)",
					borderColor: "rgba(78, 115, 223, 1)",
					pointRadius: 4,
					pointBackgroundColor: colors_area,
					pointHoverRadius: 3,
					pointHoverBackgroundColor: colors_area,
					pointHoverBorderColor: "rgba(78, 115, 223, 1)",
					pointBorderColor: "rgba(78, 115, 223, 1)",
					pointHitRadius: 10,
					pointBorderWidth: 2,
					data: values_area,
				},
			],
		},
		options: {
			maintainAspectRatio: false,
			layout: {
				padding: {
					left: 10,
					right: 25,
					top: 25,
					bottom: 0,
				},
			},
			scales: {
				xAxes: [
					{
						time: {
							unit: "hora",
						},
						gridLines: {
							display: false,
							drawBorder: false,
						},
						ticks: {
							maxTicksLimit: 7,
						},
					},
				],
				yAxes: [
					{
						ticks: {
							maxTicksLimit: 5,
							padding: 10,
							callback: function (value, index, values_area) {
								return "kWh " + value.toFixed(2);
							},
						},
						gridLines: {
							color: "rgb(234, 236, 244)",
							zeroLineColor: "rgb(234, 236, 244)",
							drawBorder: false,
							borderDash: [2],
							zeroLineBorderDash: [2],
						},
					},
				],
			},
			legend: {
				display: false,
			},
			tooltips: {
				backgroundColor: "rgb(255,255,255)",
				bodyFontColor: "#858796",
				titleMarginBottom: 10,
				titleFontColor: "#6e707e",
				titleFontSize: 14,
				borderColor: "#dddfeb",
				borderWidth: 1,
				xPadding: 15,
				yPadding: 15,
				displayColors: false,
				intersect: false,
				mode: "index",
				caretPadding: 10,
				callbacks: {
					label: function (tooltipItem, chart) {
						var datasetLabel =
							chart.datasets[tooltipItem.datasetIndex].label || "";
						return datasetLabel + ": kWh " + tooltipItem.yLabel.toFixed(2);
					},
				},
			},
		},
	});

	var load_area = document.getElementById("load_area");
	load_area.style.display = "none";

	var cbx = document.getElementById("myBarChart");
	var myBarChart = new Chart(cbx, {
		type: "bar",
		data: {
			labels: labels_bar,
			datasets: [
				{
					label: "Consumo",
					backgroundColor: "#4e73df",
					hoverBackgroundColor: "#2e59d9",
					borderColor: "#4e73df",
					data: values_bar,
				},
			],
		},
		options: {
			maintainAspectRatio: false,
			layout: {
				padding: {
					left: 10,
					right: 25,
					top: 25,
					bottom: 0,
				},
			},
			scales: {
				xAxes: [
					{
						time: {
							unit: "hora",
						},
						gridLines: {
							display: false,
							drawBorder: false,
						},
						ticks: {
							maxTicksLimit: 7,
						},
						maxBarThickness: 25,
					},
				],
				yAxes: [
					{
						ticks: {
							min: 0,
							max: 120,
							maxTicksLimit: 5,
							padding: 10,
							callback: function (value, index, values) {
								return "kWh " + value.toFixed(2);
							},
						},
						gridLines: {
							color: "rgb(234, 236, 244)",
							zeroLineColor: "rgb(234, 236, 244)",
							drawBorder: false,
							borderDash: [2],
							zeroLineBorderDash: [2],
						},
					},
				],
			},
			legend: {
				display: false,
			},
			tooltips: {
				titleMarginBottom: 10,
				titleFontColor: "#6e707e",
				titleFontSize: 14,
				backgroundColor: "rgb(255,255,255)",
				bodyFontColor: "#858796",
				borderColor: "#dddfeb",
				borderWidth: 1,
				xPadding: 15,
				yPadding: 15,
				displayColors: false,
				caretPadding: 10,
				callbacks: {
					label: function (tooltipItem, chart) {
						var datasetLabel =
							chart.datasets[tooltipItem.datasetIndex].label || "";
						return datasetLabel + ": kWh " + tooltipItem.yLabel.toFixed(2);
					},
				},
			},
		},
	});

	var load_bar = document.getElementById("load_bar");
	load_bar.style.display = "none";
});
