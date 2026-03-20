document.addEventListener("DOMContentLoaded", () => {
  const display = document.getElementById("timer-display");
  const minutesEl = document.getElementById("timer-minutes");
  const secondsEl = document.getElementById("timer-seconds");
  const centisecondsEl = document.getElementById("timer-centiseconds");
  const startPauseBtn = document.getElementById("start-pause-btn");
  const resetBtn = document.getElementById("reset-btn");

  if (
    !display ||
    !minutesEl ||
    !secondsEl ||
    !centisecondsEl ||
    !startPauseBtn ||
    !resetBtn
  ) {
    return;
  }

  const initialDurationMs = Number(display.dataset.durationMs || 1500000);
  let remainingMs = initialDurationMs;
  let endTime = 0;
  let intervalId = null;

  const formatTwoDigits = (value) => String(value).padStart(2, "0");

  const render = (timeMs) => {
    const safeMs = Math.max(0, timeMs);
    const totalCentiseconds = Math.floor(safeMs / 10);
    const centiseconds = totalCentiseconds % 100;
    const totalSeconds = Math.floor(totalCentiseconds / 100);
    const seconds = totalSeconds % 60;
    const minutes = Math.floor(totalSeconds / 60);

    minutesEl.textContent = formatTwoDigits(minutes);
    secondsEl.textContent = formatTwoDigits(seconds);
    centisecondsEl.textContent = formatTwoDigits(centiseconds);
  };

  const stop = () => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
    startPauseBtn.textContent = "Start";
  };

  const tick = () => {
    remainingMs = Math.max(0, endTime - performance.now());
    render(remainingMs);

    if (remainingMs <= 0) {
      stop();
    }
  };

  const start = () => {
    endTime = performance.now() + remainingMs;
    intervalId = setInterval(tick, 10);
    startPauseBtn.textContent = "Pause";
  };

  startPauseBtn.addEventListener("click", () => {
    if (intervalId) {
      stop();
      return;
    }

    if (remainingMs <= 0) {
      remainingMs = initialDurationMs;
      render(remainingMs);
    }

    start();
  });

  resetBtn.addEventListener("click", () => {
    stop();
    remainingMs = initialDurationMs;
    render(remainingMs);
  });

  render(remainingMs);
});
