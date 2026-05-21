Hooks.once('ready', () => {
    console.log('Ready!');
    console.log(
        game.actors.find((a) => a.type === 'character').items.filter((f) => f.type === 'facility')
    );
});

Hooks.once(SimpleCalendar.Hooks.Ready, async () => {
    game.settings.register('mountain-module', 'time-tracker', SimpleCalendar.api.currentDateTime());
});
