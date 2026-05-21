export async function bastionReward(actor, type, size) {
    type = type.toLowerCase();
    size = size.toLowerCase();
    actor = game.actors.get(actor);
    switch (type) {
        case "barrack": {
            if(size === "roomy") {
                const facility = actor.items.find(i => i.type === "facility" && i.name.toLowerCase() === "barrack");
                if(facility.system.defenders.max !== 12) facility.system.defenders.max = 12;
                facility.system.defenders;
            } else if(size === "vast") {
            }
            break;
        }
    }
}