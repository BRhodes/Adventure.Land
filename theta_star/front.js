const graph_cache = {};

async function go_to_point(point) {
    if (character.map != point.map) {
      await Transport(point.map);
    }

    if (!graph_cache[point.map]) {
        console.time('Initialize Graph');
        graph_cache[point.map] = initialize_graph(point.map);
        console.timeEnd('Initialize Graph');
    }

    let map = graph_cache[point.map];

    let current_node = map.get(character.real_x, character.real_y);
    let target_node = map.get(point.x, point.y);

    let current_virtual = new VirtualNode(current_node, character.real_x, character.real_y);
    let target_virtual = new VirtualNode(target_node, point.x, point.y);

    console.time('Find path');
    let path = find_path(current_virtual, target_virtual);
    console.timeEnd('Find path');

    current_virtual.destroy();
    target_virtual.destroy();

    while (path.length) {
        let target = path.shift();
        move(target.x, target.y);

        while (character.moving) {
            await sleep(1000 / 20);
        }

        if (character.real_x - target.x > .5 || character.real_y - target.y > .5)
          break;
    }
}
