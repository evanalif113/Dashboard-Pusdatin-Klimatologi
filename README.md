# Pusat Data Iklim Jerukagung Seismologi

## Overview

<p align="center">
  <img src="./public/Logo.png" alt="Logo" width="150"/>
</p>

Pusat Data Iklim Jerukagung Seismologi is a web application designed to display and analyze climate data from various meteorological stations in Jerukagung. This application integrates data from ThingSpeak for real-time monitoring and Firebase for data management. It provides visualizations and statistical summaries of environmental data.

## Features

- Real-time climate data visualization using ThingSpeak.
- Average calculations of climate data (temperature, humidity, air pressure).
- Dynamic charts and statistics for meteorological research.

## Technologies Used

- **HTML/CSS**: Structure and styling of the web application.
- **JavaScript**: Data handling, charting, and Firebase integration.
- **Bootstrap**: Responsive design framework.
- **Highcharts**: For advanced charting (imported but not used in this version).
- **Firebase**: For real-time database management and analytics.
- **ThingSpeak**: For fetching cloud computing.

## Setup and Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/yourusername/yourrepository.git
   cd yourrepository
   ```

2. **Project Structure**

   - `index.html`: The main HTML file for the application.
   - `style/styleHome.css`: Custom CSS for styling the web page.
   - `script/index.js`: JavaScript file for Firebase integration and other scripts.
   - `script/chart.js`: JavaScript file for charting (if used).

3. **Firebase Configuration**

   Ensure you have a Firebase project and replace the placeholder values in the `firebaseConfig` object in `index.html`:

   ```javascript
   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_AUTH_DOMAIN",
     databaseURL: "YOUR_DATABASE_URL",
     projectId: "YOUR_PROJECT_ID",
     storageBucket: "YOUR_STORAGE_BUCKET",
     messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
     appId: "YOUR_APP_ID",
     measurementId: "YOUR_MEASUREMENT_ID"
   };
   ```

4. **ThingSpeak API Key**

   Replace `YOUR_API_KEY` in the `meanThingspeak` function with your actual ThingSpeak API key:

   ```javascript
   const apiKey = 'YOUR_API_KEY';
   ```

5. **Run the Application**

   Open `index.html` in a web browser to view the application.

## Usage

- **Home Page**: Displays an overview and links to different sections.
- **Stasiun Iklim Jerukagung**: Shows real-time data charts for temperature, humidity, and air pressure.
- **Stasiun Riset Klimatologi Jerukagung**: Displays additional charts and average data calculations.

## Contact

For questions or issues, please contact [Jerukagung Seismologi](mailto:evanalifwidhyatma@gmail.com).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
```

Feel free to adjust the sections and details based on your project's specific requirements and any additional information you might want to include.
