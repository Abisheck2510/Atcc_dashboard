let vehicleCountChartInstance = null;
let hourlyCountChartInstance = null;
let vehiclePercentageInstance = null;
let doughnutPercentageInstance = null;


async function fetchData(startDateTime, endDateTime) {

    const barChartUrl = new URL('http://localhost:8000/vehicle-count');
    barChartUrl.searchParams.append('start_date_time', startDateTime);
    barChartUrl.searchParams.append('end_date_time', endDateTime);


    const lineChartUrl = new URL('http://localhost:8000/hourly-vehicle-count');
    lineChartUrl.searchParams.append('start_date_time', startDateTime);
    lineChartUrl.searchParams.append('end_date_time', endDateTime);


    const pieChartUrl = new URL('http://localhost:8000/vehicle-percentage');
    pieChartUrl.searchParams.append('start_date_time', startDateTime);
    pieChartUrl.searchParams.append('end_date_time', endDateTime);

    const doughnutChartUrl = new URL('http://localhost:8000/doughnut-percentage');
    doughnutChartUrl.searchParams.append('start_date_time', startDateTime);
    doughnutChartUrl.searchParams.append('end_date_time', endDateTime);

    const [responseBar, responseLine, responsePie, responseDoughnut] = await Promise.all([
        fetch(barChartUrl),
        fetch(lineChartUrl),
        fetch(pieChartUrl),
        fetch(doughnutChartUrl)
    ]);

    if (!responseBar.ok || !responseLine.ok || !responsePie.ok || !responseDoughnut.ok) {
        throw new Error('Error fetching data from one or more sources');
    }

    return {
        barChartData: await responseBar.json(),
        lineChartData: await responseLine.json(),
        pieChartData: await responsePie.json(),
        doughnutChartData: await responseDoughnut.json()
    };
}

function renderCharts(barSummary, lineSummary, pieSummary, dougnutSummary) {
    const barctx = document.getElementById('vehicleCountChart').getContext('2d');
    const linectx = document.getElementById('hourlyCountChart').getContext('2d');
    const piectx = document.getElementById('vehiclePercentageChart').getContext('2d');
    const doughnutctx = document.getElementById('doughnutChart').getContext('2d');

    if (vehicleCountChartInstance) {
        vehicleCountChartInstance.destroy();
    }
    if (hourlyCountChartInstance) {
        hourlyCountChartInstance.destroy();
    }
    if (vehiclePercentageInstance) {
        vehiclePercentageInstance.destroy();
    }
    if (doughnutPercentageInstance) {
        doughnutPercentageInstance.destroy();
    }

    const barlabels = barSummary.map(item => item.vehicle_name);
    const vehicleCounts = barSummary.map(item => item.vehicle_count);

    vehicleCountChartInstance = new Chart(barctx, {
        type: 'bar',
        data: {
            labels: barlabels,
            datasets: [{
                label: 'Vehicle Count by Vehicle name',
                data: vehicleCounts,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: { title: { display: true, text: 'Vehicle Name' } },
                y: { title: { display: true, text: 'Vehicle count' } }
            }
        }
    });


    const linelabels = lineSummary.map(item => {
        const hour = parseInt(item.hour, 10);
        return `${hour}:00`;
    });
    const hourlyCounts = lineSummary.map(item => item.vehicle_count);

    hourlyCountChartInstance = new Chart(linectx, {
        type: 'line',
        data: {
            labels: linelabels,
            datasets: [{
                label: 'Hourly Vehicle Count',
                data: hourlyCounts,
                backgroundColor: 'rgba(16, 44, 63, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    title: { display: true, text: 'Hour' },
                    ticks: {
                        callback: function (value) {
                            return linelabels[value];
                        }
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Vehicle Count'
                    }
                }
            }
        }
    });

    const pielabels = pieSummary.map(item => item.vehicle_name);
    const vehiclePercentage = pieSummary.map(item => item.percentage);

    vehiclePercentageInstance = new Chart(piectx, {
        type: 'pie',
        data: {
            labels: pielabels,
            datasets: [{
                label: 'Vehicle Percentage',
                data: vehiclePercentage,
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
            }],
        },
        options: {
            responsive: true}
    });

    const doughnutlabels = dougnutSummary.map(item => item.vehicle_name);
    const doughnutPercentage = dougnutSummary.map(item => item.percentage);

    doughnutPercentageInstance = new Chart(doughnutctx, {
        type: 'doughnut',
        data: {
            labels: doughnutlabels,
            datasets: [{
                label: 'Vehicle Percentage',
                data: doughnutPercentage,
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
            }],
        },
        options: { responsive: true },
    });


}

document.getElementById("applyfilters").addEventListener('click', async () => {
    const startDateTime = document.getElementById('start-datetime').value;
    const endDateTime = document.getElementById('end-datetime').value;

    if (startDateTime && endDateTime) {
        try {
            const { barChartData, lineChartData, pieChartData, doughnutChartData } = await fetchData(startDateTime, endDateTime);

            console.log('Bar Chart Data:', barChartData);
            console.log('Line Chart Data:', lineChartData);
            console.log('Pie Chart Data:', pieChartData);
            console.log('Doughnut Chart Data:', doughnutChartData);

            if ((barChartData && barChartData.length) ||
                (lineChartData && lineChartData.length) ||
                (pieChartData && pieChartData.length)
                    (doughnutChartData && doughnutChartData.length)) {

                renderCharts(barChartData, lineChartData, pieChartData, doughnutChartData);
            } else {
                alert('No data found for the selected range.');
            }
        } catch (error) {
            alert('Error fetching data: ' + error.message);
        }
    } else {
        alert('Please select both start and end date-time.');
    }
});