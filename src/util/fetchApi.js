const countryCaptalCityApi = (countryId) =>
  `https://api.worldbank.org/v2/country/${countryId}?format=json`;
const weatherApi = (capitalCity) =>
  `https://api.openweathermap.org/data/2.5/weather?q=${capitalCity}&appid=${process.env.REACT_APP_OPENWEATHERMAP_APPID}&units=metric`;

async function fetchCountryCaptalCityApi(targetCountryId) {
  const result = (await fetch(countryCaptalCityApi(targetCountryId))).json();
}
