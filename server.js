const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post('/', function(req, res) {

  /* openweathermap Endpoint */
  const query = req.body.cityName;
  const apiKey = "2fae43311d006afcde91ba2ab480a9d7";
  const unit = "metric";
  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey + "&units=" + unit;

  /* Request thru Native https API */
  https.get(url, function(response) {
    console.log(response.statusCode);

    /* Fetching data */
    response.on("data", function(data) {
      const weatherData = JSON.parse(data);
      const temp = weatherData.main.temp;
      const desc = weatherData.weather[0].description;
      const icon = weatherData.weather[0].icon;
      const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";

      res.write('<head><meta charset="utf-8"></head>');
      res.write("<h3>The weather is currently " + desc + ".</h3>");
      res.write("<h1>The temperature in " + query + " is " + temp + " degrees Celcius.</h1>");
      res.write("<img src=" + imageURL + ">");
      res.send();
    });
  });
})

app.listen(3000, function() {
  console.log("Listening on port 3000");
});
