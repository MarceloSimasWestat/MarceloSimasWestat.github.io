library(ggplot2)
library(rvg)
library(ggiraph)
library(htmlwidgets)

dataset <- read.csv(file.path("data", "data.csv"), stringsAsFactors = FALSE, check.names = FALSE)
dataset$tooltip <- paste("N =", dataset$freq)
dataset$variable <- factor(dataset$variable)
dataset$group <- factor(dataset$group)
dataset$school <- factor(dataset$school)


dataset_gender <- subset(dataset, variable =="gender")
dataset_race <- subset(dataset, variable =="race")


# geom_point_interactive example
graph_widget <- ggplot(dataset) + geom_bar_interactive(
  mapping = aes(x = variable, tooltip = tooltip))
graph_widget <- graph_widget + graph_widget_theme
#graph_widget <- graph_widget + facet_wrap(~carb, nrow=2)

export_widget <- function (graph_widget, filename) {
  
  tooltip_css <- "
    background-color: white;
    font-weight: bold;
    padding: 10px;
    border-radius: 10px 20px 10px 20px;"
  
  # htmlwidget call
  graph_widget <- ggiraph(
    code = {print(graph_widget)},
    tooltip_extra_css = tooltip_css,
    tooltip_opacity = .75)
  
  
  saveWidget(graph_widget, paste0(filename, ".html"), selfcontained = FALSE, libdir = NULL, background = NULL)
}

graph_widget <- ggplot(dataset_race, aes(x = group, y = percent * 100, fill = school, tooltip = tooltip)) + geom_bar_interactive(stat='identity' ) + coord_flip() + xlab("Race") + ylab("Percentage")
export_widget(graph_widget, 'race')
