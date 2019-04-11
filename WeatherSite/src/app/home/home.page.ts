import { Component, ViewChild } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor() {
  }

  slideOpts = {
    effect: 'flip'
  };

  openOpenWeatherMap(){
    var win = window.open("https://openweathermap.org", '_blank');
    win.focus();
  }

}
