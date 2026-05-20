Hooks.once("ready", () => {
  console.log("Ready!");
});

Hooks.once(SimpleCalendar.Hooks.Ready, () => {
  //const players = game.actors.filter(actor => actor.type === "character");
  game.settings.register("mountain-module", "time-tracker", SimpleCalendar.api.currentDateTime());
  console.log(game.settings);
});