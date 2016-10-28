const graph_cache = {};

// class Point {
//     constructor(map, x, y) {
//         this.x = x;
//         this.y = y;
//         this.map = map;
//     }
// }

function SmartMove(x, y, mapName) {
  Move.done = false;
  Move.dest_x = x;
  Move.dest_y = y;

  if (Move.currentPath) {
    Move.currentPath = null;
  }

  if (!mapName) mapName = character.map;

  if (!graph_cache[mapName]) graph_cache[mapName] = initialize_graph(mapName);

  let map = graph_cache[mapName];

  let current_node = map.get(character.real_x, character.real_y);
  let target_node = map.get(x, y);

  let current_virtual = new VirtualNode(current_node, character.real_x, character.real_y);
  let target_virtual = new VirtualNode(target_node, x, y);

  Move.currentPath = find_path(current_virtual, target_virtual);

  current_virtual.destroy();
  target_virtual.destroy();

  Move.target = current_virtual;
  move(Move.target.x, Move.target.y);

  Sleep(Move, 250);

  Move.pathInterval = setInterval(function() {
    if (character.moving) return;

    if (!Move.currentPath.length) {
      clearInterval(Move.pathInterval);
      Move.done = true;
      return;
    }

    // Unexpected movement (probably by the player), so cancel path movement.
    if (character.real_x != Move.target.x || character.real_y != Move.target.y) {
      clearInterval(move_interval);
      return;
    }

    Move.target = Move.currentPath.shift();
    move(Move.target.x, Move.target.y);
  });
}
