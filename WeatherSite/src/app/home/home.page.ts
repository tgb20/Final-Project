import { Component, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  city:string;
  country:string;
  owmPreds:any[] = [];

  visitedDays:any[] = [];

  @ViewChild('radarCanvas') radarCanvas;
  radarChart: any;

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    this.getOpenWeatherMapData();

    this.radarChart = new Chart(this.radarCanvas.nativeElement, {

      type: 'radar',
      data: {
          labels: ["2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019"],
          datasets: [{
              label: 'Clear',
              data: [1096, 3685, 3445, 3274, 3726, 3429, 3098, 728],
              backgroundColor: [
                  'rgba(255,206,0, 0.1)'
              ],
              borderColor: [
                'rgba(255,206,0, 0.1)'
            ]
          },
          {
            label: 'Clouds',
            data: [477, 2825, 2707, 2409, 2587, 2314, 2555, 1159],
            backgroundColor: [
                'rgba(152,154,162, 0.1)'
            ],
            bordorColor: [
              'rgba(152,154,162, 0.1)'
          ]
        },
        {
          label: 'Snow',
          data: [70, 188, 60, 514, 232, 314, 357, 155],
          backgroundColor: [
              'rgba(112,209,232, 0.1)'
          ],
          bordorColor: [
            'rgba(112,209,232, 0.1)'
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

  openGithub(){
    var win = window.open("https://github.com/tgb20/Final-Project", '_blank');
    win.focus();
  }

  openRawJSON(){
    var win = window.open("https://github.com/tgb20/Final-Project/raw/master/Data/raw_data.json", '_blank');
    win.focus();
  }
  
  openDataCleaner(){
    var win = window.open("https://github.com/tgb20/Final-Project/raw/master/Python Scripts/dataCleaner.py", '_blank');
    win.focus();
  }

  openDataCompressor(){
    var win = window.open("https://github.com/tgb20/Final-Project/raw/master/Python Scripts/dataCompressor.py", '_blank');
    win.focus();
  }

  openDataGenerator(){
    var win = window.open("https://github.com/tgb20/Final-Project/raw/master/Python Scripts/dataGenerator.py", '_blank');
    win.focus();
  }

  openCleanedCSV(){
    var win = window.open("https://github.com/tgb20/Final-Project/raw/master/Data/cleaned_data.csv", '_blank');
    win.focus();
  }

  openFakeCSV(){
    var win = window.open("https://github.com/tgb20/Final-Project/raw/master/Data/fake_data.csv", '_blank');
    win.focus();
  }

  openCompressedCSV(){
    var win = window.open("https://github.com/tgb20/Final-Project", '_blank');
    win.focus();
  }

  getOpenWeatherMapData() {

    this.http.get('https://api.openweathermap.org/data/2.5/forecast?q=Boston&APPID=2efe065bf1aaf366c8aa78532ce3244a').subscribe((response) => {
      
      let jsonString = JSON.parse(JSON.stringify(response));
      this.city = jsonString.city.name;
      this.country = jsonString.city.country;
      jsonString.list.forEach(pred => {
        var date = new Date(pred.dt * 1000);
        var day = date.getDate();
        var month = date.getMonth() + 1;
        var rDow = date.getDay();
        var dow = "";

        switch(rDow){
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

        if(!this.visitedDays.includes(day)){
          this.visitedDays.push(day);

          var temp = "" + ((9.0/5.0) * (pred.main.temp - 273) + 32).toFixed(2) + "° F";
          var humd = pred.main.humidity + "%";
          var press = pred.main.pressure.toFixed(2) + " hPa";
          var wind = (pred.wind.speed * 2.23694).toFixed(2) + " mph";

          var weather = pred.weather[0].main;

          var icon = "sunny";
          var color = "primary";

          switch(weather){
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

          var jsonPred = '{"dt": "' + month + "/" + day + '", "temp": "' + temp + '", "humd":"' + humd + '", "press":"' + press + '", "wind":"' + wind + '", "weather":"' + weather + '", "dow":"' + dow + '", "icon":"' + icon + '", "color":"' + color + '"}';
          this.owmPreds.push(JSON.parse(jsonPred));
        }
      });
      this.owmPreds.pop();
      console.log(this.owmPreds);
    });

  }
}