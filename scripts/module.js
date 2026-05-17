let currentDate;
Hooks.once("ready", () => {
  console.log("Ready!");
  console.log(game.actors.filter(a => a.type !== "npc")[0].items.contents.filter(item => item.type === "facility"));
});

Hooks.once(SimpleCalendar.Hooks.Ready, () => {
  const date = SimpleCalendar.api.currentDateTimeDisplay();
  currentDate = SimpleCalendar.api.dateToTimestamp({});
  console.log(currentDate);
  ChatMessage.create({
    content: `The module has loaded current in-game time is: ${date.date} ${date.time}`,
    speaker: ChatMessage.getSpeaker({ alias: "Mountains" }),
  });
});