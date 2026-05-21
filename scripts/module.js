Hooks.once("ready", () => {
  console.log("Ready!");
});

Hooks.once(SimpleCalendar.Hooks.Ready, () => {
  //const players = game.actors.filter(actor => actor.type === "character");
  game.settings.register("mountain-module", "time-tracker", SimpleCalendar.api.currentDateTime());
  updateBastions(1);
});

Hooks.on(SimpleCalendar.Hooks.DateTimeChange, (data) => {
  const trackedDateTimeStamp = SimpleCalendar.api.dateToTimestamp(game.settings.settings.get("mountain-module.time-tracker"));
  const diff = SimpleCalendar.api.dateToTimestamp(data.date) - trackedDateTimeStamp;
  // 86400 seconds/day
  const diffInDays = diff / 86400;
  updateBastions(diffInDays);
});

function updateBastions(days) {
  const players = game.actors.filter(actor => actor.type === "character");
  for(const player of players) {
    const facilities = player.items.filter(item => item.type === "facility" && item.system.progress.max !== null);
    for(const facility of facilities) {
      console.log(facility);
    }
  }
}