Hooks.once("ready", () => {
  console.log("Ready!");
});

Hooks.once(SimpleCalendar.Hooks.Ready, async () => {
  game.settings.register("mountain-module", "time-tracker", SimpleCalendar.api.currentDateTime());
});

Hooks.on(SimpleCalendar.Hooks.DateTimeChange, async (data) => {
  const trackedDateTimeStamp = SimpleCalendar.api.dateToTimestamp(game.settings.settings.get("mountain-module.time-tracker"));
  const diff = SimpleCalendar.api.dateToTimestamp(data.date) - trackedDateTimeStamp;
  // 86400 seconds/day
  const diffInDays = Math.floor(diff / 86400);
  console.log(`Difference in days: ${diffInDays}`);
  await updateBastions(diffInDays);
  await game.settings.settings.set("mountain-module.time-tracker", SimpleCalendar.api.currentDateTime());
});

async function updateBastions(days) {
  const players = game.actors.filter(actor => actor.type === "character");
  for (const player of players) {
    const facilities = player.items.filter(item => item.type === "facility" && item.system.progress.max !== null);
    for (const facility of facilities) {
      console.log(facility);
      
      const newValue = facility.system.progress.value + days;
      await facility.update({ "system.progress.value": newValue });
      
      console.log(facility.system.progress);
    }
  }
}