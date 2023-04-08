import React, { useState } from "react";
// <a href="https://www.freepik.com/free-vector/gradients-weather-icons-apps_15292633.htm#query=weather%20icons&position=1&from_view=keyword&track=ais">Image by coolvector</a> on Freepik

function App() {
  const [data, setData] = useState({});
  const [city, setCity] = useState("");
  const [nextDay, setDays] = useState("");

  const API_KEY = "269a19af455747d7834210605230704";
  const API_URL = "http://api.weatherapi.com/v1";
  //! Get Current Location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        fetch(
          `${API_URL}/forecast.json?key=${API_KEY}&q=${latitude},${longitude}&days=6&lang=ar`
        )
          .then((response) => response.json())
          .then((data) => {
            setData(data);
          })
          .catch((error) => console.error(error));
      });
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  };
  const handleInputChange = (event) => {
    setCity(event.target.value);
  };
  //! Search for city information
  const handleSubmit = (event) => {
    event.preventDefault();
    fetch(`${API_URL}/forecast.json?key=${API_KEY}&q=${city}&days=6&lang=ar`)
      .then((response) => response.json())
      .then((data) => {
        setData(data);
      })
      .catch((error) => console.error(error));
  };
  //!================================================================
  // console.log(data.forecast);
  function getCurrentDayInArabic() {
    const dayOfWeek = [
      "الأحد",
      "الإثنين",
      "الثلاثاء",
      "الأربعاء",
      "الخميس",
      "الجمعة",
      "السبت",
    ];
    const today = new Date();
    const currentDayIndex = today.getDay();
    return dayOfWeek[currentDayIndex];
  }

  //!================================================================

  return (
    <div className="App">
      <h1>Weather-App</h1>
      <div className="current">
        <button type="button" className="current" onClick={getCurrentLocation}>
          Get Current Location
        </button>
      </div>
      <p>or</p>
      <form onSubmit={handleSubmit}>
        <input type="text" value={city} onChange={handleInputChange} />
        <button type="submit">Search</button>
      </form>
      <div className="box">
        <div className="name">{data.location?.name}</div>
        <div className="name day">{getCurrentDayInArabic()}</div>
        <div className="status">
          {data.current?.condition?.text}
          <img
            src={`http:${data.current?.condition?.icon}`}
            alt={data.current?.condition?.text}
          />
        </div>
        <div className="temp">
          <div className="min-temp">
            min {data.forecast?.forecastday[0]?.day?.mintemp_c} °C
          </div>
          <div className="max-temp">
            max {data.forecast?.forecastday[0]?.day?.maxtemp_c} °C
          </div>
        </div>
        <div className="wind">
          <div className="speed">{data.current?.wind_kph} km/h</div>
          <div className="direction">{data.current?.wind_dir}</div>
        </div>
      </div>
      <div className="next-days">
        {data.forecast?.forecastday.map((day, index) => {
          const epochDate = day.date_epoch;
          const date = new Date(epochDate * 1000); // convert epoch seconds to milliseconds
          const dayOfWeek = [
            "الأحد",
            "الإثنين",
            "الثلاثاء",
            "الأربعاء",
            "الخميس",
            "الجمعة",
            "السبت",
          ][date.getDay()];
          return (
            <div key={index} className="day-box">
              <div className="name">{dayOfWeek}</div>
              <div className="status">
                {day.day.condition.text}
                <img
                  src={`http:${day.day.condition.icon}`}
                  alt={day.day.condition.text}
                />
              </div>
              <div className="temp">
                <div className="min-temp">min {day.day.mintemp_c} °C</div>
                <div className="max-temp">max {day.day.maxtemp_c} °C</div>
              </div>
              <div className="wind">
                <div className="speed">{day.day.maxwind_kph} km/h</div>
                <div className="direction">{day.day.wind_dir}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
