let clickButton = document.getElementById("button-data");
let fileInput = document.getElementById("file-data");

fileInput.addEventListener("change", function () {
	if (fileInput.files.length == 0) {
		clickButton.disabled = true;
		document.getElementById("info_block").style.display = "none";
		document.getElementById("chart_block").style.display = "none";
	} else {
		clickButton.disabled = false;
	}
});

async function load_data() {
	let file = fileInput.files[0];
	let formData = new FormData();

	document.getElementById("info_block").style.display = "flex";
	document.getElementById("chart_block").style.display = "flex";

	formData.append("file", file);
	let response = await fetch("http://localhost:4000/file", {
		method: "POST",
		body: formData,
	});
	var data = await response.text();
	var json = JSON.parse(data);

	document.getElementById("start_dtm").innerHTML = json.first_dtm;
	document.getElementById("end_dtm").innerHTML = json.last_dtm;
	document.getElementById("consume").innerHTML = json.consume.toFixed(2);
	document.getElementById("anomaly").innerHTML = json.daily_anomalies;

	hours = [];
	values = [];
	colors = [];

	for (point of json.data) {
		colors.push(point.color);
		hours.push(point.hour);
		values.push(point.value.toFixed(2));
	}

	console.log(hours);
	console.log(colors);
	console.log(values);

	var cax = document.getElementById("area_chart");
	var myLineChart = new Chart(cax, {
		type: "line",
		data: {
			labels: hours,
			datasets: [
				{
					label: "Consumo",
					lineTension: 0.3,
					backgroundColor: "rgba(78, 115, 223, 0.05)",
					borderColor: "rgba(78, 115, 223, 1)",
					pointRadius: 4,
					pointBackgroundColor: colors,
					pointHoverRadius: 3,
					pointHoverBackgroundColor: colors,
					pointHoverBorderColor: "rgba(78, 115, 223, 1)",
					pointBorderColor: "rgba(78, 115, 223, 1)",
					pointHitRadius: 10,
					pointBorderWidth: 2,
					data: values,
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

	myLineChart.update();
	document.getElementById("load_area").style.display = "none";
}
