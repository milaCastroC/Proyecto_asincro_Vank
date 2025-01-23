document.getElementById("checkWeather").addEventListener("click", async () => {
    const weatherResult = document.getElementById("weatherResult");
    const errorAlert = document.getElementById("errorAlert");
    const temperature = document.getElementById("temperature");
    const description = document.getElementById("description");
    const checkWeatherButton = document.getElementById("checkWeather");

    weatherResult.classList.add("d-none");
    errorAlert.classList.add("d-none");
    checkWeatherButton.classList.add("d-none");

    try {
        const meteo = fetch("https://api.open-meteo.com/v1/forecast?latitude=6.25184&longitude=-75.56359&current_weather=true")
            .then(response => {
                if (!response.ok) {
                    throw new Error("Error en la solicitud a Open-Meteo");
                }
                return response.json();
            })
            .then(data => ({
                origen: "Open-Meteo",
                temperatura: `${data.current_weather.temperature} °C`,
                descripcion: "Temperatura actual en Open-Meteo"
            }));

        const wttr = fetch("https://wttr.in/Medell%C3%ADn?format=j1")
            .then(response => {
                if (!response.ok) {
                    throw new Error("Error en la solicitud a Open-Meteo");
                }
                return response.json();
            })
            .then(data => ({
                origen: "Wttr",
                temperatura: `${data.current_condition[0].temp_C} °C`,
                descripcion: "Temperatura actual en Wttr"
            }));

        const weatherapi = fetch("https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=6.25184&lon=-75.56359")
            .then(response => {
                if (!response.ok) {
                    throw new Error("Error en la solicitud a Open-Meteo");
                }
                return response.json();
            })
            .then(data => ({
                origen: "WeatherAPI",
                temperatura: `${data.properties.timeseries[0].data.instant.details.air_temperature} °C`,
                descripcion: "Temperatura actual en WeatherAPI"
            }));

        const resultado = await Promise.race([meteo, wttr, weatherapi]);
        
        const temp = parseFloat(resultado.temperatura); // Convertir temperatura a número
        if (temp > 30) {
            weatherIcon.src = "/assets/icons/sunny.png"; // Ícono para clima cálido
            weatherIcon.alt = "Clima cálido";
        } else if (temp > 20) {
            weatherIcon.src = "/assets/icons/partly-cloudy.png"; // Ícono para clima templado
            weatherIcon.alt = "Clima templado";
        } else {
            weatherIcon.src = "/assets/icons/cold.png"; // Ícono para clima frío
            weatherIcon.alt = "Clima frío";
        }
        temperature.textContent = `${resultado.temperatura}`;
        description.textContent = resultado.descripcion;
        weatherResult.classList.remove("d-none");
        

    } catch (error) {
        console.error("Error obteniendo el clima:", error);
        errorAlert.classList.remove("d-none");
    }
});

// async function obtenerClima() {

//     const meteo = fetch("https://api.open-meteo.com/v1/forecast?latitude=6.25184&longitude=-75.56359&current_weather=true")
//         .then((response) => {
//             if (!response.ok) {
//                 throw new Error("Error en la solicitud a Open-Meteo");
//             }
//             return response.json();
//         })
//         .then((data) => {
//             const clima = data.current_weather;
//             return {
//                 origen: "Open-Meteo",
//                 temperatura: clima.temperature,
//                 descripcion: "Temperatura actual en Open-Meteo",
//             };
//         });

//     const wttr = fetch("https://wttr.in/Medell%C3%ADn?format=j1")
//         .then((response) => {
//             if (!response.ok) {
//                 throw new Error("Error en la solicitud a Wttr");
//             }
//             return response.json();
//         })
//         .then((data) => {
//             const clima = data.current_condition[0];
//             return {
//                 origen: "Wttr",
//                 temperatura: clima.temp_C,
//                 descripcion: "Temperatura actual en wttr",
//             };
//         });

//     const weatherapi = fetch("https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=6.25184&lon=-75.56359")
//         .then((response) => {
//             if (!response.ok) {
//                 throw new Error("Error en la solicitud a WeatherAPI");
//             }
//             return response.json();
//         })
//         .then((data) => {
//             const clima = data.properties.timeseries[0].data.instant.details;
//             return {
//                 origen: "WeatherAPI",
//                 temperatura: clima.air_temperature,
//                 descripcion: "Temperatura actual en WeatherAPI",
//             };
//         });

//     try {
//         const resultado = await Promise.race([meteo, wttr, weatherapi]);
//         console.log("Resultado más rápido:", resultado);
//     } catch (error) {
//         console.error("Error al obtener el clima:", error);
//     }

// }

// obtenerClima();
