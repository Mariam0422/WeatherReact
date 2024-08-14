// import { API_KEY } from "../core/constant";

// const fetchCurrentWeatherData = async (city) => {
//     let data = null;
//     try {
//     const response = await fetch(
//       `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
//     );
//    if(!response.ok){
//     if(response.status === 404){
//       throw new Error("City not found")
//     }
//     else{
//       throw new Error("An unexpected error occurred");
//     }
//     }
//      data = await response.json();    
//     console.log(data, "fetchCurrentWeatherData");

//   } catch (error) {          
//        console.log(error)  
//   }
//   const currentWeatherData = {
//     name: data.name,
//     temp: data.main.temp,
//     humidity: data.main.humidity,
//     weather: data.weather[0].main,
//     icon: data.weather[0].icon
// }
// return currentWeatherData
// }; 


// export default fetchCurrentWeatherData;