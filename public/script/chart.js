// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-analytics.js";
import { getDatabase, ref, query, limitToLast, onValue } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);

// Reference to the data in Firebase Realtime Database
const dataRef = ref(database, 'auto_weather_stat/id-03/data');

// Function to fetch the last 60 data entries
function fetchLast60Data() {
    // Query to get the last 60 data entries
    const last60DataQuery = query(dataRef, limitToLast(60));

    onValue(last60DataQuery, (snapshot) => {
        const data = snapshot.val();
        if (data) {
            const timestamps = [];
            const temperatures = [];
            const humidity = [];
            const pressure = [];
            const dew = [];

            Object.values(data).forEach(entry => {
                timestamps.push(new Date(entry.timestamp * 1000).toLocaleTimeString());
                temperatures.push(entry.temperature);
                humidity.push(entry.humidity);
                pressure.push(entry.pressure);
                dew.push(entry.dew);
            });

            // If we have more than 60 entries, slice to keep only the last 60
            if (timestamps.length > 60) {
                const startIndex = timestamps.length - 60;
                timestamps.splice(0, startIndex);
                temperatures.splice(0, startIndex);
                humidity.splice(0, startIndex);
                pressure.splice(0, startIndex);
                dew.splice(0, startIndex);
            }

            plotTemperatureChart(timestamps, temperatures);
            plotHumidityChart(timestamps, humidity);
            plotPressureChart(timestamps, pressure);
            plotDewChart(timestamps, dew);
        }
    }, (error) => {
        console.error("Error reading data: ", error);
    });
}

// Function to plot temperature chart
function plotTemperatureChart(timestamps, temperatures) {
    const trace = {
        x: timestamps,
        y: temperatures,
        type: 'scatter',
        mode: 'lines+markers',
        name: 'Suhu Lingkungan (°C)',
        line: { color: '#C70039' }
    };

    const data = [trace];

    const layout = {
        title: 'Suhu Lingkungan (°C)',
        xaxis: { title: 'Waktu' },
        yaxis: { title: 'Suhu Lingkungan (°C)' },
        height: 400
    };

    Plotly.newPlot('temperature-chart', data, layout);
}

// Function to plot humidity chart
function plotHumidityChart(timestamps, humidity) {
    const trace = {
        x: timestamps,
        y: humidity,
        type: 'scatter',
        mode: 'lines+markers',
        name: 'Kelembapan Relatif (%)',
        line: { color: '006BFF' }
    };

    const data = [trace];

    const layout = {
        title: 'Kelembapan Relatif (%)',
        xaxis: { title: 'Time' },
        yaxis: { title: 'Kelembapan Relatif (%)' },
        height: 400
    };

    Plotly.newPlot('humidity-chart', data, layout);
}

// Function to plot humidity chart
function plotDewChart(timestamps, dew) {
    const trace = {
        x: timestamps,
        y: dew,
        type: 'scatter',
        mode: 'lines+markers',
        name: 'Titik Embun (°C)',
        line: { color: '4F75FF' }
    };

    const data = [trace];

    const layout = {
        title: 'Titik Embun (°C)',
        xaxis: { title: 'Time' },
        yaxis: { title: 'Titik Embun (°C)' },
        height: 400
    };

    Plotly.newPlot('dew-chart', data, layout);
}

// Function to plot pressure chart
function plotPressureChart(timestamps, pressure) {
    const trace = {
        x: timestamps,
        y: pressure,
        type: 'scatter',
        mode: 'lines+markers',
        name: 'Tekanan Udara (hPa)',
        line: { color: '15B392' }
    };

    const data = [trace];

    const layout = {
        title: 'Tekanan Udara (hPa)',
        xaxis: { title: 'Time' },
        yaxis: { title: 'Tekanan Udara (hPa)' },
        height: 400
    };

    Plotly.newPlot('pressure-chart', data, layout);
}

// Fetch data initially and update every 15 seconds
fetchLast60Data();
setInterval(fetchLast60Data, 15000);
