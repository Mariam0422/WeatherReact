import { useState, useEffect } from 'react';
import {Input, Form} from 'antd';
import { API_KEY } from "../core/constant";
import './index.css'

const WeatherComponent = () => {
    const [weatherData, setWeatherData] = useState(null);
    const [city, setCity] = useState('Yerevan'); 
  
    useEffect(() => {
      const fetchWeatherData = async () => {
               try {
          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
          );
         
          const data = await response.json();     
          console.log(data)     
          const dailySummaries = calculateDailySummaries(data.list);
          setWeatherData(dailySummaries);
        } catch (error) {
          console.error('Fetch error:', error);
        }
      };  
      fetchWeatherData();
    }, [city]);
    
    const calculateDailySummaries = (list) => {
       const dailyData = {};
  
      list.forEach(item => {
        const date = item.dt_txt.split(' ')[0];        
        const hour = item.dt_txt.split(' ')[1].split(":")[0];         
        
       
        if (!dailyData[date]) {
          dailyData[date] = { tempSum: 0, tempMax: -Infinity, tempMin: Infinity, weather: {} };
        }
        if(hour === "15" || hour === "06"){
          dailyData[date].weather = item.weather[0].icon;   
        }              
         
        if (item.main.temp > dailyData[date].tempMax) {
          dailyData[date].tempMax = item.main.temp;
        }
        if (item.main.temp < dailyData[date].tempMin) {
          dailyData[date].tempMin = item.main.temp;
        }       
        
      });
    
      return Object.keys(dailyData).map(date => ({
        date,   
        maxTemp: dailyData[date].tempMax.toFixed(0),
        minTemp: dailyData[date].tempMin.toFixed(0),
        weather: dailyData[date].weather,        
      }));
    };

    return (
      <div className='page'>
        <h1 style={{color: "rgb(2, 2, 231)"}}>5-Day Weather Forecast</h1>
        <div >        
          <Form>  
          <Form.Item  label="Input city name"> 
          <Input style={{width: "200px"}}
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city name"
        />  
          </Form.Item>   
          </Form>       
        </div>
        
        {weatherData ? (         
          <div className='weather'>
            {weatherData.map((forecast, index) => (
              <div key={index} className='forecast'>
                <h4>Date: {forecast.date}</h4>             
                <img src={`https://openweathermap.org/img/wn/${forecast.weather}@2x.png`}  alt='xfgtgtg' style={{width: "150px"}}/>
                <p>Max Temp: {forecast.maxTemp}°C</p>
                <p>Min Temp: {forecast.minTemp}°C</p>
              </div>
            ))}
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    );
  };
  
  export default WeatherComponent;