Hooks.once('ready', () => {
    console.log('Ready!');
    game.settings.register('tim-qol', 'time-tracker', {
        name: 'Time Tracker',
        scope: 'world',
        config: false,
        default: game.time.worldTime,
    });
});
