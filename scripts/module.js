Hooks.once("ready", () => {
  console.log("Ready!");
});

Hooks.once(SimpleCalendar.Hooks.Ready, () => {
  //const players = game.actors.filter(actor => actor.type === "character");
  game.settings.register("mountain-module", "time-tracker", SimpleCalendar.api.currentDateTime());
});

Hooks.on(SimpleCalendar.Hooks.DateTimeChange, (data) => {
  const trackedDateTimeStamp = SimpleCalendar.api.dateToTimestamp(game.settings.settings.get("mountain-module.time-tracker"));
  console.log(trackedDateTimeStamp)
});