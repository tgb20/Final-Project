import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    this.getOpenWeatherMapData();
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