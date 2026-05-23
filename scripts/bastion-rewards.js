import { bastionDefender } from './ids.js';
export async function bastionReward(actorId, facilityId) {
    const actor = game.actors.get(actorId);
    const facility = actor.items.get(facilityId);
    const type = facility.name.toLowerCase();
    const size = facility.system.size.toLowerCase();
    switch (type) {
        case 'barrack': {
            if (size === 'roomy') {
                facility.system.defenders.max = 12;
                for (let i = 0; i < 4; i++) {
                    if (facility.system.defenders.value.length >= 12) break;
                    facility.system.defenders.value.push(bastionDefender);
                }
            } else if (size === 'vast') {
                facility.system.defenders.max = 25;
                for (let i = 0; i < 4; i++) {
                    if (facility.system.defenders.value.length >= 25) break;
                    facility.system.defenders.value.push(bastionDefender);
                }
            }
            await facility.update({
                'system.defenders.value': facility.system.defenders.value,
                'system.defenders.max': facility.system.defenders.max,
                'system.order': 'recruit',
                'system.progress.max': null,
                'system.progress.value': 0,
                'system.progress.order': '',
            });
            break;
        }

        case 'storehouse': {
            const level = actor.items.filter(i => i.type === "class").reduce((acc, curr) => acc + curr.system.levels, 0);
            const goldInput = facility.flags["tim-qol"]["bastion-plus"].storehouseGold;
            const payoutGold = goldInput * (level >= 17 ? 2 : level >= 13 ? 1.5 : level >= 9 ? 1.2 : 1.1);
            const totalSilver = Math.round(payoutGold * 10);
            const gold = Math.floor(totalSilver / 10);
            const silver = totalSilver % 10;

            await actor.update({
                "system.currency.gp": actor.system.currency.gp + gold,
                "system.currency.sp": actor.system.currency.sp + silver
            })

            await facility.update({
                'system.order': 'trade',
                'system.progress.max': null,
                'system.progress.value': 0,
                'system.progress.order': '',
                'flags.tim-qol.bastion-plus.storehouseGold': 0
            });
        }
    }
}
