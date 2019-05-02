# server.R

# Init Variables
library(ROCR)
library(class)

#* @filter cors
cors <- function(res) {
  res$setHeader("Access-Control-Allow-Origin", "*")
  plumber::forward()
}

set.seed(12345)
data.df <- read.csv("Data/cleaned_data.csv")
data.size <- nrow(data.df)
train.size <- .80
num.test.labels <- data.size*(1-train.size)


data.df$weather <- as.factor(data.df$weathertype)
levels(data.df$weathertype) <- c("Clear", "Clouds", "Rain", "Snow", "Thunderstorm")

normalize.it <- function(vec) {
  y <- (vec - min(vec))/(max(vec) - min(vec))
  y
}

#* Return KNN Results for Data
#* @param temp Current Temperature
#* @param pressure Current Pressure
#* @param humidity Current Humidity
#* @param windspeed Current Wind Speed
#* @param winddeg Current Wind Degrees
#* @param cloudcov Current Cloud Coverage
#* @get /getKNN
function(temp, pressure, humidity, windspeed, winddeg, cloudcov){
  
  tempValue <- as.numeric(temp)
  pressureValue <- as.numeric(pressure)
  humidityValue <- as.numeric(humidity)
  windspeedValue <- as.numeric(windspeed)
  winddegValue <- as.numeric(winddeg)
  cloudcovValue <- as.numeric(cloudcov)
  
  # Create Row of Current Data
  valuetopredict.df <- data.frame("temp" = c(tempValue), "pressure" = c(pressureValue), "humidity" = c(humidityValue), "windspeed" = c(windspeedValue), "winddeg" = c(winddegValue), "cloudcov" = c(cloudcovValue))
  
  # Get Full Dataset
  train.variables <- data.df[, 3:8]
  
  # Append Current Data to Full Dataset
  fulldata.df <- rbind(train.variables, valuetopredict.df)
  
  full.lst <- lapply(fulldata.df[ , 1:6], normalize.it)
  data.full.normed <- data.frame(full.lst)
  
  train.row.nums <- sample(1:data.size, data.size*train.size, replace = FALSE)
  class.labels <- data.df$weathertype[train.row.nums]
  train.data <- subset(data.full.normed[train.row.nums, ])
  
  valuetopredict.normed <- tail(data.full.normed, 1)
  
  knn.predict <- knn(train.data, valuetopredict.normed, class.labels, k=5)
  list(result = knn.predict)
}

#* Get historical data and forecast
#* @param year year to get from
#* @param month month to get from
#* @param day day to get from
#* @get /getHistory
function(year, month, day){
  
  calcDate <- paste(year, "-", month, "-", day, " 00:00:00 +0000 UTC", sep="")
  day1Row <- which(data.df$dtiso == calcDate)
  day2Row <- day1Row + 24
  day3Row <- day2Row + 24
  day4Row <- day3Row + 24
  day5Row <- day4Row + 24
  
  history.df <- data.df[c(day1Row, day2Row, day3Row, day4Row, day5Row),]
  
  list(hTypes = history.df$weathertype, hTemps = history.df$temp, hPressure = history.df$pressure, hHumidity = history.df$humidity, hWindspeed = history.df$windspeed, hWindDeg = history.df$winddeg, hCloudcov = history.df$cloudcov)
}