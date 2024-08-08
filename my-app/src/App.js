import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider,} from 'react-router-dom';
import './App.css';
import WeatherComponent from './page';
import Details from './details';





const App = () => {

  const route = createBrowserRouter(
    createRoutesFromElements(
      <>
      <Route path='/' element={<WeatherComponent/>}/>
      <Route path='details' element={<Details/>}/>
      </>
    )
  )

  return (
    <div className="App">     
       <RouterProvider router={route}/> 
    </div>
  );
}

export default App;
