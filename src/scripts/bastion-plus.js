import { bastionReward } from './bastion-rewards.js';
import { DialogV2 } from './module.js';

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

Hooks.on('dnd5e.preActivityConsumption', async (activity, usageConfig, messageConfig) => {
    console.log(activity, messageConfig)
    const facility = messageConfig.data.flags.dnd5e;
    const actor = game.actors.get(facility.item.uuid.split(".")[1]);
    const facilityItem = actor.items.get(facility.item.id);
    const level = actor.items.filter(i => i.type === "class").reduce((acc, curr) => acc + curr.system.levels, 0);
    const maxAmount = level >= 13 ? 5000 : level >= 9 ? 2000 : 500;
    const name = facilityItem.name.toLowerCase();
    const type = facility.activity.type;
    const order = activity.order;
    if(name === "storehouse" && type === "order") {
        if(Math.floor(facility.order.costs.gold) <= 0) {
            DialogV2.prompt({
                title: "Storehouse",
                content: "Sire, we cannot trade without any gold."
            });
            return false
        } else if(Math.floor(facility.order.costs.gold) > maxAmount) {
            DialogV2.prompt({
                title: "Storehouse",
                content: "Sire, we cannot hold that much gold for you."
            });
            return false
        } else if(actor.system.currency.gp < Math.floor(facility.order.costs.gold)) {
            DialogV2.prompt({
                title: "Storehouse",
                content: "Sire, I'm afraid you don't have the funds to trade with."
            });
            return false
        } else setStorehouseTradeValue(actor.id, facilityItem.id, facility.order.costs.gold);
    } else if(name === "garden" && type === "order") {
        if(!facilityItem?.flags?.["tim-qol"]?.["bastion-plus"]?.type) {
            let gardenType;
            try {
                gardenType = await DialogV2.prompt({
                    window: { title: "Garden" },
                    content: `
                        No harvest type has been set for this garden sire, please tell us what you'd like to harvest.
                        <label><input type="radio" name="choice" value="decorative" checked> Decorative</label>
                        <label><input type="radio" name="choice" value="food"> Food</label>
                        <label><input type="radio" name="choice" value="herb"> Herbs</label>
                        <label><input type="radio" name="choice" value="poison"> Poisons</label>
                    `,
                    ok: {
                        label: "Submit Type",
                        callback: (event, button, dialog) => button.form.elements.choice.value
                    }
                })
            } catch (error) {
                return false;
            }

            facilityItem.update({
                "flags": {
                    "tim-qol": {
                        "bastion-plus": {
                            "type": gardenType
                        }
                    }
                }
            });
            console.log(facilityItem.flags)
        }
        console.log(facilityItem, order);
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


function setStorehouseTradeValue(actorId, facilityId, amount) {
    const { actor, facility } = getActorAndFacility(actorId, facilityId);
    actor.update({
        "system.currency.gp": actor.system.currency.gp - amount,
    })
    
    facility.setFlag("tim-qol", "bastion-plus", {
        "storehouseGold": amount
    })
}

function setGardenType(actorId, facilityId) {
    
}

function getActorAndFacility(actorId, facilityId) {
    const actor = game.actors.get(actorId);
    const facility = actor.items.get(facilityId);
    return { actor, facility };
}