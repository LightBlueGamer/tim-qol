Hooks.once('ready', () => {
    console.log('Ready!');
    console.log(game.time.components);
    game.settings.register('tim-qol', 'time-tracker', {
        name: 'Time Tracker',
        scope: 'world',
        config: false,
        default: game.time.worldTime,
    });
});
