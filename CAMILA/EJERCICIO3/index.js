// 3. Crear una app que muestre el clima de Medellín lo más rápido posible. 
// Para esto use dos o tres apis externas para consultar por el clima de Medellín y use Promise.race

async function obtenerClima() {

    const meteo = fetch("https://api.open-meteo.com/v1/forecast?latitude=6.25184&longitude=-75.56359&current_weather=true")
        .then((response) => {
            if (!response.ok) {
                throw new Error("Error en la solicitud a Open-Meteo");
            }
            return response.json();
        })
        .then((data) => {
            const clima = data.current_weather;
            return {
                origen: "Open-Meteo",
                temperatura: clima.temperature,
                descripcion: "Temperatura actual en Open-Meteo",
            };
        });

    const wttr = fetch("https://wttr.in/Medell%C3%ADn?format=j1")
        .then((response) => {
            if (!response.ok) {
                throw new Error("Error en la solicitud a Wttr");
            }
            return response.json();
        })
        .then((data) => {
            const clima = data.current_condition[0];
            return {
                origen: "Wttr",
                temperatura: clima.temp_C,
                descripcion: "Temperatura actual en wttr",
            };
        });

    const weatherapi = fetch("https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=6.25184&lon=-75.56359")
        .then((response) => {
            if (!response.ok) {
                throw new Error("Error en la solicitud a WeatherAPI");
            }
            return response.json();
        })
        .then((data) => {
            const clima = data.properties.timeseries[0].data.instant.details;
            return {
                origen: "WeatherAPI",
                temperatura: clima.air_temperature,
                descripcion: "Temperatura actual en WeatherAPI",
            };
        });

    try {
        const resultado = await Promise.race([meteo, wttr, weatherapi]);
        console.log("Resultado más rápido:", resultado);
    } catch (error) {
        console.error("Error al obtener el clima:", error);
    }

}

obtenerClima();
