const { axios } = require("axios");
const HttpError = require("../../models/http-error");

const API_KEY = "AIzaSyDgLmMpKCzveJf1_yuA0fUzzhy0WRChvZA";

function getcoordsforaddress(address) {
  return {
    lat: 40.7484405,
    lng: -73.9878584,
  };
}
/*
async function getcoordsforaddress(address) {
  const response = await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${API_KEY}`
  );

  const data = response.data;

  if (!data || data.status === "ZERO_RESULTS") {
    const error = new Httperror(
      "Could not find location for the specified address.",
      422
    );
    throw error;
  }

  const coordinates = data.results[0].geometry.location;

  return coordinates;
}*/
module.exports = getcoordsforaddress;
