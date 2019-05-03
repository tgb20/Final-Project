import { Component, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  city: string;
  country: string;
  owmPreds: any[] = [];
  ourPred: any[] = [];
  historyPreds: any[] = [];
  forecastPreds: any[] = [];

  visitedDays: any[] = [];

  spinner1: boolean;
  spinner2: boolean;

  @ViewChild('radarCanvas') radarCanvas;
  @ViewChild('dateTime') dateTime;
  radarChart: any;

  constructor(private http: HttpClient) {
    this.spinner1 = false;
    this.spinner2 = false;
  }

  ngOnInit() {
    this.getRealTimeData();

    this.radarChart = new Chart(this.radarCanvas.nativeElement, {

      type: 'bar',
      data: {
        labels: ["2013", "2014", "2015", "2016", "2017", "2018"],
        datasets: [{
          label: 'Clear',
          data: [685, 3445, 3274, 3726, 3429, 3098],
          backgroundColor: [
            'rgba(255,206,0, 1)',
            'rgba(255,206,0, 1)',
            'rgba(255,206,0, 1)',
            'rgba(255,206,0, 1)',
            'rgba(255,206,0, 1)',
            'rgba(255,206,0, 1)'
          ]
        },
        {
          label: 'Clouds',
          data: [2825, 2707, 2409, 2587, 2314, 2555],
          backgroundColor: [
            'rgba(152,154,162, 1)',
            'rgba(152,154,162, 1)',
            'rgba(152,154,162, 1)',
            'rgba(152,154,162, 1)',
            'rgba(152,154,162, 1)',
            'rgba(152,154,162, 1)'
          ]
        },
        {
          label: 'Snow',
          data: [188, 60, 514, 232, 314, 357],
          backgroundColor: [
            'rgba(112,209,232, 1)',
            'rgba(112,209,232, 1)',
            'rgba(112,209,232, 1)',
            'rgba(112,209,232, 1)',
            'rgba(112,209,232, 1)',
            'rgba(112,209,232, 1)'
          ]
        },
        {
          label: 'Rain',
          data: [2055, 2546, 2553, 2240, 2660, 2708],
          backgroundColor: [
            'rgba(56,128,255, 1)',
            'rgba(56,128,255, 1)',
            'rgba(56,128,255, 1)',
            'rgba(56,128,255, 1)',
            'rgba(56,128,255, 1)',
            'rgba(56,128,255, 1)'
          ]
        },
        {
          label: 'Thunderstorm',
          data: [19, 14, 22, 11, 54, 54],
          backgroundColor: [
            'rgba(245,61,61, 1)',
            'rgba(245,61,61, 1)',
            'rgba(245,61,61, 1)',
            'rgba(245,61,61, 1)',
            'rgba(245,61,61, 1)',
            'rgba(245,61,61, 1)'
          ]
        }]
      }

    });
  }

  slideOpts = {
    effect: 'flip'
  };

  openOpenWeatherMap() {
    var win = window.open("https://openweathermap.org", '_blank');
    win.focus();
  }

  openGithub() {
    var win = window.open("https://github.com/tgb20/Final-Project", '_blank');
    win.focus();
  }

  openRawJSON() {
    var win = window.open("https://github.com/tgb20/Final-Project/raw/master/Data/raw_data.json", '_blank');
    win.focus();
  }

  openDataCleaner() {
    var win = window.open("https://github.com/tgb20/Final-Project/raw/master/Python Scripts/dataCleaner.py", '_blank');
    win.focus();
  }

  openDataCompressor() {
    var win = window.open("https://github.com/tgb20/Final-Project/raw/master/Python Scripts/dataCompressor.py", '_blank');
    win.focus();
  }

  openDataGenerator() {
    var win = window.open("https://github.com/tgb20/Final-Project/raw/master/Python Scripts/dataGenerator.py", '_blank');
    win.focus();
  }

  openCleanedCSV() {
    var win = window.open("https://github.com/tgb20/Final-Project/raw/master/Data/cleaned_data.csv", '_blank');
    win.focus();
  }

  openFakeCSV() {
    var win = window.open("https://github.com/tgb20/Final-Project/raw/master/Data/fake_data.csv", '_blank');
    win.focus();
  }

  openCompressedCSV() {
    var win = window.open("https://github.com/tgb20/Final-Project", '_blank');
    win.focus();
  }

  getHistoricalData() {
    console.log(this.dateTime.value);
    this.spinner1 = true;
    this.spinner2 = true;

    this.historyPreds = [];
    this.forecastPreds = [];

    var sDateTime = this.dateTime.value.toString().split("-");
    var year = sDateTime[0];
    var month = sDateTime[1];
    var sDay = sDateTime[2].split("T");
    var day = sDay[0];
    this.http.get('http://71.232.77.6:8000/getHistory?year=' + year + '&month=' + month + '&day=' + day).subscribe((response) => {
      let jsonString = JSON.parse(JSON.stringify(response));
      var i = 0;
      for (i = 0; i < jsonString.hTypes.length; i++) {

        var icon = "sunny";
        var color = "primary";

        var sDateTime = jsonString.dates[i].toString().split(" ");
        var dateVal = sDateTime[0].split("-")
        year = dateVal[0];
        month = dateVal[1];
        day = dateVal[2];

        var weather = jsonString.hTypes[i];

        switch (weather) {
          case "Clear":
            icon = "sunny";
            color = "warning";
            break;
          case "Clouds":
            icon = "partly-sunny";
            color = "medium";
            break;
          case "Drizzle":
            icon = "rainy";
            color = "primary";
            break;
          case "Rain":
            icon = "rainy";
            color = "primary";
            break;
          case "Thunderstorm":
            icon = "thunderstorm";
            color = "danger";
            break;
          case "Snow":
            color = "secondary"
            icon = "snow";
            break;
          default:
            icon = "snow";
            break;
        }

        var temp = "" + ((9.0 / 5.0) * (jsonString.hTemps[i] - 273) + 32).toFixed(2) + "° F";
        var humd = jsonString.hHumiditys[i] + "%";
        var press = jsonString.hPressures[i].toFixed(2) + " hPa";
        var wind = (jsonString.hWindspeeds[i] * 2.23694).toFixed(2) + " mph";

        var jsonPred = '{"dt": "' + month + "/" + day + "/" + year + '", "temp": "' + temp + '", "humd":"' + humd + '", "press":"' + press + '", "wind":"' + wind + '", "weather":"' + weather + '", "icon":"' + icon + '", "color":"' + color + '"}';
        this.historyPreds.push(JSON.parse(jsonPred));
      }
      var i = 0;
      for (i = 0; i < jsonString.pTypes.length; i++) {

        var icon = "sunny";
        var color = "primary";

        var sDateTime = jsonString.dates[i].toString().split(" ");
        var dateVal = sDateTime[0].split("-")
        year = dateVal[0];
        month = dateVal[1];
        day = dateVal[2];

        var weather = jsonString.pTypes[i];

        switch (weather) {
          case "Clear":
            icon = "sunny";
            color = "warning";
            break;
          case "Clouds":
            icon = "partly-sunny";
            color = "medium";
            break;
          case "Drizzle":
            icon = "rainy";
            color = "primary";
            break;
          case "Rain":
            icon = "rainy";
            color = "primary";
            break;
          case "Thunderstorm":
            icon = "thunderstorm";
            color = "danger";
            break;
          case "Snow":
            color = "secondary"
            icon = "snow";
            break;
          default:
            icon = "snow";
            break;
        }

        var temp = "" + ((9.0 / 5.0) * (jsonString.pTemps[i] - 273) + 32).toFixed(2) + "° F";
        var humd = jsonString.pHumiditys[i].toFixed(0) + "%";
        var press = jsonString.pPressures[i].toFixed(2) + " hPa";
        var wind = (jsonString.pWindspeeds[i] * 2.23694).toFixed(2) + " mph";

        var jsonPred = '{"dt": "' + month + "/" + day + "/" + year + '", "temp": "' + temp + '", "humd":"' + humd + '", "press":"' + press + '", "wind":"' + wind + '", "weather":"' + weather + '", "icon":"' + icon + '", "color":"' + color + '"}';
        this.forecastPreds.push(JSON.parse(jsonPred));
      }
      this.spinner1 = false;
      this.spinner2 = false;
    });
  }

  getRealTimeData() {


    var aTemp;
    var aPressure;
    var aHumidity;
    var aWindSpeed;
    var aWindDeg;
    var aCloudCov;


    this.http.get('https://api.openweathermap.org/data/2.5/forecast?q=Boston&APPID=2efe065bf1aaf366c8aa78532ce3244a').subscribe((response) => {

      let jsonString = JSON.parse(JSON.stringify(response));
      this.city = jsonString.city.name;
      this.country = jsonString.city.country;
      jsonString.list.forEach(pred => {
        var date = new Date(pred.dt * 1000);
        var day = date.getDate();
        var month = date.getMonth() + 1;
        var rDow = date.getDay();
        var year = date.getFullYear();
        var dow = "";

        switch (rDow) {
          case 0:
            dow = "Sunday";
            break;
          case 1:
            dow = "Monday";
            break;
          case 2:
            dow = "Tuesday";
            break;
          case 3:
            dow = "Wednesday";
            break;
          case 4:
            dow = "Thursday";
            break;
          case 5:
            dow = "Friday";
            break;
          case 6:
            dow = "Saturday";
            break;
          default:
            dow = "Unknown";
            break;
        }

        if (!this.visitedDays.includes(day)) {
          this.visitedDays.push(day);

          var temp = "" + ((9.0 / 5.0) * (pred.main.temp - 273) + 32).toFixed(2) + "° F";
          var humd = pred.main.humidity + "%";
          var press = pred.main.pressure.toFixed(2) + " hPa";
          var wind = (pred.wind.speed * 2.23694).toFixed(2) + " mph";


          aTemp = pred.main.temp;
          aPressure = pred.main.pressure;
          aHumidity = pred.main.humidity;
          aWindSpeed = pred.wind.speed;
          aWindDeg = pred.wind.deg;
          aCloudCov = pred.clouds.all;

          var weather = pred.weather[0].main;

          var icon = "sunny";
          var color = "primary";

          switch (weather) {
            case "Clear":
              icon = "sunny";
              color = "warning";
              break;
            case "Clouds":
              icon = "partly-sunny";
              color = "medium";
              break;
            case "Drizzle":
              icon = "rainy";
              color = "primary";
              break;
            case "Rain":
              icon = "rainy";
              color = "primary";
              break;
            case "Thunderstorm":
              icon = "thunderstorm";
              color = "danger";
              break;
            case "Snow":
              color = "secondary"
              icon = "snow";
              break;
            default:
              icon = "snow";
              break;
          }

          var jsonPred = '{"dt": "' + month + "/" + day + "/" + year + '", "temp": "' + temp + '", "humd":"' + humd + '", "press":"' + press + '", "wind":"' + wind + '", "weather":"' + weather + '", "dow":"' + dow + '", "icon":"' + icon + '", "color":"' + color + '"}';
          this.owmPreds.push(JSON.parse(jsonPred));
        }
      });
      this.http.get('http://71.232.77.6:8000/getKNN?temp=' + aTemp + '&pressure=' + aPressure + '&humidity=' + aHumidity + '&windspeed=' + aWindSpeed + '&winddeg=' + aWindDeg + '&cloudcov=' + aCloudCov).subscribe((response) => {
        let jsonString = JSON.parse(JSON.stringify(response));

        var weather = jsonString.result[0];

        var icon = "sunny";
        var color = "primary";

        switch (weather) {
          case "Clear":
            icon = "sunny";
            color = "warning";
            break;
          case "Clouds":
            icon = "partly-sunny";
            color = "medium";
            break;
          case "Drizzle":
            icon = "rainy";
            color = "primary";
            break;
          case "Rain":
            icon = "rainy";
            color = "primary";
            break;
          case "Thunderstorm":
            icon = "thunderstorm";
            color = "danger";
            break;
          case "Snow":
            color = "secondary"
            icon = "snow";
            break;
          default:
            icon = "snow";
            break;
        }
        var jsonPred = '{"dt": "0", "temp": "0", "humd":"0", "press":"0", "wind":"0", "weather":"' + weather + '", "dow":"0", "icon":"' + icon + '", "color":"' + color + '"}';
        this.ourPred.push(JSON.parse(jsonPred));
      });
      this.owmPreds.pop();
    });
  }
}