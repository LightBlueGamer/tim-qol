import { bastionReward } from './bastion-rewards.js';

Hooks.on('updateWorldTime', async (time) => {
    const trackedTime = game.settings.settings.get('tim-qol.time-tracker').default;
    const calSettings = game.time.calendar.days;
    const diff = time - trackedTime
    const days = Math.floor(diff / calSettings.secondsPerMinute / calSettings.minutesPerHour / calSettings.hoursPerDay);
    if(days >= 1 || days <= 1) {
        await updateBastions(days);
        game.settings.settings.set("tim-qol.time-tracker", {
            name: 'Time Tracker',
            scope: 'world',
            config: false,
            default: game.time.worldTime,
        })
    }
});

async function updateBastions(days) {
    const players = game.actors.filter((actor) => actor.type === 'character');
    for (const player of players) {
        const facilities = player.items.filter(
            (item) => item.type === 'facility' && item.system.progress.max !== null
        );
        for (const facility of facilities) {
            const newValue = Math.min(7, facility.system.progress.value + days);
            await facility.update({ 'system.progress.value': newValue });
            if (facility.system.progress.value >= facility.system.progress.max) {
                await bastionReward(player.id, facility.id);
                await facility.update({ 'system.progress.value': 0 });
            }
        }
    }
}
