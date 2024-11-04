import app from './config.js';  // Impor app dari fireconfig.js
import { getDatabase, ref, query, orderByKey, limitToLast, get } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";

// Inisialisasi Realtime Database
const database = getDatabase(app);

// Ambil data dari Firebase dan tampilkan di tabel
function loadWeatherData() {
    const tableBody = document.getElementById("datalogger");
    tableBody.innerHTML = ""; // Kosongkan tabel sebelum mengisi data

    // Ambil data terakhir dari database
    const dataRef = query(ref(database, 'auto_weather_stat/id-03/data'), orderByKey(), limitToLast(15));
    
    get(dataRef).then((snapshot) => {
        if (snapshot.exists()) {
            const dataArray = [];

            // Simpan data ke dalam array
            snapshot.forEach((childSnapshot) => {
                const data = childSnapshot.val();
                const timeFormatted = new Date(data.timestamp * 1000)
                                        .toLocaleTimeString([], { 
                                            hour: '2-digit', 
                                            minute: '2-digit', 
                                            second: '2-digit', 
                                            hour12: false 
                                        });
                dataArray.push({
                    date: timeFormatted,
                    temperature: data.temperature,
                    humidity: data.humidity,
                    pressure: data.pressure,
                    dew: data.dew,
                    volt: data.volt
                });
            });

            // Balik array agar data terbaru di atas
            dataArray.reverse();

            // Tambahkan data ke tabel
            dataArray.forEach(entry => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${entry.date}</td>
                    <td>${entry.temperature}</td>
                    <td>${entry.humidity}</td>
                    <td>${entry.pressure}</td>
                    <td>${entry.dew}</td>
                    <td>${entry.volt}</td>
                `;
                tableBody.appendChild(row);
            });
        } else {
            console.warn("Tidak ada data yang tersedia.");
        }
    }).catch((error) => {
        console.error("Error fetching data: ", error);
    });
}

// Muat data saat halaman siap
document.addEventListener('DOMContentLoaded', () => {
    loadWeatherData(); // Panggil pertama kali saat halaman dimuat
    // Perbarui data setiap 1 menit (60000 milidetik)
    setInterval(loadWeatherData, 60000);
});
