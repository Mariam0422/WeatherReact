import { useEffect, useState } from 'react';
import {Input, Form, Button} from 'antd';
import { API_KEY } from "../core/constant";
import { Link } from 'react-router-dom';   
import './index.css'

const WeatherComponent = () => {
    const [weatherData, setWeatherData] = useState(null);
    const [city, setCity] = useState(''); 
    const [query, setQuery] = useState('');
    const [error, setError] = useState(null);
    const [currentLocation, setcurrentLocation] = useState(null);

  
  useEffect(() => {
   const getLocation =  () => {
   navigator.geolocation.getCurrentPosition( async(position) => {
    const lat = (position.coords.latitude).toFixed(2);
    const lon = (position.coords.longitude).toFixed(2);
    try{
      const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const geolocationData = await response.json();    
        const dailySummaries = calculateDailySummaries(geolocationData.list, geolocationData);   
        dailySummaries.forEach((item) => setQuery(item.name));       
        setError(null)
        setcurrentLocation(dailySummaries);       
      } catch (error) {
        console.log('Fetch error:', error);
        setcurrentLocation(null);  
        setError(error.message)        
      } 
   })
   }
   getLocation();
  }, [])

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
          console.log(data)
          const dailySummaries = calculateDailySummaries(data.list, data);           
          setWeatherData(dailySummaries);          
          setError(null); 
        } catch (error) {          
          setWeatherData(null);  
          setError(error.message);
          setcurrentLocation(null);
          setQuery("");      
        }
      };  
   

    
    const calculateDailySummaries = (list, data) => {     
       const dailyData = {};
       const currentHour = new Date().getHours();
       
      list.forEach(item => {        
        const date = item.dt_txt.split(' ')[0];        
        const hour = +(item.dt_txt.split(' ')[1].split(":")[0]);       
               
        if (!dailyData[date]) {
          dailyData[date] = {name: data.city.name, tempMax: -Infinity, tempMin: Infinity, weather: [] };
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
        name: dailyData[date].name,     
        date: date,  
        maxTemp: dailyData[date].tempMax.toFixed(0),
        minTemp: dailyData[date].tempMin.toFixed(0),
        weather: dailyData[date].closestWeather,      
      }));
  
    };
    const handleSearch = () => {
      setQuery(city);
      fetchWeatherData();
    }


    return (
      <div className='page'>
            
        <div>        
          <Form layout='inline'>  
          <Form.Item > 
          <Input style={{backgroundColor: "#dadada93", width: "950px"}}
          type="text"
          value={city}
          onChange={(e) => {
            setCity(e.target.value)
          }}    
          onKeyDown={(e) => {
            if(e.key === 'Enter'){
              handleSearch();
            }
          }}      
          placeholder="Enter city name"
        />  
          </Form.Item>   
          <Form.Item>
            <Button
            onClick={handleSearch}
            style={{backgroundColor: "#dadada93"}}>Search</Button>
          </Form.Item>
          </Form>       
        </div>      
        {error && <h4 style={{color: "red"}}>{error}</h4>}
        <h3>5 Day Weather Forecast</h3> 
        {query ? <h1>{query.toUpperCase()}</h1> : ""}
        {weatherData ? ( 
           <div className='weather'>            
            {weatherData.map((forecast, index) => (                         
              <Link to={`/details/${forecast.name}/${forecast.date}`} key={index} style={{textDecoration: "none"}}>
              <div key={index} className='forecast'>
                { console.log(forecast, "forecast")  }
                <h3> {forecast.date}</h3>             
                <img src={`https://openweathermap.org/img/wn/${forecast.weather}@2x.png`}  alt='icon' style={{width: "150px"}}/>
                <p>Max Temp: {forecast.maxTemp}°C</p>
                <p>Min Temp: {forecast.minTemp}°C</p>
              </div>             
              </Link> 
            ))}
          </div>
          
        ) : currentLocation ? (
           <div className='weather'>
             {currentLocation.map((forecast, index) => (                                                   
              <Link to={`/details/${forecast.name}/${forecast.date}`} key={index} style={{textDecoration: "none"}}>
              <div key={index} className='forecast'>
                { console.log(forecast, "forecast")  }
                <h3> {forecast.date}</h3>             
                <img src={`https://openweathermap.org/img/wn/${forecast.weather}@2x.png`}  alt='icon' style={{width: "150px"}}/>
                <p>Max Temp: {forecast.maxTemp}°C</p>
                <p>Min Temp: {forecast.minTemp}°C</p>
              </div>             
              </Link>               
            ))}
               
           </div>
        ) : "Loading..."}     
         
      </div>
      
    );
  };
  
  export default WeatherComponent;