# server.R

# Init Variables
library(ROCR)
library(class)
library(forecast)

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

knnpred <- function(temp, pressure, humidity, windspeed, winddeg, cloudcov){
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
  knn.predict
}

predtemp <- function(year, month, day, endrow){
  start <- c(2012,10,1,14)
  dataSubsetToDate <- data.df[1:endrow,]
  subWeather.vec <- as.vector(dataSubsetToDate$temp)
  end <- c(as.numeric(year),as.numeric(month),as.numeric(day),16)
  newWeather.ts <- ts(subWeather.vec, frequency = 8760, start = start, end = end)
  weather.pred2 <- HoltWinters(newWeather.ts)
  weather.forecast2 <- forecast(weather.pred2, h=120)
  forecasted.df <- as.data.frame(weather.forecast2)
  forecasted.df
}

predhumd <- function(year, month, day, endrow){
  start <- c(2012,10,1,14)
  dataSubsetToDate <- data.df[1:endrow,]
  subWeather.vec <- as.vector(dataSubsetToDate$humidity)
  end <- c(as.numeric(year),as.numeric(month),as.numeric(day),16)
  newWeather.ts <- ts(subWeather.vec, frequency = 8760, start = start, end = end)
  weather.pred2 <- HoltWinters(newWeather.ts)
  weather.forecast2 <- forecast(weather.pred2, h=120)
  forecasted.df <- as.data.frame(weather.forecast2)
  forecasted.df
}

predpress <- function(year, month, day, endrow){
  start <- c(2012,10,1,14)
  dataSubsetToDate <- data.df[1:endrow,]
  subWeather.vec <- as.vector(dataSubsetToDate$pressure)
  end <- c(as.numeric(year),as.numeric(month),as.numeric(day),16)
  newWeather.ts <- ts(subWeather.vec, frequency = 8760, start = start, end = end)
  weather.pred2 <- HoltWinters(newWeather.ts)
  weather.forecast2 <- forecast(weather.pred2, h=120)
  forecasted.df <- as.data.frame(weather.forecast2)
  forecasted.df
}

predcloudcov <- function(year, month, day, endrow){
  start <- c(2012,10,1,14)
  dataSubsetToDate <- data.df[1:endrow,]
  subWeather.vec <- as.vector(dataSubsetToDate$cloudcov)
  end <- c(as.numeric(year),as.numeric(month),as.numeric(day),16)
  newWeather.ts <- ts(subWeather.vec, frequency = 8760, start = start, end = end)
  weather.pred2 <- HoltWinters(newWeather.ts)
  weather.forecast2 <- forecast(weather.pred2, h=120)
  forecasted.df <- as.data.frame(weather.forecast2)
  forecasted.df
}

predwindspeed <- function(year, month, day, endrow){
  start <- c(2012,10,1,14)
  dataSubsetToDate <- data.df[1:endrow,]
  subWeather.vec <- as.vector(dataSubsetToDate$windspeed)
  end <- c(as.numeric(year),as.numeric(month),as.numeric(day),16)
  newWeather.ts <- ts(subWeather.vec, frequency = 8760, start = start, end = end)
  weather.pred2 <- HoltWinters(newWeather.ts)
  weather.forecast2 <- forecast(weather.pred2, h=120)
  forecasted.df <- as.data.frame(weather.forecast2)
  forecasted.df
}

predwinddeg <- function(year, month, day, endrow){
  start <- c(2012,10,1,14)
  dataSubsetToDate <- data.df[1:endrow,]
  subWeather.vec <- as.vector(dataSubsetToDate$winddeg)
  end <- c(as.numeric(year),as.numeric(month),as.numeric(day),16)
  newWeather.ts <- ts(subWeather.vec, frequency = 8760, start = start, end = end)
  weather.pred2 <- HoltWinters(newWeather.ts)
  weather.forecast2 <- forecast(weather.pred2, h=120)
  forecasted.df <- as.data.frame(weather.forecast2)
  forecasted.df
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
  knn.predict <- knnpred(temp, pressure, humidity, windspeed, winddeg, cloudcov)
  list(result = knn.predict)
}

#* Get historical data and forecast
#* @param year year to get from
#* @param month month to get from
#* @param day day to get from
#* @get /getHistory
function(year, month, day){
  
  calcDate <- paste(year, "-", month, "-", day, " 16:00:00 +0000 UTC", sep="")
  day1Row <- which(data.df$dtiso == calcDate)
  day2Row <- day1Row + 24
  day3Row <- day2Row + 24
  day4Row <- day3Row + 24
  day5Row <- day4Row + 24
  
  tempPrediction <- predtemp(year, month, day, day1Row)
  pressurePrediction <- predpress(year, month, day, day1Row)
  humidityPrediction <- predhumd(year, month, day, day1Row)
  winddegPrediction <- predwinddeg(year, month, day, day1Row)
  windspeedPrediction <- predwindspeed(year, month, day, day1Row)
  cloudcovPrediction <- predcloudcov(year, month, day, day1Row)
  
  tempVals <- tempPrediction$`Point Forecast`
  pressureVals <- pressurePrediction$`Point Forecast`
  humidityVals <- humidityPrediction$`Point Forecast`
  winddegVals <- winddegPrediction$`Point Forecast`
  windspeedVals <- windspeedPrediction$`Point Forecast`
  cloudcovVals <- cloudcovPrediction$`Point Forecast`
  
  allPredictions.df <- data.frame(tempVals, pressureVals, humidityVals, winddegVals, windspeedVals, cloudcovVals)
  
  prediction.df <- allPredictions.df[c(1, 25, 49, 73, 97),]
  
  prediction.df$weathertype <- knnpred(prediction.df$tempVals, prediction.df$pressureVals, prediction.df$humidityVals, prediction.df$windspeedVals, prediction.df$winddegVals, prediction.df$cloudcovVals)
  
  history.df <- data.df[c(day1Row, day2Row, day3Row, day4Row, day5Row),]
  
  list(dates = history.df$dtiso, hTypes = history.df$weathertype, hTemps = history.df$temp, hPressures = history.df$pressure, hHumiditys = history.df$humidity, hWindspeeds = history.df$windspeed, hWindDegs = history.df$winddeg, hCloudcovs = history.df$cloudcov, 
       pTypes = prediction.df$weathertype, pTemps = prediction.df$tempVals, hPressures = prediction.df$pressureVals, hHumiditys = prediction.df$humidityVals, pWindspeeds = prediction.df$windspeedVals, pWindDegs = prediction.df$winddegVals, pCloudcovs = prediction.df$cloudcovVals)
}