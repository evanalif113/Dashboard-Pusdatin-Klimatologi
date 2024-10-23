// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-analytics.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const databaseUrl = "https://staklimjerukagung-default-rtdb.asia-southeast1.firebasedatabase.app/";

// ID sensor tetap sebagai id-03
const sensorId = "id-03";

// Function to fetch the last data using jQuery Ajax
function fetchLastData() {
    var hour = 3;
    var fetchCount = hour * 60;
    var dataRef = `${databaseUrl}auto_weather_stat/${sensorId}/data.json?orderBy="$key"&limitToLast=${fetchCount}`;

    $.ajax({
        url: dataRef,
        type: "GET",
        success: function(data) {
            if (data) {
                var timestamps = [];
                var temperatures = [];
                var humidity = [];
                var pressure = [];
                var dew = [];

                Object.values(data).forEach(entry => {
                    timestamps.push(new Date(entry.timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }));
                    temperatures.push(entry.temperature);
                    humidity.push(entry.humidity);
                    pressure.push(entry.pressure);
                    dew.push(entry.dew);
                });

                plotTemperatureChart(timestamps, temperatures);
                plotHumidityChart(timestamps, humidity);
                plotPressureChart(timestamps, pressure);
                plotDewChart(timestamps, dew);
            } else {
                console.warn("Tidak ada data yang tersedia.");
            }
        },
        error: function(error) {
            console.error("Error fetching data: ", error);
        }
    });
}
// Function to plot temperature chart
function plotTemperatureChart(timestamps, temperatures) {
    var trace = {
        x: timestamps,
        y: temperatures,
        type: 'scatter',
        mode: 'lines+markers',
        name: 'Suhu Lingkungan (°C)',
        line: { color: '#C70039' }
    };

    var data = [trace];

    var layout = {
        title: 'Suhu Lingkungan (°C)',
        xaxis: { title: 'Waktu' },
        yaxis: { title: 'Suhu Lingkungan (°C)' },
        height: 400
    };

    Plotly.newPlot('temperature-chart', data, layout);
}

// Function to plot humidity chart
function plotHumidityChart(timestamps, humidity) {
    var trace = {
        x: timestamps,
        y: humidity,
        type: 'scatter',
        mode: 'lines+markers',
        name: 'Kelembapan Relatif (%)',
        line: { color: '006BFF' }
    };

    var data = [trace];

    var layout = {
        title: 'Kelembapan Relatif (%)',
        xaxis: { title: 'Waktu' },
        yaxis: { title: 'Kelembapan Relatif (%)' },
        height: 400
    };

    Plotly.newPlot('humidity-chart', data, layout);
}

// Function to plot humidity chart
function plotDewChart(timestamps, dew) {
    var trace = {
        x: timestamps,
        y: dew,
        type: 'scatter',
        mode: 'lines+markers',
        name: 'Titik Embun (°C)',
        line: { color: '4F75FF' }
    };

    var data = [trace];

    var layout = {
        title: 'Titik Embun (°C)',
        xaxis: { title: 'Waktu' },
        yaxis: { title: 'Titik Embun (°C)' },
        height: 400
    };

    Plotly.newPlot('dew-chart', data, layout);
}

// Function to plot pressure chart
function plotPressureChart(timestamps, pressure) {
    var trace = {
        x: timestamps,
        y: pressure,
        type: 'scatter',
        mode: 'lines+markers',
        name: 'Tekanan Udara (hPa)',
        line: { color: '15B392' }
    };

    var data = [trace];

    var layout = {
        title: 'Tekanan Udara (hPa)',
        xaxis: { title: 'Waktu' },
        yaxis: { title: 'Tekanan Udara (hPa)' },
        height: 400
    };

    Plotly.newPlot('pressure-chart', data, layout);
}

// Function to fetch daily data (1440 entries) using jQuery Ajax
function fetchDataHarian() {
    const jumlahData = 1440;  // 1 hari = 1440 data
    var dataRef = `${databaseUrl}auto_weather_stat/${sensorId}/data.json?orderBy="$key"&limitToLast=${jumlahData}`;

    $.ajax({
        url: dataRef,
        type: "GET",
        success: function(data) {
            if (data) {
                var timestamp = [];
                var temperatures = [];
                var dew = [];

                Object.values(data).forEach(entry => {
                    if (entry.timestamp && entry.temperature !== undefined && entry.dew !== undefined) {
                        timestamp.push(new Date(entry.timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }));
                        temperatures.push(entry.temperature);
                        dew.push(entry.dew);
                    }
                });

                plotTemperatureDewChart(timestamp, temperatures, dew);
            } else {
                console.warn("Tidak ada data yang tersedia.");
            }
        },
        error: function(error) {
            console.error("Error fetching data: ", error);
        }
    });
}
// Function to plot temperature and dew point chart with slider
function plotTemperatureDewChart(timestamp, temperatures, dew) {
    var traceT = {
        type: "scatter",
        mode: "lines",
        name: 'Suhu Lingkungan (°C)',
        x: timestamp,  // Menggunakan timestamp sebagai sumbu X
        y: temperatures,
        line: { color: '#C70039' }
    };

    var traceD = {
        type: "scatter",
        mode: "lines",
        name: 'Titik Embun (°C)',
        x: timestamp,  // Menggunakan timestamp sebagai sumbu X
        y: dew,
        line: { color: '#4F75FF' }
    };

    var data = [traceT, traceD];

    var layout = {
        title: 'Suhu dan Titik Embun',
        xaxis: {
            title: 'Waktu',
            autorange: true,
            range: [timestamp[0], timestamp[timestamp.length - 1]],  // Mengatur range awal dan akhir dari timestamp
            rangeselector: {
                buttons: [
                    {
                        count: 15,
                        label: '15m',
                        step: 'minute',
                        stepmode: 'backward'
                    },
                    {
                        count: 30,
                        label: '30m',
                        step: 'minute',
                        stepmode: 'backward'
                    },
                    { step: 'all' }
                ]},
            rangeslider: { visible: true }  // Menampilkan range slider
        },
        yaxis: {
            title: 'Perbandingan Suhu (°C)',
            type: 'linear'
        }
    };

    // Menggambar grafik ke elemen dengan ID 'timeseries-chart'
    Plotly.newPlot('timeseries-chart', data, layout);
}

// Fetch data initially and set intervals for every minute
$(document).ready(function() {
    fetchLastData();
    fetchDataHarian();
    setInterval(fetchDataHarian, 60000);
    setInterval(fetchLastData, 15000); 
});
