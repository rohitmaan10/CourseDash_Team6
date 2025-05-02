let satDataLoaded = false;

document.addEventListener('DOMContentLoaded', function () {
    // Fetch majors data immediately
    fetch('https://fargo-api-ts.datausa.io/tesseract/data.jsonrecords?cube=ipeds_completions&drilldowns=Year,Gender,CIP6&include=University:137351;CIP6:510000,420101,260102,513801,260101&locale=en&measures=Completions')
        .then(response => response.json())
        .then(data => {
            displayMajorsData(data.data);
        })
        .catch(error => {
            console.error('Error fetching majors data:', error);
            document.getElementById('majors').innerHTML = '<p>Failed to load majors data. Please try again later.</p>';
        });

    // Setup tabs
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');

            // Remove 'active' class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Add 'active' class to clicked button and its tab content
            button.classList.add('active');
            document.getElementById(tabId).classList.add('active');

            // Lazy-load SAT scores when SAT tab is clicked
            if (tabId === 'sat-scores' && !satDataLoaded) {
                loadSatScores();
                satDataLoaded = true; // Prevent reloading
            }
        });
    });
});

// Display Majors Table
function displayMajorsData(records) {
    const container = document.getElementById('majors');
    container.innerHTML = '';

    const groupedData = {};

    records.forEach(record => {
        const key = `${record['Year']}-${record['CIP6']}`;
        if (!groupedData[key]) {
            groupedData[key] = {
                year: record['Year'],
                cip6: record['CIP6'],
                completions: 0
            };
        }
        groupedData[key].completions += record['Completions'];
    });

    const table = document.createElement('table');
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';

    table.innerHTML = `
        <thead>
            <tr>
                <th style="border: 1px solid white; padding: 8px; color: white;">Year</th>
                <th style="border: 1px solid white; padding: 8px; color: white;">CIP6</th>
                <th style="border: 1px solid white; padding: 8px; color: white;">Total Completions</th>
            </tr>
        </thead>
        <tbody></tbody>
    `;

    const tbody = table.querySelector('tbody');

    Object.values(groupedData).forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td style="border: 1px solid white; padding: 8px; color: white;">${item.year}</td>
            <td style="border: 1px solid white; padding: 8px; color: white;">${item.cip6}</td>
            <td style="border: 1px solid white; padding: 8px; color: white;">${item.completions}</td>
        `;
        tbody.appendChild(row);
    });

    container.appendChild(table);
}

// Load and Display SAT Scores Table
function loadSatScores() {
    const container = document.getElementById('sat-scores');
    container.innerHTML = '<p style="color:white;">Loading SAT scores...</p>';

    fetch('https://fargo-api-ts.datausa.io/tesseract/data.jsonrecords?cube=ipeds_admissions&include=University:137351&drilldowns=Year,University&locale=en&measures=SAT+Math+25th+Percentile%2CSAT+Math+50th+Percentile%2CSAT+Math+75th+Percentile%2CSAT+Writing+25th+Percentile%2CSAT+Writing+75th+Percentile%2CSAT+Critical+Reading+25th+Percentile%2CSAT+Critical+Reading+50th+Percentile%2CSAT+Critical+Reading+75th+Percentile')
        .then(response => response.json())
        .then(data => {
            displaySatData(data.data);
        })
        .catch(error => {
            console.error('Error fetching SAT data:', error);
            container.innerHTML = '<p style="color:white;">Failed to load SAT scores data. Please try again later.</p>';
        });
}

function displaySatData(records) {
    const container = document.getElementById('sat-scores');
    container.innerHTML = '';

    const table = document.createElement('table');
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';

    table.innerHTML = `
        <thead>
            <tr>
                <th style="border: 1px solid white; padding: 8px; color: white;">Year</th>
                <th style="border: 1px solid white; padding: 8px; color: white;">SAT Critical Reading 25th</th>
                <th style="border: 1px solid white; padding: 8px; color: white;">SAT Critical Reading 75th</th>
                <th style="border: 1px solid white; padding: 8px; color: white;">SAT Math 25th</th>
                <th style="border: 1px solid white; padding: 8px; color: white;">SAT Math 75th</th>
                <th style="border: 1px solid white; padding: 8px; color: white;">SAT Writing 25th</th>
                <th style="border: 1px solid white; padding: 8px; color: white;">SAT Writing 75th</th>
            </tr>
        </thead>
        <tbody></tbody>
    `;

    const tbody = table.querySelector('tbody');

    records.forEach(record => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td style="border: 1px solid white; padding: 8px; color: white;">${record['Year']}</td>
            <td style="border: 1px solid white; padding: 8px; color: white;">${record['SAT Critical Reading 25th Percentile'] || 'N/A'}</td>
            <td style="border: 1px solid white; padding: 8px; color: white;">${record['SAT Critical Reading 75th Percentile'] || 'N/A'}</td>
            <td style="border: 1px solid white; padding: 8px; color: white;">${record['SAT Math 25th Percentile'] || 'N/A'}</td>
            <td style="border: 1px solid white; padding: 8px; color: white;">${record['SAT Math 75th Percentile'] || 'N/A'}</td>
            <td style="border: 1px solid white; padding: 8px; color: white;">${record['SAT Writing 25th Percentile'] || 'N/A'}</td>
            <td style="border: 1px solid white; padding: 8px; color: white;">${record['SAT Writing 75th Percentile'] || 'N/A'}</td>
        `;
        tbody.appendChild(row);
    });

    container.appendChild(table);
}

document.querySelectorAll('.tab-button').forEach(button => {
    button.addEventListener('click', function () {
        document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(tab => tab.style.display = 'none');

        this.classList.add('active');
        const tabId = this.getAttribute('data-tab');
        document.getElementById(tabId).style.display = 'block';

        // Optional: Load charts only on first open
        if (tabId === 'charts-tab') {
            if (!window.chartDataLoaded) {
                fetchChartData();  // Function in charts.js
                window.chartDataLoaded = true;
            }
        }
    });
});
