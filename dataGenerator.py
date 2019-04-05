import csv
import random
import math

numRows = 1000

with open('fake_data.csv', 'w') as csvfile:
    fieldnames = ['id', 'weather', 'temp', 'pressure', 'humidity', 'wind']
    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

    writer.writeheader()
    for i in range(1, numRows + 1):
        # Runs for every row

        pressure = random.randrange(0, 1000)
        temp = 0 if pressure > 500 else 100
        wind = random.randrange(0, 50)
        humidity = abs(math.sin(wind))
        cloud = "Cloudy" if temp == 0 else "Sunny"
        writer.writerow({'id': i,'weather': cloud,'temp': temp, 'pressure': pressure, 'humidity': humidity, 'wind': wind})