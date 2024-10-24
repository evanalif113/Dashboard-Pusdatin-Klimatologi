// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-analytics.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js"; 
import { getDatabase, ref, get, query, orderByKey, limitToLast } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(); // Initialize Firebase Authentication
const database = getDatabase(app); // Initialize Firebase Realtime Database

// Maximum length for the data array (e.g., 60 data points)
var maxDataLength = 60;

// Initialize empty arrays for storing data
var timestamps = [];
var temperatures = [];
var humidity = [];
var pressure = [];
var dew = [];

// Authenticate and fetch data after successful login
signInWithEmailAndPassword(auth, userEmail, userPassword)
    .then((userCredential) => {
        // Signed in successfully
        console.log("Authenticated successfully");
        fetchLastData();
        setInterval(fetchLastData, 15000); // Fetch new data every 15 seconds
    })
    .catch((error) => {
        console.error("Authentication failed: ", error);
    });

// Function to fetch the last data using Firebase Realtime Database SDK
function fetchLastData() {
    const hour = 1;
    const fetchCount = hour * 60;

    const dataRef = query(ref(database, `auto_weather_stat/id-03/data`), orderByKey(), limitToLast(fetchCount));

    get(dataRef).then((snapshot) => {
        if (snapshot.exists()) {
            const data = snapshot.val();
            Object.values(data).forEach(entry => {
                // Convert timestamp to formatted time
                const timeFormatted = new Date(entry.timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });

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
    }).catch((error) => {
        console.error("Error fetching data: ", error);
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
    const trace = {
        x: timestamps,
        y: temperatures,
        type: 'scatter',
        mode: 'lines+markers',
        name: 'Suhu Lingkungan (°C)',
        line: { color: '#C70039' }
    };

    const layout = {
        title: 'Suhu Lingkungan (°C)',
        xaxis: { title: 'Waktu' },
        yaxis: { title: 'Suhu Lingkungan (°C)' },
        height: 400
    };

    Plotly.newPlot('temperature-chart', [trace], layout);
}

// Function to plot humidity chart
function plotHumidityChart() {
    const trace = {
        x: timestamps,
        y: humidity,
        type: 'scatter',
        mode: 'lines+markers',
        name: 'Kelembapan Relatif (%)',
        line: { color: '006BFF' }
    };

    const layout = {
        title: 'Kelembapan Relatif (%)',
        xaxis: { title: 'Waktu' },
        yaxis: { title: 'Kelembapan Relatif (%)' },
        height: 400
    };

    Plotly.newPlot('humidity-chart', [trace], layout);
}

// Function to plot dew point chart
function plotDewChart() {
    const trace = {
        x: timestamps,
        y: dew,
        type: 'scatter',
        mode: 'lines+markers',
        name: 'Titik Embun (°C)',
        line: { color: '4F75FF' }
    };

    const layout = {
        title: 'Titik Embun (°C)',
        xaxis: { title: 'Waktu' },
        yaxis: { title: 'Titik Embun (°C)' },
        height: 400
    };

    Plotly.newPlot('dew-chart', [trace], layout);
}

// Function to plot pressure chart
function plotPressureChart() {
    const trace = {
        x: timestamps,
        y: pressure,
        type: 'scatter',
        mode: 'lines+markers',
        name: 'Tekanan Udara (hPa)',
        line: { color: '15B392' }
    };

    const layout = {
        title: 'Tekanan Udara (hPa)',
        xaxis: { title: 'Waktu' },
        yaxis: { title: 'Tekanan Udara (hPa)' },
        height: 400
    };

    Plotly.newPlot('pressure-chart', [trace], layout);
}

// Function to update charts dynamically
function updateCharts() {
    const data_update_temp = { 
        x: [timestamps], 
        y: [temperatures] 
    };
    Plotly.update('temperature-chart', data_update_temp);

    const data_update_humid = { 
        x: [timestamps], 
        y: [humidity] 
    };
    Plotly.update('humidity-chart', data_update_humid);

    const data_update_press = { 
        x: [timestamps], 
        y: [pressure] 
    };
    Plotly.update('pressure-chart', data_update_press);

    const data_update_dew = { 
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
});
