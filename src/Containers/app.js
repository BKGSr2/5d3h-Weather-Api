import "../styles.css";
import axios from "axios";
import { useState } from "react";
import { Display } from "../Presentational/Display.js";
import moment from "moment";
import momentTimezone from "moment-timezone";

export default function App() {
  const [forecast, setForecast] = useState({
    list: [
      {
        //forecast.list[0].main.temp
        main: {
          temp: "N/A"
        },
        weather: [
          {
            main: "N/A" //will return unknown because of weatherMojify function
          }
        ],
        dt_txt: "N/A"
      }
    ],
    city: {
      name: "Mclean",
      country: "US",
      timezone: 0
    },
    weatherType: "N/A",
    locationDate: "N/A"
  });
  const [userInput, setUserInput] = useState({
    lat: 38.9339,
    lon: -77.1773,
    hours: 60,
    listTime: 0,
    displayTime: "0 days and 0 hours",
    rangeValue: 0,
    rangeDisabled: true
  });

  const regulateTime = ({ target }) => {
    let hours = target.value;
    let days = Math.floor(hours / 24);
    setUserInput((prevInput) => {
      return {
        ...prevInput,
        rangeValue: target.value,
        hours,
        listTime: hours / 3,
        displayTime: `${days} days and ${hours - days * 24} hours`
      };
    });
    forecasting(forecast, hours / 3); //a-ha! timestamped 10:32 jun 29! done. //and again 12:48 PM. Fixed.
  };

  const weatherMojify = (data, lTime) => {
    let weatherType;

    switch (data.list[lTime].weather[0].main) {
      case "Clouds":
        weatherType = "Clouds☁";
        break;
      case "Rain":
        weatherType = "Rain🌧️";
        break;
      case "Snow":
        weatherType = "Snow🌨️";
        break;
      case "Extreme":
        weatherType = "Extreme🔴";
        break;
      case "Clear":
        weatherType = "Clear 〇";
        break;
      default:
        weatherType = "Unknown ¯_(ツ)_/¯";
        break;
    }
    return weatherType;
  };

  const utcToLocation = (data, lTime) => {
    if (data.city.timezone) {
      let convertedOffset = data.city.timezone / 3600;
      //let dtPlusOffset=(`${forecast.list[userInput.listTime].dt_txt}${convertedOffset}`)
      let finalDate = moment
        .utc(data.list[lTime].dt_txt)
        .utcOffset(convertedOffset);
      console.log(`\n\nmoment was offset by ${convertedOffset}`);
      console.log(`timeset submitted: ${finalDate}`);
      return finalDate;
    }
    return "none";
  };

  const forecasting = (data, lTime = userInput.listTime) => {
    //lTime is here so that regulateTime has the ability to directly pipe values to forecasting.
    //lets me reduce clutter a bit (?) and also call this in both getData() and regulateTime() to ensure that weatherType updates when changes are made.
    let weatherType = weatherMojify(data, lTime);
    let locationDate = utcToLocation(data, lTime);
    setForecast({
      ...data,
      weatherType,
      locationDate
    });
  };

  const getData = () => {
    if (!userInput.lat || !userInput.lon) {
      alert("Error! Please fill out the form fields before submitting.");
      return;
    }
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${userInput.lat}&lon=${userInput.lon}&appid=53c0da2672903e735d3f77d032dac7a6&units=imperial`
      )
      .then((response) => {
        setUserInput({
          ...userInput,
          rangeDisabled: false
        });
        console.log("api responded");
        forecasting(response.data);
        console.log("forecast set");
        console.log(response.data);
        console.log("confirmed successful response!");
      })
      .catch((error) => {
        console.log({ ...error });
      });
  };

  const updateUserInput = ({ target }) => {
    setUserInput({
      ...userInput,
      [target.name]: target.value
    });
  };

  return (
    <div className="App">
      <Display
        userLat={userInput.lat} //for first initialization
        userLon={userInput.lon} //same
        onSubmit={getData}
        onChange={updateUserInput}
        regulateTime={regulateTime}
        location={`${forecast.city.name || "none"}, ${
          forecast.city.country || "none"
        }`} //if submit is pressed and both lat and lon's initial values are exhausted, this will set the values to none anyway.
        temperature={`${forecast.list[userInput.listTime].main.temp}° F`}
        timeValue={userInput.displayTime}
        dateTime={`${forecast.locationDate}`}
        rangeDisabled={userInput.rangeDisabled}
        weatherMoji={forecast.weatherType}
        rangeValue={userInput.rangeValue}
      />
    </div>
  );
}
