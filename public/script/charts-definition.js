import app from './config.js';  // Impor app dari fireconfig.js
import { getDatabase, ref, query, orderByKey, limitToLast, get } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

// Inisialisasi Realtime Database
const database = getDatabase(app);
const sensorId = "id-03";
var maxDataLength = 60;

var timestamps = [];
var temperatures = [];
var humidity = [];
var pressure = [];
var dew = [];
var volt = [];

function fetchLastData() {
    var hour = 1;
    var fetchCount = hour * 60;
    var dataRef = query(ref(database, `auto_weather_stat/${sensorId}/data`), orderByKey(), limitToLast(fetchCount));

    get(dataRef).then((snapshot) => {
        if (snapshot.exists()) {
            const data = snapshot.val();
            Object.values(data).forEach(entry => {
                var timeFormatted = new Date(entry.timestamp * 1000)
                                    .toLocaleTimeString([], { 
                                        hour: '2-digit', 
                                        minute: '2-digit', 
                                        second: '2-digit', 
                                        hour12: false 
                                    });

                updateDataArray(timestamps, timeFormatted);
                updateDataArray(temperatures, entry.temperature);
                updateDataArray(humidity, entry.humidity);
                updateDataArray(pressure, entry.pressure);
                updateDataArray(dew, entry.dew);
                updateDataArray(volt, entry.volt);
            });

            updateCharts();
        } else {
            console.warn("Tidak ada data yang tersedia.");
        }
    }).catch((error) => {
        console.error("Error fetching data: ", error);
    });
}

function updateDataArray(array, newValue) {
    if (array.length >= maxDataLength) {
        array.shift();
    }
    array.push(newValue);
}

function plotTemperatureChart() {
    var chartDom = document.getElementById('temperature-chart');
    var myChart = echarts.init(chartDom);
    var option = {
        title: { text: 'Suhu Lingkungan (°C)' },
        xAxis: { type: 'category', data: timestamps },
        yAxis: { type: 'value', name: 'Suhu Lingkungan (°C)' },
        series: [{
            data: temperatures,
            type: 'line',
            smooth: true,
            areaStyle: {},
            lineStyle: { color: '#C70039' }
        }]
    };
    myChart.setOption(option);
}

function plotHumidityChart() {
    var chartDom = document.getElementById('humidity-chart');
    var myChart = echarts.init(chartDom);
    var option = {
        title: { text: 'Kelembapan Relatif (%)' },
        xAxis: { type: 'category', data: timestamps },
        yAxis: { type: 'value', name: 'Kelembapan Relatif (%)' },
        series: [{
            data: humidity,
            type: 'line',
            smooth: true,
            areaStyle: {},
            lineStyle: { color: '#006BFF' }
        }]
    };
    myChart.setOption(option);
}

function plotDewChart() {
    var chartDom = document.getElementById('dew-chart');
    var myChart = echarts.init(chartDom);
    var option = {
        title: { text: 'Titik Embun (°C)' },
        xAxis: { type: 'category', data: timestamps },
        yAxis: { type: 'value', name: 'Titik Embun (°C)' },
        series: [{
            data: dew,
            type: 'line',
            smooth: true,
            areaStyle: {},
            lineStyle: { color: '#4F75FF' }
        }]
    };
    myChart.setOption(option);
}

function plotPressureChart() {
    var chartDom = document.getElementById('pressure-chart');
    var myChart = echarts.init(chartDom);
    var option = {
        title: { text: 'Tekanan Udara (hPa)' },
        xAxis: { type: 'category', data: timestamps },
        yAxis: { type: 'value', name: 'Tekanan Udara (hPa)' },
        series: [{
            data: pressure,
            type: 'line',
            smooth: true,
            areaStyle: {},
            lineStyle: { color: '#15B392' }
        }]
    };
    myChart.setOption(option);
}

function plotVoltChart() {
    var chartDom = document.getElementById('volt-chart');
    var myChart = echarts.init(chartDom);
    var option = {
        title: { text: 'Tegangan (V)' },
        xAxis: { type: 'category', data: timestamps },
        yAxis: { type: 'value', name: 'Tegangan (V)' },
        series: [{
            data: volt,
            type: 'line',
            smooth: true,
            areaStyle: {},
            lineStyle: { color: '#FFC300' }
        }]
    };
    myChart.setOption(option);
}

function plotTempHumiScatter() {
    var chartDom = document.getElementById('scatter-chart');
    var myChart = echarts.init(chartDom);
    var option = {
        title: { text: 'Scatter Suhu dan Kelembapan' },
        xAxis: { name: 'Kelembapan' },
        yAxis: { name: 'Suhu' },
        series: [{
            symbolSize: 10,
            data: temperatures.map((temp, idx) => [humidity[idx], temp]),
            type: 'scatter'
        }]
    };
    myChart.setOption(option);
}

function plotStacked() {
    var chartDom = document.getElementById('stacked-chart');
    var myChart = echarts.init(chartDom);
    var option = {
        title: { text: 'Scatter Suhu dan Titik Embun' },
        xAxis: { type: 'category', data: timestamps },
        yAxis: { name: 'Suhu' },
        series: [
            { name: 'Suhu', type: 'line', data: temperatures, lineStyle: { color: '#FF6347' } },
            { name: 'Titik Embun', type: 'line', data: dew, lineStyle: { color: '#4682B4' } }
        ]
    };
    myChart.setOption(option);
}

function updateCharts() {
    plotTemperatureChart();
    plotHumidityChart();
    plotDewChart();
    plotPressureChart();
    plotVoltChart();
    plotTempHumiScatter();
    plotStacked();
}

$(document).ready(function() {
    plotTemperatureChart();
    plotHumidityChart();
    plotPressureChart();
    plotDewChart();
    plotVoltChart();
    plotTempHumiScatter();
    plotStacked();

    fetchLastData();
    setInterval(fetchLastData, 30000); // Fetch new data every 30 seconds
});
