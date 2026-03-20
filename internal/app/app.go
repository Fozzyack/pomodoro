package app

import (
	"os"
	"pomodoro-timer/v2/internal/api"

	"github.com/rs/zerolog"
)

type Application struct {
	Logger      zerolog.Logger
	PageHandler *api.PageHandler
}

func NewApplication() (*Application, error) {
	logger := zerolog.New(zerolog.ConsoleWriter{Out: os.Stdout}).With().Timestamp().Logger()

	pageHandler := api.NewPageHandler(logger)

	app := &Application{
		Logger:      logger,
		PageHandler: pageHandler,
	}

	return app, nil
}
