library(ggplot2)
clean_data <- read.csv('cleaned_data.csv', header = TRUE)

ggplot(data = clean_data, aes(x = dtiso, y = temp))+
  geom_line(color = "#00AFBB", size = 2)

