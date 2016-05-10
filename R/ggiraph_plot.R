library(ggplot2)
library(rvg)
library(ggiraph)
library(htmlwidgets)

dataset <- read.csv(file.path("data", "data.csv"), stringsAsFactors = FALSE, check.names = FALSE)
dataset$tooltip <- paste("N =",paste(formatC(dataset$freq, format="d", big.mark=',')," (",round(dataset$percent*100,1),"%)",sep=""))
dataset$variable <- factor(dataset$variable)
dataset$group <- factor(dataset$group)
dataset$school <- factor(dataset$school)
dataset$school <- factor(dataset$school, levels = levels(dataset$school)[c(5,3,2,4,1)])

dataset_gender <- subset(dataset, variable =="gender")
dataset_race <- subset(dataset, variable =="race")


export_widget <- function (graph_widget, filename) {
  
  tooltip_css <- "
    font-family: 'Calibri';
    background-color: white;

    padding: 10px;
    border-radius: 10px 20px 10px 20px;"
  
  # htmlwidget call
  graph_widget <- ggiraph(
    code = {print(graph_widget)},
    tooltip_extra_css = tooltip_css,
    tooltip_opacity = .75,
    width_svg = 14, height_svg = 7)
  
  
  saveWidget(graph_widget, paste0(filename, ".html"), selfcontained = FALSE, libdir = NULL, background = NULL)
}


#Chronic Absenteeism by Race/Ethnicity
graph_widget <- ggplot(dataset_race, aes(x = group, y = percent * 100, fill = school, tooltip = tooltip)) + 
  geom_bar_interactive(stat='identity', position = "dodge") +
  coord_flip() + 
  xlab("Race") + 
  ylab("Percentage") +
  theme(panel.background = element_rect(fill = "white")) +
  theme(panel.grid.major.x= element_line(color ="lightgrey",size=.1)) +
  theme(text = element_text(size=15),axis.text.y = element_text(size=12)) +
  ggtitle("Chronic Absenteeism by Race/Ethnicity") +
  guides(fill=guide_legend(title="School")) +
  scale_fill_manual(values=brewer.pal(5,"Set2")) +
  scale_y_continuous(breaks=seq(0,100,5),labels=seq(0,100,5))


export_widget(graph_widget, 'race')


#Chronic Absenteeism by Gender
graph_widget <- ggplot(dataset_gender, aes(x = group, y = percent * 100, fill = school, tooltip = tooltip)) + 
  geom_bar_interactive(stat='identity', position = "dodge") +
  coord_flip() + 
  xlab("Race") + 
  ylab("Percentage") +
  theme(panel.background = element_rect(fill = "white")) +
  theme(panel.grid.major.x= element_line(color ="lightgrey",size=.1)) +
  theme(text = element_text(size=15),axis.text.y = element_text(size=12)) +
  ggtitle("Chronic Absenteeism by Gender") +
  guides(fill=guide_legend(title="School")) +
  scale_fill_manual(values=brewer.pal(5,"Set2")) +
  scale_y_continuous(breaks=seq(0,100,5),labels=seq(0,100,5))

export_widget(graph_widget, 'gender')






