import React, { Fragment } from "react";
import logo from "./logo.png";
import "./App.css";
import axios from "axios";

const OPEN_WEATHER_API_KEY = "ef861d8aed0dd94eb27db248a1387c7c";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cityInputValue: "",
      time06: [],
      time09: [],
      time12: [],
      time15: [],
      time18: [],
      time21: [],
      userQueried: false,
    };
  }

  handleChange = (e) => {
    // To enable input to update changes in real time
    let { name, value } = e.target;

    this.setState({
      [name]: value,
    });
  };

  handleSubmit = (event) => {
    if (!this.state.cityInputValue) {
      this.setState({
        userQueried: false,
      });
    }
    event.preventDefault();
    axios
      .get(
        `https://api.openweathermap.org/geo/1.0/direct?q=${this.state.cityInputValue}&limit=1&appid=${OPEN_WEATHER_API_KEY}`
      )
      // City geo data is in response.data[0]
      // Arrow functions with no curly braces return value after arrow
      .then((response) => response.data[0])
      .then((cityGeoData) =>
        axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${cityGeoData.lat}&lon=${cityGeoData.lon}&appid=${OPEN_WEATHER_API_KEY}&units=metric`
        )
      )
      .then((response) => {
        const { data: weatherData } = response;

        this.setState({
          userQueried: true,
          time06: [
            weatherData.list[0].main.temp,
            weatherData.list[0].weather[0].description,
          ],
          time09: [
            weatherData.list[1].main.temp,
            weatherData.list[1].weather[0].description,
          ],
          time12: [
            weatherData.list[2].main.temp,
            weatherData.list[2].weather[0].description,
          ],
          time15: [
            weatherData.list[3].main.temp,
            weatherData.list[3].weather[0].description,
          ],
          time18: [
            weatherData.list[4].main.temp,
            weatherData.list[4].weather[0].description,
          ],
          time21: [
            weatherData.list[5].main.temp,
            weatherData.list[5].weather[0].description,
          ],
        });
      });
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <form onSubmit={this.handleSubmit}>
            <input
              type="text"
              name="cityInputValue"
              value={this.state.cityInputValue}
              onChange={this.handleChange}
              placeholder="Type city to check forecast"
            />
            <button type="input" value="input" name="submit">
              Submit
            </button>
          </form>

          {this.state.userQueried ? (
            <table>
              <thead>
                <Fragment>
                  <tr>
                    {"6am: "}
                    {this.state.time06[0]}°C--{this.state.time06[1]}
                  </tr>
                  <tr>
                    {"9am: "}
                    {this.state.time09[0]}°C--{this.state.time09[1]}
                  </tr>
                  <tr>
                    {"12pm: "}
                    {this.state.time12[0]}°C--{this.state.time12[1]}
                  </tr>
                  <tr>
                    {"3pm: "}
                    {this.state.time15[0]}°C--{this.state.time15[1]}
                  </tr>
                  <tr>
                    {"6pm: "}
                    {this.state.time18[0]}°C--{this.state.time18[1]}
                  </tr>
                  <tr>
                    {"9pm: "}
                    {this.state.time21[0]}°C--{this.state.time21[1]}
                  </tr>
                </Fragment>
              </thead>
            </table>
          ) : null}
        </header>
      </div>
    );
  }
}

export default App;
