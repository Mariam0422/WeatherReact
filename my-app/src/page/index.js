import { useState } from 'react';
import {Input, Form, Button} from 'antd';
import { API_KEY } from "../core/constant";
import { Link } from 'react-router-dom'; 
import './index.css'

const WeatherComponent = () => {
    const [weatherData, setWeatherData] = useState(null);
    const [city, setCity] = useState(''); 
    const [query, setQuery] = useState('');
    const [error, setError] = useState(null);
     

      const fetchWeatherData = async () => {
               try {
          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
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
          const dailySummaries = calculateDailySummaries(data.list);
          setWeatherData(dailySummaries);
          setError(null)
        } catch (error) {
          console.log('Fetch error:', error);
          setWeatherData("");  
          setError(error.message)        
        }
      };  
   
   
    
    const calculateDailySummaries = (list) => {
       const dailyData = {};
       const currentHour = new Date().getHours();
       
      list.forEach(item => {
        const date = item.dt_txt.split(' ')[0];        
        const hour = +(item.dt_txt.split(' ')[1].split(":")[0]);       
               
        if (!dailyData[date]) {
          dailyData[date] = { tempMax: -Infinity, tempMin: Infinity, weather: [] };
        }     
       
        dailyData[date].weather.push({ icon: item.weather[0].icon, hour });                   
         
        if (item.main.temp > dailyData[date].tempMax) {
          dailyData[date].tempMax = item.main.temp;
        }

        if (item.main.temp < dailyData[date].tempMin) {
          dailyData[date].tempMin = item.main.temp;
        }       
        
      });
      
      Object.keys(dailyData).forEach(date => {
        const weatherForDate = dailyData[date].weather;                
        let closestWeather = weatherForDate[0];       
        for (let i = 1; i < weatherForDate.length; i++) {            
            if (Math.abs(weatherForDate[i].hour - currentHour) < Math.abs(closestWeather.hour - currentHour)) {
                closestWeather = weatherForDate[i];
            }
        }
        dailyData[date].closestWeather = closestWeather.icon;
    });


      return Object.keys(dailyData).map(date => ({
        date: date,  
        maxTemp: dailyData[date].tempMax.toFixed(0),
        minTemp: dailyData[date].tempMin.toFixed(0),
        weather: dailyData[date].closestWeather,      
      }));
    };
    const hadleSearch = () => {
      setQuery(city);
      fetchWeatherData();
    }
    return (
      <div className='page'>
        <h1 style={{color: "rgb(2, 2, 231)"}}>5-Day Weather Forecast</h1>      
        <div>        
          <Form layout='inline'>  
          <Form.Item  label="Enter city name"> 
          <Input style={{width: "200px"}}
          type="text"
          value={city}
          onChange={(e) => {
            setCity(e.target.value)
          }}          
          placeholder="Enter city name"
        />  
          </Form.Item>   
          <Form.Item>
            <Button
            onClick={hadleSearch}
            style={{backgroundColor: "rgb(2, 2, 231)", color:"white"}}          
            >Search</Button>
          </Form.Item>
          </Form>       
        </div>      
        {error && <h4 style={{color: "red"}}>{error}</h4>}
        {query ? <h2>{query.toUpperCase()}</h2> : ""}
        {weatherData ? ( 
           <div className='weather'>            
            {weatherData.map((forecast, index) => (
              <Link to='/details' key={index} style={{textDecoration: "none"}}>
              <div key={index} className='forecast'>
                <h4>Date: {forecast.date}</h4>             
                <img src={`https://openweathermap.org/img/wn/${forecast.weather}@2x.png`}  alt='xfgtgtg' style={{width: "150px"}}/>
                <p>Max Temp: {forecast.maxTemp}°C</p>
                <p>Min Temp: {forecast.minTemp}°C</p>
              </div>
              </Link> 
            ))}
          </div>
          
        ) : ""}
       
      </div>
      
    );
  };
  
  export default WeatherComponent;