Hooks.on("ready", async function () {
  await ChatMessage.create({
    content: `The module has loaded current in-game time is: ${date.year} ${date.month} ${date.day} ${date.hour}:${date.minute}:${date.seconds}`,
  })
});

Hooks.on(SimpleCalendar.Hooks.Ready, () => {
  const date = SimpleCalendar.api.currentDateTime();
  ChatMessage.create({
    content: `The module has loaded current in-game time is: ${date.year} ${date.month} ${date.day} ${date.hour}:${date.minute}:${date.seconds}`,
    speaker: ChatMessage.getSpeaker({ alias: "Mountains" }),
  })
})