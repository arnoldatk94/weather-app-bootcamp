import React, { Fragment } from "react";
import logo from "./logo.png";
import "./App.css";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "bootstrap/dist/css/bootstrap.min.css";
import { Form, Button, Container, Row, Col } from "react-bootstrap";

const OPEN_WEATHER_API_KEY = "ef861d8aed0dd94eb27db248a1387c7c";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cityInputValue: "",
      userQueried: false,
      extractedForecast: [],
      currDesc: "",
      currCity: "",
      currTemp: 0,
    };
  }

  handleChange = (e) => {
    // To enable input to update changes in real time
    let { name, value } = e.target;

    this.setState({
      [name]: value,
    });
  };

  reducer = (acc, cur) => {
    return { ...acc, [cur.id]: cur };
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
        console.log(weatherData);
        let tempArray = [];
        for (let i = 0; i < weatherData.list.length; i += 8) {
          tempArray.push({
            date: weatherData.list[i].dt_txt.split(" ")[0],
            high: weatherData.list[i].main.temp_max,
            low: weatherData.list[i].main.temp_min,
            weather: weatherData.list[i].weather[0].description,
          });
        }

        this.setState({
          extractedForecast: tempArray,
          userQueried: true,
          currDesc: weatherData.list[0].weather[0].description,
          currCity: weatherData.city.name,
          currTemp: weatherData.list[0].main.temp,
        });
      });
  };

  render() {
    let forecastDisplay = [...this.state.extractedForecast];
    console.log(forecastDisplay);
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />

          <Form onSubmit={this.handleSubmit}>
            <Form.Group>
              <Form.Control
                type="text"
                name="cityInputValue"
                value={this.state.cityInputValue}
                placeholder="Enter city e.g. Singapore"
                onChange={this.handleChange}
              />
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form.Group>
          </Form>

          <Fragment>
            <div id="chart">
              {this.state.userQueried ? (
                <>
                  <h3>Country: {this.state.currCity}</h3>
                  <h3>Current Temperature: {this.state.currTemp}°C</h3>
                  <h3>Current Weather: {this.state.currDesc}</h3>
                  <h6>Temperature for the next 5 days</h6>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      width={500}
                      height={300}
                      data={forecastDisplay}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="2 2" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="high"
                        stroke="#fc0303"
                        activeDot={{ r: 8 }}
                      />
                      <Line type="monotone" dataKey="low" stroke="#03e8fc" />
                    </LineChart>
                  </ResponsiveContainer>
                </>
              ) : null}
            </div>
          </Fragment>
        </header>
      </div>
    );
  }
}

export default App;
