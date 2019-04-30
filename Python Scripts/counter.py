import json
import csv

values = {}

with open('../Data/cleaned_data.csv') as csv_file:
    csv_reader = csv.reader(csv_file, delimiter=',')
    line_count = 0
    for row in csv_reader:
        rawDate = row[9]
        year = rawDate[0:4]
        wType = row[1]
        if not year + wType in values:
            values[year + wType] = 1
        else:
            values[year + wType] = values.get(year + wType) + 1

for x, y in values.items():
  print(x, y)
