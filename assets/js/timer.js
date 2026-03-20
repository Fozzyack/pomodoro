document.addEventListener("DOMContentLoaded", () => {
  const display = document.getElementById("timer-display");
  const minutesEl = document.getElementById("timer-minutes");
  const secondsEl = document.getElementById("timer-seconds");
  const centisecondsEl = document.getElementById("timer-centiseconds");
  const editor = document.getElementById("timer-editor");
  const minutesInput = document.getElementById("timer-minutes-input");
  const secondsInput = document.getElementById("timer-seconds-input");
  const centisecondsInput = document.getElementById("timer-centiseconds-input");
  const progressEl = document.getElementById("timer-progress");
  const startPauseBtn = document.getElementById("start-pause-btn");
  const resetBtn = document.getElementById("reset-btn");

  if (
    !display ||
    !minutesEl ||
    !secondsEl ||
    !centisecondsEl ||
    !editor ||
    !minutesInput ||
    !secondsInput ||
    !centisecondsInput ||
    !startPauseBtn ||
    !resetBtn
  ) {
    return;
  }

  const initialDurationMs = Number(display.dataset.durationMs || 1500000);
  let configuredDurationMs = initialDurationMs;
  let remainingMs = configuredDurationMs;
  let endTime = 0;
  let intervalId = null;
  let isEditing = false;

  const formatTwoDigits = (value) => String(value).padStart(2, "0");
  const isRunning = () => intervalId !== null;

  const clampNumber = (value, min, max) => {
    const parsed = Number.parseInt(value, 10);
    if (Number.isNaN(parsed)) {
      return min;
    }
    return Math.min(max, Math.max(min, parsed));
  };

  const durationFromInputs = () => {
    const minutes = clampNumber(minutesInput.value, 0, 999);
    const seconds = clampNumber(secondsInput.value, 0, 59);
    const centiseconds = clampNumber(centisecondsInput.value, 0, 99);
    return (minutes * 60 + seconds) * 1000 + centiseconds * 10;
  };

  const syncInputsFromDuration = (timeMs) => {
    const safeMs = Math.max(0, timeMs);
    const totalCentiseconds = Math.floor(safeMs / 10);
    const centiseconds = totalCentiseconds % 100;
    const totalSeconds = Math.floor(totalCentiseconds / 100);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    minutesInput.value = String(minutes);
    secondsInput.value = formatTwoDigits(seconds);
    centisecondsInput.value = formatTwoDigits(centiseconds);
  };

  const showEditor = (show) => {
    isEditing = show;
    editor.classList.toggle("hidden", !show);
    editor.classList.toggle("flex", show);
    display.classList.toggle("hidden", show);
    display.classList.toggle("flex", !show);
  };

  const applyInputDuration = () => {
    configuredDurationMs = durationFromInputs();
    remainingMs = configuredDurationMs;
    syncInputsFromDuration(remainingMs);
    render(remainingMs);
  };

  const enterEditMode = () => {
    if (isRunning()) {
      return;
    }

    syncInputsFromDuration(remainingMs);
    showEditor(true);
    minutesInput.focus();
    minutesInput.select();
  };

  const exitEditMode = () => {
    showEditor(false);
  };

  const commitEdit = () => {
    applyInputDuration();
    exitEditMode();
  };

  const cancelEdit = () => {
    syncInputsFromDuration(remainingMs);
    exitEditMode();
  };

  const renderProgress = (timeMs) => {
    if (!progressEl) {
      return;
    }

    if (configuredDurationMs <= 0) {
      progressEl.style.width = "0%";
      return;
    }

    const pct = (Math.max(0, timeMs) / configuredDurationMs) * 100;
    progressEl.style.width = `${Math.max(0, Math.min(100, pct))}%`;
  };

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
    renderProgress(safeMs);
  };

  const stop = () => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
    startPauseBtn.textContent = "Start";
    exitEditMode();
  };

  const tick = () => {
    remainingMs = Math.max(0, endTime - performance.now());
    render(remainingMs);

    if (remainingMs <= 0) {
      stop();
    }
  };

  const start = () => {
    exitEditMode();
    endTime = performance.now() + remainingMs;
    intervalId = setInterval(tick, 10);
    startPauseBtn.textContent = "Pause";
  };

  const handleEditorFocusOut = () => {
    if (!isEditing) {
      return;
    }

    requestAnimationFrame(() => {
      if (!editor.contains(document.activeElement)) {
        commitEdit();
      }
    });
  };

  startPauseBtn.addEventListener("click", () => {
    if (isRunning()) {
      stop();
      return;
    }

    if (isEditing) {
      commitEdit();
    }

    if (remainingMs <= 0) {
      return;
    }

    start();
  });

  resetBtn.addEventListener("click", () => {
    stop();
    configuredDurationMs = initialDurationMs;
    remainingMs = configuredDurationMs;
    syncInputsFromDuration(remainingMs);
    render(remainingMs);
  });

  display.addEventListener("click", enterEditMode);
  editor.addEventListener("focusout", handleEditorFocusOut);
  editor.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      commitEdit();
    }

    if (event.key === "Escape") {
      event.preventDefault();
      cancelEdit();
    }
  });

  syncInputsFromDuration(remainingMs);
  render(remainingMs);
  exitEditMode();
});
