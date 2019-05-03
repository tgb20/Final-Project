# INFO 248 Final Project - Weather Website

## Launch the Website:
The live version of the website can be found [here](http://weather.jacobbashista.com).

If you want to run this website locally you will need:
- Ionic
- NodeJS
- npm
- Ionic Capacitor

You will need to lookup how to run a ionic project as it changes machine to machine

# API Documentation
A crude REST API was built to allow our website to communicate with our R models. If you would like to run it here are the steps:

## Endpoints:
### /getKNN
```
@param temp (your temp value in kelvin)
@param pressure (your pressure value in hPa)
@param humidity (your humidity value in %)
@param windspeed (your windspeed in m/s)
@param winddeg (wind angle in degrees)
@param cloudcov (your cloud coverage in %)
@returns JSON with result equal to KNN prediction
```
Example call:
```
http://71.232.77.6:8000/getKNN?temp= 286.5645&pressure=985.0466&humidity=94&windspeed=12.35&winddeg=121&cloudcov=91
```
Returns:
```
{
    "result": [
        "Rain"
    ]
}
```
### /getHistory
```
@param year (year as string)
@param month (month as string)
@param day (day as string)
@returns JSON with 5 day real data and 5 day forecast
```
Example call:
```
http://71.232.77.6:8000/getHistory?year=2016&month=05&day=12
```
Returns:
```
{
    "dates": [
        "2016-05-12 16:00:00 +0000 UTC",
        "2016-05-13 16:00:00 +0000 UTC",
        "2016-05-14 16:00:00 +0000 UTC",
        "2016-05-15 16:00:00 +0000 UTC",
        "2016-05-16 16:00:00 +0000 UTC"
    ],
    "hTypes": [
        "Clear",
        "Rain",
        "Clouds",
        "Clouds",
        "Clouds"
    ],
    "hTemps": [
        295.27,
        294.06,
        296.25,
        286.5,
        284.52
    ],
    ...
```

## Running Server:

### Requirements
- Linux Server (or knowledge to convert following commands to Mac/PC)
- Local Copy of R
- Plumber R Package
- Any packages outlined in server.R

### Note:
R runs in your terminal instance so when using SSH I recommend using screen to run R in its own container.

Clone the repo to your machine
```
git clone https://github.com/tgb20/Final-Project.git
```

Launch R
```
sudo -i R
```

Set working directory to Final-Project Folder
```
setwd("/path/to/Final-Project")
```

Load plumber package
```
library(plumber)
```

Initiate Server File
```
r <- plumb("server.R")
```

Start R Server
```
r$run(host="0.0.0.0", port=8000)
```
