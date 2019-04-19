import json
import csv
with open('../Data/cleaned_data.csv', 'w') as csvfile:
    fieldnames = ['id', 'weathertype', 'temp', 'pressure', 'humidity', 'mintemp', 'maxtemp', 'windspeed', 'winddeg', 'cloudcov', 'dt', 'dtiso']
    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
    writer.writeheader()

    pID = 0
    with open('../Data/raw_data.json') as json_file:
        data = json.load(json_file)
        for p in data:
            weathertype = p["weather"][0]["main"]

            if(weathertype == "Drizzle"):
                weathertype = "Rain"
            if(weathertype == "Dust"):
                weathertype = "Clear"
            if(weathertype == "Fog"):
                weathertype = "Cloudy"
            if(weathertype == "Haze"):
                weathertype = "Cloudy"
            if(weathertype == "Mist"):
                weathertype = "Rain"
            if(weathertype == "Smoke"):
                weathertype = "Clear"



            temp = p["main"]["temp"]
            pressure = p["main"]["pressure"]
            humidity = p["main"]["humidity"]
            mintemp = p["main"]["temp_min"]
            maxtemp = p["main"]["temp_max"]
            windspeed = p["wind"]["speed"]
            winddeg = p["wind"]["deg"]
            cloudcov = p["clouds"]["all"]
            dt = p["dt"]
            dtiso = p["dt_iso"]

            writer.writerow({'id': pID, 'weathertype': weathertype, 'temp': temp, 'pressure': pressure, 'humidity': humidity, 'mintemp': mintemp, 'maxtemp': maxtemp, 'windspeed': windspeed,'winddeg': winddeg, 'cloudcov': cloudcov, 'dt': dt, 'dtiso': dtiso})
            pID += 1
            
        
