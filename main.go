package main

import (
	"flag"
	"fmt"
	"net/http"
	"pomodoro-timer/v2/internal/app"
	"pomodoro-timer/v2/internal/routes"
	"time"
)

func main() {

	var port int
	flag.IntVar(&port, "port", 8080, "Port to listen on")
	flag.Parse()

	app, err := app.NewApplication()
	if err != nil {
		panic(err)
	}

	app.Logger.Info().Msg("Setting up Router")
	r, err := routes.SetupRouter(app)
	if err != nil {
		app.Logger.Fatal().Err(err).Msg("Failed to setup routes")
	}

	app.Logger.Info().Msg("Setting up Server")
	server := &http.Server{
		Addr:         fmt.Sprintf(":%d", port),
		Handler:      r,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 10 * time.Second,
		IdleTimeout:  120 * time.Second,
	}

	app.Logger.Info().Int("port", port).Msg("Starting server")
	err = server.ListenAndServe()
	if err != nil {
		app.Logger.Fatal().Err(err).Msg("Failed to start server")
	}

}
