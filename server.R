# server.R

# Init Variables
library(ROCR)
library(class)

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

weather.lst <- lapply(data.df[ , 3:8], normalize.it)
data.weather.normed <- data.frame(weather.lst)
summary(data.weather.normed)

train.row.nums <- sample(1:data.size, data.size*train.size, replace = FALSE)
train.data <- subset(data.weather.normed[train.row.nums, ])

test.row.nums <- setdiff(1:data.size, train.row.nums)
test.data <- subset(data.weather.normed[test.row.nums, ])

class.labels <- data.df$weathertype[train.row.nums]
true.labels <- data.df$weathertype[test.row.nums]

#* Echo back the input
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
  
  # Add Values to predict to all values, normalize, then run knn.
  
  predict.df <- data.frame("temp" = c(tempValue), "pressure" = c(pressureValue), "humidity" = c(humidityValue), "windspeed" = c(windspeedValue), "winddeg" = c(winddegValue), "cloudcov" = c(cloudcovValue))
  
  predict.lst <- lapply(predict.df, normalize.it)
  predict.normed <- data.frame(predict.lst)
  
  knn.predict <- knn(train.data, predict.normed, class.labels, k=5)
  list(result = knn.predict)
}