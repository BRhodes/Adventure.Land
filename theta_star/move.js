var GRAPH_RESOLUTION;
var min_x;
var max_x;
var min_y;
var max_y;
var obstacles;
var map_region;
var _map;


function InitThetaStar() {
  //other inits
  GRAPH_RESOLUTION = 10;

  min_x = Infinity;
  max_x = -Infinity;
  min_y = Infinity;
  max_y = -Infinity;

  obstacles = [];

  // mapping data Init
  for (let line of parent.M.x_lines) {
      min_x = Math.min(min_x, line[0]);
      max_x = Math.max(max_x, line[0]);
      obstacles.push(new Box(line[0] - 3, Math.min(line[1], line[2]) - 3, line[0] + 3, Math.max(line[1], line[2]) + 7));
  }

  for (let line of parent.M.y_lines) {
      min_y = Math.min(min_y, line[0]);
      max_y = Math.max(max_y, line[0]);
      obstacles.push(new Box(Math.min(line[1], line[2]) - 3, line[0] - 3, Math.max(line[1], line[2]) + 3, line[0] + 7));
  }

  map_region = new Box(min_x, min_y, max_x, max_y);
  map_region.square();

  _map = new NodeTree(map_region, obstacles);
}

// part of the "move"
function find_path(source, target) {
    let closed = new Set();
    let open = new Set();

    let traveled = new Map();
    let heuristic = new Map();
    let parents = new Map();

    open.add(source);

    traveled.set(source, 0);
    heuristic.set(source, distance(source, target));
    parents.set(source, source);

    while (open.size) {
        let current = null;
        let min_heuristic = Infinity;

        for (let node of open) {
            let node_heuristic = heuristic.get(node);

            if (node_heuristic < min_heuristic) {
                min_heuristic = node_heuristic;
                current = node;
            }
        }

        if (current == target) {
            break;
        }

        open.delete(current);
        closed.add(current);

        for (let neighbor of current.get_neighbors()) {
            if (closed.has(neighbor)) continue;

            let old_path = traveled.get(neighbor);
            if (!open.has(neighbor)) {
                old_path = Infinity;
                open.add(neighbor);
            }

            let parent = parents.get(current);
            if (parent.has_sight(neighbor)) {
                let parent_path = traveled.get(parent) + distance(parent, neighbor);
                if (parent_path < old_path) {
                    parents.set(neighbor, parent);
                    traveled.set(neighbor, parent_path);
                    heuristic.set(neighbor, parent_path + distance(neighbor, target));
                }
            } else {
                let new_path = traveled.get(current) + distance(current, neighbor);
                if (new_path < old_path) {
                    parents.set(neighbor, current);
                    traveled.set(neighbor, new_path);
                    heuristic.set(neighbor, new_path + distance(neighbor, target));
                }
            }
        }
    }

    if (!parents.has(target)) return [];

    let path = [];
    let current = target;
    while (current && current != source) {
        path.unshift(current);
        current = parents.get(current);
    }

    return path;
}


function TSMove(x, y) {
  var current_node = _map.get(character.real_x, character.real_y);
  var target_node = _map.get(x, y);

  var path = find_path(current_node, target_node);

  path.unshift(current_node);

  // drawings = [];
  // for (let i = 0; i < path.length - 1; i++) {
  //     let n1 = path[i];
  //     let n2 = path[i + 1];
  //     let line = draw_line(n1.x, n1.y, n2.x, n2.y, 3);
  //     drawings.push(line);
  //     //map.addChild(line);
  // }

  var cur_point = 0;
  var move_interval = setInterval(() => {
      if (character.moving) return;

      if (cur_point == path.length) {
          clearInterval(move_interval);
          drawings.forEach(e => e.destroy());
          drawings = [];
      } else {
          let node = path[cur_point++];
          move(node.x, node.y);
      }
  }, 1000 / 20);
}
