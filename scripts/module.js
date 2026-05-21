Hooks.once("ready", () => {
  console.log("Ready!");
});

Hooks.once(SimpleCalendar.Hooks.Ready, async () => {
  game.settings.register("mountain-module", "time-tracker", SimpleCalendar.api.currentDateTime());
});