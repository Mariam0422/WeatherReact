import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { API_KEY } from "../core/constant";
const Details = () => {
  const { name, date } = useParams();
  
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
    calculateDailySummaries(data, date)
    }catch(error){
     console.log(error)
    }
   }
   fetchWeatherData();
 }, [name, date])

   const calculateDailySummaries = (data, date) => {
    const arrayResult = [];
    data.list.forEach((item) => {
      console.log(item)
    const searchDate = item.dt_txt.split(' ')[0]; 
    const searchHour = item.dt_txt.split(' ')[1];
    const temperachure = item.main.temp;   
    if(searchDate === date){
      arrayResult.push({[searchHour]: temperachure})
    }    
  
    })
    console.log(arrayResult);
   
   }



    return (
        <div>
          Details
        </div>
    )
}
export default Details;