package api

import (
	"html/template"
	"net/http"

	"github.com/rs/zerolog"
)

type PageHandler struct {
	Logger zerolog.Logger
}

func NewPageHandler(logger zerolog.Logger) *PageHandler {
	return &PageHandler{
		Logger: logger,
	}
}

func (ph *PageHandler) TimerPage(w http.ResponseWriter, r *http.Request) {
	pages, err := template.ParseFiles("templates/index.html", "templates/pages/timer.html")
	if err != nil {
		ph.Logger.Error().Err(err).Msg("Failed to parse template")
		http.Error(w, "Failed to parse template", http.StatusInternalServerError)
		return
	}

	err = pages.ExecuteTemplate(w, "index", nil)
	if err != nil {
		ph.Logger.Error().Err(err).Msg("Failed to execute template")
		http.Error(w, "Failed to execute template", http.StatusInternalServerError)
		return
	}
}
