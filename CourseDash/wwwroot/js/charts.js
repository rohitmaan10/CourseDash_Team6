let barChart, pieChart;
let completionData = [];

document.addEventListener('DOMContentLoaded', function () {
    const yearFilter = document.getElementById('yearFilter');
    const chartsTab = document.getElementById('charts-tab');

    // When the tab is clicked, load data (if not already loaded)
    document.querySelector('[data-tab="charts-tab"]').addEventListener('click', () => {
        if (!completionData.length) {
            fetchData();
        }
    });

    yearFilter.addEventListener('change', () => {
        const selectedYear = parseInt(yearFilter.value);
        updateCharts(selectedYear);
    });
});

function fetchData() {
    fetch('https://fargo-api-ts.datausa.io/tesseract/data.jsonrecords?cube=ipeds_completions&drilldowns=Year,Gender,CIP6&include=University:137351;CIP6:510000,420101,260102,513801,260101&locale=en&measures=Completions')
        .then(response => response.json())
        .then(data => {
            completionData = data.data;
            const years = [...new Set(completionData.map(item => item.Year))].sort();
            populateYearFilter(years);
            updateCharts(years[0]); // show charts for first year by default
        })
        .catch(error => {
            console.error('Error loading chart data:', error);
        });
}

function populateYearFilter(years) {
    const yearFilter = document.getElementById('yearFilter');
    yearFilter.innerHTML = '';
    years.forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearFilter.appendChild(option);
    });
}

function updateCharts(year) {
    const filtered = completionData.filter(item => item.Year === year);

    // Bar Chart data: Total completions by CIP6
    const barLabels = [];
    const barValues = [];

    const colorPalette = ['#e6194b','#3cb44b','#ffe119','#4363d8','#f58231','#911eb4','#46f0f0','#f032e6','#bcf60c'];

    const cipMap = {};

    filtered.forEach(item => {
        const cip = item['CIP6'];
        if (!cipMap[cip]) cipMap[cip] = 0;
        cipMap[cip] += item['Completions'];
    });

    for (const [cip, count] of Object.entries(cipMap)) {
        barLabels.push(cip);
        barValues.push(count);
    }

    // Pie Chart data: Gender distribution for "General Health Services" (CIP6 = 510000)
    const genderData = filtered.filter(item => item['CIP6 ID'] === 510000);
    const genderMap = { Men: 0, Women: 0 };
    genderData.forEach(item => {
        genderMap[item.Gender] += item['Completions'];
    });

    const pieLabels = Object.keys(genderMap);
    const pieValues = Object.values(genderMap);

    renderBarChart(barLabels, barValues, colorPalette);
    renderPieChart(pieLabels, pieValues);
}

function renderBarChart(labels, data, colors) {
    if (barChart) barChart.destroy();
    const ctx = document.getElementById('barChart').getContext('2d');
    barChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Total Completions',
                data: data,
                backgroundColor: colors,
            }]
        },
        options: {
            plugins: {
                legend: { labels: { color: 'white' } }
            },
            scales: {
                x: { ticks: { color: 'white' } },
                y: { ticks: { color: 'white' }, beginAtZero: true }
            }
        }
    });
}

function renderPieChart(labels, data) {
    if (pieChart) pieChart.destroy();
    const ctx = document.getElementById('pieChart').getContext('2d');
    pieChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: ['#36a2eb', '#ff6384']
            }]
        },
        options: {
            plugins: {
                legend: {
                    labels: {
                        color: 'white'
                    }
                }
            }
        }
    });
}

let satLineChartInstance;
let allSatData = [];

function loadSATLineChart() {
    fetch('https://fargo-api-ts.datausa.io/tesseract/data.jsonrecords?cube=ipeds_admissions&include=University:137351&drilldowns=Year,University&locale=en&measures=SAT+Math+25th+Percentile%2CSAT+Critical+Reading+25th+Percentile')
        .then(response => response.json())
        .then(data => {
            const records = data.data;

            const sorted = records.sort((a, b) => a.Year - b.Year);
            const years = sorted.map(record => record.Year);
            const reading25 = sorted.map(record => record["SAT Critical Reading 25th Percentile"]);
            const math25 = sorted.map(record => record["SAT Math 25th Percentile"]);

            const ctx = document.getElementById('satLineChart').getContext('2d');

            if (satLineChartInstance) satLineChartInstance.destroy();

            satLineChartInstance = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: years,
                    datasets: [
                        {
                            label: 'Reading 25th %ile',
                            data: reading25,
                            borderColor: 'rgb(227, 89, 9)',
                            backgroundColor: 'rgba(255, 99, 132, 0.2)',
                            fill: false,
                            tension: 0.1
                        },
                        {
                            label: 'Math 25th %ile',
                            data: math25,
                            borderColor: 'rgb(60, 187, 10)',
                            backgroundColor: 'rgba(54, 162, 235, 0.2)',
                            fill: false,
                            tension: 0.1
                        }
                    ]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: { labels: { color: 'white' } },
                        title: {
                            display: true,
                            text: 'SAT 25th Percentile Scores Over Years',
                            color: 'white',
                            font: { size: 16 }
                        }
                    },
                    scales: {
                        x: {
                            ticks: { color: 'white' },
                            title: { display: true, text: 'Year', color: 'white' }
                        },
                        y: {
                            ticks: { color: 'white' },
                            title: { display: true, text: 'Score', color: 'white' }
                        }
                    }
                }
            });
        })
        .catch(error => {
            console.error("Error loading SAT line chart:", error);
        });
}
function loadSATData() {
    fetch('https://fargo-api-ts.datausa.io/tesseract/data.jsonrecords?cube=ipeds_admissions&include=University:137351&drilldowns=Year,University&locale=en&measures=SAT+Math+25th+Percentile%2CSAT+Critical+Reading+25th+Percentile')
        .then(response => response.json())
        .then(data => {
            allSatData = data.data;
            // Initially load the SAT line chart with all data
            loadSATLineChart();
        })
        .catch(error => {
            console.error("Error loading SAT data:", error);
        });
}

// Call the loadSATData when the page is ready
loadSATData();