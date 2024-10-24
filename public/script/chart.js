// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-analytics.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const databaseUrl = "https://staklimjerukagung-default-rtdb.asia-southeast1.firebasedatabase.app/";

// ID sensor tetap sebagai id-03
const sensorId = "id-03";

// Maximum length for the data array (e.g., 60 data points)
var maxDataLength = 60;

// Initialize empty arrays for storing data
var timestamps = [];
var temperatures = [];
var humidity = [];
var pressure = [];
var dew = [];

// Function to fetch the last data using jQuery Ajax
function fetchLastData() {
    var hour = 1;
    var fetchCount = hour * 60;
    var dataRef = `${databaseUrl}auto_weather_stat/${sensorId}/data.json?orderBy="$key"&limitToLast=${fetchCount}`;

    $.ajax({
        url: dataRef,
        type: "GET",
        success: function(data) {
            if (data) {
                Object.values(data).forEach(entry => {
                    // Convert timestamp to formatted time
                    var timeFormatted = new Date(entry.timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });

                    // Update arrays with new data (shift array when data exceeds max length)
                    updateDataArray(timestamps, timeFormatted);
                    updateDataArray(temperatures, entry.temperature);
                    updateDataArray(humidity, entry.humidity);
                    updateDataArray(pressure, entry.pressure);
                    updateDataArray(dew, entry.dew);
                });

                // Update charts with the new data
                updateCharts();
            } else {
                console.warn("Tidak ada data yang tersedia.");
            }
        },
        error: function(error) {
            console.error("Error fetching data: ", error);
        }
    });
}

// Function to update data arrays with a maximum length of 60
function updateDataArray(array, newValue) {
    if (array.length >= maxDataLength) {
        array.shift();  // Remove the first element
    }
    array.push(newValue);  // Add the new value at the end
}

// Function to plot temperature chart
function plotTemperatureChart() {
    var trace = {
        x: timestamps,
        y: temperatures,
        type: 'scatter',
        mode: 'lines+markers',
        name: 'Suhu Lingkungan (°C)',
        line: { color: '#C70039' }
    };

    var layout = {
        title: 'Suhu Lingkungan (°C)',
        xaxis: { title: 'Waktu' },
        yaxis: { title: 'Suhu Lingkungan (°C)' },
        height: 400
    };

    Plotly.newPlot('temperature-chart', [trace], layout);
}

// Function to plot humidity chart
function plotHumidityChart() {
    var trace = {
        x: timestamps,
        y: humidity,
        type: 'scatter',
        mode: 'lines+markers',
        name: 'Kelembapan Relatif (%)',
        line: { color: '006BFF' }
    };

    var layout = {
        title: 'Kelembapan Relatif (%)',
        xaxis: { title: 'Waktu' },
        yaxis: { title: 'Kelembapan Relatif (%)' },
        height: 400
    };

    Plotly.newPlot('humidity-chart', [trace], layout);
}

// Function to plot dew point chart
function plotDewChart() {
    var trace = {
        x: timestamps,
        y: dew,
        type: 'scatter',
        mode: 'lines+markers',
        name: 'Titik Embun (°C)',
        line: { color: '4F75FF' }
    };

    var layout = {
        title: 'Titik Embun (°C)',
        xaxis: { title: 'Waktu' },
        yaxis: { title: 'Titik Embun (°C)' },
        height: 400
    };

    Plotly.newPlot('dew-chart', [trace], layout);
}

// Function to plot pressure chart
function plotPressureChart() {
    var trace = {
        x: timestamps,
        y: pressure,
        type: 'scatter',
        mode: 'lines+markers',
        name: 'Tekanan Udara (hPa)',
        line: { color: '15B392' }
    };

    var layout = {
        title: 'Tekanan Udara (hPa)',
        xaxis: { title: 'Waktu' },
        yaxis: { title: 'Tekanan Udara (hPa)' },
        height: 400
    };

    Plotly.newPlot('pressure-chart', [trace], layout);
}

// Function to update charts dynamically
function updateCharts() {
    var data_update_temp = { 
        x: [timestamps], 
        y: [temperatures] 
    };
    Plotly.update('temperature-chart', data_update_temp);

    var data_update_humid = { 
        x: [timestamps], 
        y: [humidity] 
    };
    Plotly.update('humidity-chart', data_update_humid);

    var data_update_press = { 
        x: [timestamps], 
        y: [pressure] 
    };
    Plotly.update('pressure-chart', data_update_press);

    var data_update_dew = { 
        x: [timestamps], 
        y: [dew] 
    };
    Plotly.update('dew-chart', data_update_dew);
}

// Fetch data initially and set intervals for every minute
$(document).ready(function() {
    plotTemperatureChart();
    plotHumidityChart();
    plotPressureChart();
    plotDewChart();

    fetchLastData();
    setInterval(fetchLastData, 30000); // Fetch new data every...
});
