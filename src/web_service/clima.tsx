import { useEffect, useState } from "react";
import Menu from "../dashboard/menu";
import imagen from "../assets/weather_svg.svg";

interface WeatherData {
  name: string;
  main: {
    humidity: number;
    temp: number;
    temp_max: number;
    temp_min: number;
  };
  weather: Array<{
    main: string;
    description: string;
  }>;
  wind: {
    speed: number;
  };
}

export default function Clima() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const weather = async () => {
    try {
      const response = await fetch(
        "https://api.openweathermap.org/data/2.5/weather?lat=21.8853&lon=-102.2916&appid=0a45b03d359701e5c9d291b34e9d8f0e"
      );

      if (!response.ok) {
        alert(
          "Ocurrió un error en el webservice OPEN-WEATHER: " + response.status
        );
      } else {
        const data = await response.json();
        console.log(data);
        setWeatherData(data);
      }
    } catch (error) {
      console.error("Error en el WEBSERVICE OPENWEATHER");
    }
  };
  useEffect(() => {
    weather();
  }, []);

  return (
    <div className="bg-gray-900 w-screen h-screen flex flex-col">
      <div className="flex justify-center">
        <Menu />
      </div>
      <div className="flex justify-center">
        <img src={imagen} alt="" style={{ width: "300px", height: "200px" }} />
      </div>
      <div className="flex flex-grow justify-center items-center flex-col">
        <div className="flex flex-col place-content-center text-white bg-slate-950 rounded-md p-2">
          {weatherData ? (
            <div>
              <h1>
                <span className="font-bold">Cuidad: </span>
                {weatherData.name}
              </h1>
              <div>
                <p>
                  <span className="font-bold">Max: </span>
                  {weatherData.main.temp_max}°K
                </p>
                <p>
                  <span className="font-bold">Min: </span>
                  {weatherData.main.temp_min}°K
                </p>
              </div>
              {weatherData.weather.map((w, index) => (
                <div key={index}>
                  <p>
                    <span className="font-bold">Clima: </span>
                    {w.main}
                  </p>
                  <p>
                    <span className="font-bold">Detalles: </span>
                    {w.description}
                  </p>
                </div>
              ))}
              <p>
                <span className="font-bold">Viento a: </span>
                {weatherData.wind.speed} m/h
              </p>
            </div>
          ) : (
            <p>Cargando servicio...</p>
          )}
        </div>
      </div>
    </div>
  );
}
