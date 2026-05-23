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

Hooks.on('dnd5e.preActivityConsumption', (activity, usageConfig, messageConfig) => {
    console.log(activity, messageConfig)
    const facility = messageConfig.data.flags.dnd5e;
    const actor = game.actors.get(facility.item.uuid.split(".")[1]);
    const facilityItem = actor.items.get(facility.item.id);
    const level = actor.items.filter(i => i.type === "class").reduce((acc, curr) => acc + curr.system.levels, 0);
    const maxAmount = level >= 13 ? 5000 : level >= 9 ? 2000 : 500;
    if(facilityItem.name.toLowerCase() === "storehouse" && facility.activity.type === "order") {
        if(facility.order.costs.gold <= 0) {
            Dialog.prompt({
                title: "Storehouse",
                content: "Sire, we cannot trade without any gold"
            });
            return false
        } else if(facility.order.costs.gold > maxAmount) {
            Dialog.prompt({
                title: "Storehouse",
                content: "Sire, we cannot hold that much gold for you."
            });
            return false
        }
    }
})

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