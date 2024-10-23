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
function fetchLastData() {
    var hour = 3;
    var fetchCount = hour * 60;
    // Query to get the last 60 data entries
    const lastDataQuery = query(dataRef, limitToLast(fetchCount));

    onValue(lastDataQuery, (snapshot) => {
        const data = snapshot.val();
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

            // If we have more than fetchCount entries, slice to keep only the last fetchCount
            if (timestamps.length > fetchCount) {
                const startIndex = timestamps.length - fetchCount;
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

// Function to fetch daily data entries (1440 data points)
function fetchDataHarian() {
    const jumlahData = 1440;  // 1 hari = 1440 data
    const kueriTerakhir = query(dataRef, limitToLast(jumlahData));

    onValue(kueriTerakhir, (snapshot) => {
        const isi = snapshot.val();
        if (isi) {
            var timestamp = [];
            var temperatures = [];
            var dew = [];

            Object.values(isi).forEach(entry => {
                // Mengambil data sesuai struktur di Firebase (pastikan field benar)
                if (entry.timestamp && entry.temperature !== undefined && entry.dew !== undefined) {
                    timestamp.push(new Date(entry.timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }));
                    temperatures.push(entry.temperature);  // Field 'temperature' diambil dari Firebase
                    dew.push(entry.dew);  // Field 'dew' diambil dari Firebase
                }
            });

            // Jika lebih dari jumlahData, potong untuk menyimpan hanya jumlahData terakhir
            if (timestamp.length > jumlahData) {
                const startIndex = timestamp.length - jumlahData;
                timestamp.splice(0, startIndex);
                temperatures.splice(0, startIndex);
                dew.splice(0, startIndex);
            }

            // Panggil fungsi plotting untuk data
            plotTemperatureDewChart(timestamp, temperatures, dew);
        } else {
            console.warn("Tidak ada data yang tersedia.");
        }
    }, (error) => {
        console.error("Error reading data: ", error);
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

// Fetch data initially and update
fetchLastData();
fetchDataHarian();
setInterval(fetchDataHarian, 60000);
setInterval(fetchLastData, 60000);
