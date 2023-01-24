import { ChangeEvent, useEffect, useState } from "react";
import { optionType, forecastType } from "../types/";
const useForecast = () => {
  const [term, setTerm] = useState<string>("");
  // city
  const [city, setCity] = useState<optionType | null>(null);
  const [options, setOptions] = useState<[]>([]);
  //
  const [forecast, setForecast] = useState<forecastType | null>(null);
  // fetch data
  const getSearchOptions = (value: string) => {
    fetch(
      ` http://api.openweathermap.org/geo/1.0/direct?q=${value.trim()}&limit=5&appid=${
        process.env.REACT_APP_API_KEY
      }`
    )
      .then((res) => res.json())
      .then((data) => setOptions(data))
      .catch((err) => console.log(err));
  };

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    setTerm(value);
    if (value === "") return;
    getSearchOptions(value);
  };
  const getForecast = (city: optionType) => {
    // fetch
    fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${city.lat}&lon=${city.lon}&units=metric&appid=${process.env.REACT_APP_API_KEY}`
    )
      .then((res) => res.json())
      .then((data) => {
        const forecastData = {
          ...data.city,
          list: data.list.slice(0, 16),
        };
        setForecast(forecastData);
      })
      .catch((err) => console.log(err));
  };
  // button
  const onSubmit = () => {
    if (!city) return;

    getForecast(city);
  };
  // Option Select
  const onOptionSelect = (option: optionType) => {
    // save city
    setCity(option);
    console.log(option.name);
  };
  // use effect
  useEffect(() => {
    if (city) {
      setTerm(city.name);
      setOptions([]);
    }
  }, [city]);
  return {
    term,
    options,
    forecast,
    onInputChange,
    onSubmit,
    onOptionSelect,
  };
};
export default useForecast;
