import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API_KEY } from "../core/constant";
import './index.css';
const Details = () => {
  const { name, date } = useParams();
  const [weatherData, setWeatherData] = useState(null);

 useEffect(() => {
   const fetchWeatherData = async() => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${name}&appid=${API_KEY}&units=metric`
      );
     if(!response.ok){
      if(response.status === 404){
        throw new Error("City not found")
      }
      else{
        throw new Error("An unexpected error occurred");
      }      
    }
    const data = await response.json();
   const dailyData = calculateDailySummaries(data, date);
   setWeatherData(dailyData);

    }catch(error){
     console.log(error)
    }
   }
   fetchWeatherData();
 }, [name, date])

   const calculateDailySummaries = (data, date) => {
    let arrayResult = [];
    data.list.forEach((item) => { 
    console.log(item);    
    const searchDate = item.dt_txt.split(' ')[0]; 
    const searchHour = item.dt_txt.split(' ')[1];
    const temperature = item.main.temp;   
    if(searchDate === date){
      arrayResult.push({
        date: date,
        hour: searchHour,
        temp: temperature,
        icon: item.weather[0].icon,
        weather: item.weather[0].main,
        humidity: item.main.humidity,
      })
    }      
    })
    return arrayResult; 
   }

    return (
        <div className="main">
          {weatherData ? weatherData.map((forecast, index) => {
           return (
            <div key={index} className="separateForecast">              
              <h4>{forecast.hour}</h4>
              <p>Temp: {forecast.temp}</p>
              <img src={`https://openweathermap.org/img/wn/${forecast.icon}@2x.png`}  alt='icon' style={{width: "100px"}}/>   
              <p>{forecast.weather}</p>
              <p>Humidity: {forecast.humidity}%</p>
            </div>
           )
          }) : ""}
          {console.log(weatherData)}
        </div>
    )
}
export default Details;