import { bastionDefender } from './ids.js';
export async function bastionReward(actorId, type, size) {
    console.log('=== bastionReward called ===');
    console.log('actorId:', actorId);
    console.log('type (before):', type);
    console.log('size (before):', size);
    type = type.toLowerCase();
    size = size.toLowerCase();
    const actor = game.actors.get(actorId);
    switch (type) {
        case 'barrack': {
            console.log(`Rewarding ${actor.name} for completing a ${size} barrack`);
            const facility = actor.items.find(
                (i) => i.type === 'facility' && i.name.toLowerCase() === 'barrack'
            );

            if (!facility) {
                ui.notifications.warn('Barrack facility not found');
                break;
            }

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
    }
}
