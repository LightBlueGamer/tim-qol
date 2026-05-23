import { bastionReward } from './bastion-rewards.js';

/*Hooks.on(SimpleCalendar.Hooks.DateTimeChange, async (data) => {
    console.log('DateTimeChange event detected');
    const trackedDateTimeStamp = SimpleCalendar.api.dateToTimestamp(
        game.settings.settings.get('mountain-module.time-tracker')
    );
    const diff = SimpleCalendar.api.dateToTimestamp(data.date) - trackedDateTimeStamp;
    // 86400 seconds/day
    const diffInDays = Math.floor(diff / 86400);
    await updateBastions(diffInDays);
    game.settings.settings.set(
        'mountain-module.time-tracker',
        SimpleCalendar.api.currentDateTime()
    );
    console.log(`Bastion progress updated by ${diffInDays} days`);
});*/

Hooks.on('updateWorldTime', (time) => {
    const trackedTime = game.settings.settings.get('tim-qol.time-tracker').default;
    console.log(game.time.calendar.difference(time, trackedTime));
});

async function updateBastions(days) {
    console.log(`Updating bastions with ${days} days`);
    const players = game.actors.filter((actor) => actor.type === 'character');
    for (const player of players) {
        const facilities = player.items.filter(
            (item) => item.type === 'facility' && item.system.progress.max !== null
        );
        for (const facility of facilities) {
            console.log(facility);

            const newValue = Math.min(7, facility.system.progress.value + days);
            await facility.update({ 'system.progress.value': newValue });
            if (facility.system.progress.value >= facility.system.progress.max) {
                await bastionReward(player.id, facility.name, facility.system.size);
                await facility.update({ 'system.progress.value': 0 });
            }
        }
    }
}
