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
dataset_IDEA <- subset(dataset, variable =="idea")
dataset_lep <- subset(dataset, variable =="lep")


export_widget <- function (graph_widget, filename,w,h) {
  
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
    width_svg = w, height_svg = h)
  
  
  saveWidget(graph_widget, paste0(filename, ".html"), selfcontained = FALSE, libdir = NULL, background = NULL)
}



allschools <- dataset_race[dataset_race$school == "All Schools",]
schoolorder <- as.character(allschools$group[with(allschools,order(-percent))])


#Chronic Absenteeism by Race/Ethnicity
graph_widget <- ggplot(dataset_race, aes(x = group, y = percent * 100, fill = school, tooltip = tooltip)) + 
  geom_bar_interactive(stat='identity', position = "dodge") +
  coord_flip() +
  xlab(NULL) +
  ylab("Percentage") +
  theme(panel.background = element_rect(fill = "white")) +
  theme(panel.grid.major.x= element_line(color ="lightgrey",size=.1)) +
  theme(text = element_text(size=15),axis.text.y = element_text(size=12)) +
  ggtitle("Chronic Absenteeism by Race/Ethnicity") +
  guides(fill=guide_legend(title="School")) +
  scale_fill_manual(values=brewer.pal(5,"Set2")) +
  scale_y_continuous(breaks=seq(0,100,5),labels=paste(seq(0,100,5),"%",sep="")) +
  scale_x_discrete(limits=schoolorder)


export_widget(graph_widget, 'race',14,7)


#Chronic Absenteeism by Gender
graph_widget <- ggplot(dataset_gender, aes(x = group, y = percent * 100, fill = school, tooltip = tooltip)) + 
  geom_bar_interactive(stat='identity', position = "dodge") +
  xlab(NULL) +
  ylab("Percentage") +
  theme(panel.background = element_rect(fill = "white")) +
  theme(panel.grid.major.y= element_line(color ="lightgrey",size=.1)) +
  theme(text = element_text(size=15),axis.text.y = element_text(size=12)) +
  ggtitle("Chronic Absenteeism by Gender") +
  guides(fill=guide_legend(title="School")) +
  scale_fill_manual(values=brewer.pal(5,"Set2")) +
  scale_y_continuous(breaks=seq(0,100,5),labels=paste(seq(0,100,5),"%",sep=""))

export_widget(graph_widget, 'gender',2,1)


graph_widget <- ggplot(dataset_IDEA, aes(x = group, y = percent * 100, fill = school, tooltip = tooltip)) + 
  geom_bar_interactive(stat='identity', position = "dodge") +
  xlab(NULL) +
  ylab("Percentage") +
  theme(panel.background = element_rect(fill = "white")) +
  theme(panel.grid.major.y= element_line(color ="lightgrey",size=.1)) +
  theme(text = element_text(size=15),axis.text.y = element_text(size=12)) +
  ggtitle("Chronic Absenteeism by IDEA") +
  guides(fill=guide_legend(title="School")) +
  scale_fill_manual(values=brewer.pal(5,"Set2")) +
  scale_y_continuous(breaks=seq(0,100,5),labels=paste(seq(0,100,5),"%",sep=""))

export_widget(graph_widget, 'IDEA',3.5,3.5)


graph_widget <- ggplot(dataset_lep, aes(x = group, y = percent * 100, fill = school, tooltip = tooltip)) + 
  geom_bar_interactive(stat='identity', position = "dodge") +
  xlab(NULL) +
  ylab("Percentage") +
  theme(panel.background = element_rect(fill = "white")) +
  theme(panel.grid.major.y= element_line(color ="lightgrey",size=.1)) +
  theme(text = element_text(size=15),axis.text.y = element_text(size=12)) +
  ggtitle("Chronic Absenteeism by English Language Learner Status") +
  guides(fill=guide_legend(title="School")) +
  scale_fill_manual(values=brewer.pal(5,"Set2")) +
  scale_y_continuous(breaks=seq(0,100,5),labels=paste(seq(0,100,5),"%",sep=""))

export_widget(graph_widget, 'lep',3.5,3.5)




