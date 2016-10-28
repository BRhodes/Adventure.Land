const graph_cache = {};

// class Point {
//     constructor(map, x, y) {
//         this.x = x;
//         this.y = y;
//         this.map = map;
//     }
// }

function SmartMove(x, y, mapName) {
  SmartMove.done = false;
  SmartMove.dest_x = x;
  SmartMove.dest_y = y;

  if (SmartMove.currentPath) {
    SmartMove.currentPath = null;
  }

  if (!mapName) mapName = character.map;

  if (!graph_cache[mapName]) graph_cache[mapName] = initialize_graph(mapName);

  let map = graph_cache[mapName];

  let current_node = map.get(character.real_x, character.real_y);
  let target_node = map.get(x, y);

  let current_virtual = new VirtualNode(current_node, character.real_x, character.real_y);
  let target_virtual = new VirtualNode(target_node, x, y);

  SmartMove.currentPath = find_path(current_virtual, target_virtual);

  current_virtual.destroy();
  target_virtual.destroy();

  SmartMove.target = current_virtual;
  move(SmartMove.target.x, SmartMove.target.y);

  Sleep(SmartMove, 250);

  SmartMove.pathInterval = setInterval(function() {
    if (character.moving) return;

    if (!SmartMove.currentPath.length) {
      clearInterval(SmartMove.pathInterval);
      SmartMove.done = true;
      return;
    }

    // Unexpected movement (probably by the player), so cancel path movement.
    if (character.real_x != SmartMove.target.x || character.real_y != SmartMove.target.y) {
      clearInterval(move_interval);
      return;
    }

    SmartMove.target = SmartMove.currentPath.shift();
    move(SmartMove.target.x, SmartMove.target.y);
  });
}
