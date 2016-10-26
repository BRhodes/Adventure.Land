function Box(x1, y1, x2, y2) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
}

Box.prototype.square = function() {
    let h_center = (this.x1 + this.x2) / 2;
    let v_center = (this.y1 + this.y2) / 2;

    let width = this.width();
    let height = this.height();
    let difference = Math.abs(height - width) / 2;

    if (width < height) {
        this.x1 -= difference;
        this.x2 += difference;
    } else {
        this.y1 -= difference;
        this.y2 += difference;
    }
}

Box.prototype.width = function() {
    return this.x2 - this.x1;
}

Box.prototype.height = function() {
    return this.y2 - this.y1;
}

Box.prototype.contains = function(x, y) {
    return this.x1 < x && x < this.x2 &&
           this.y1 < y && y < this.y2;
}

Box.prototype.intersects = function(box) {
    return (this.x1 <= box.x2 &&
            box.x1 <= this.x2 &&
            this.y1 <= box.y2 &&
            box.y1 <= this.y2)
}

Box.prototype.intersects_segment = function(start, end) {
    let dx = end.x - start.x;
    let dy = end.y - start.y;

    let len = Math.sqrt(dx * dx + dy * dy);

    let ndx = 1 / dx;
    let ndy = 1 / dy;

    let t1 = (this.x1 - start.x) * ndx;
    let t2 = (this.x2 - start.x) * ndx;
    let t3 = (this.y1 - start.y) * ndy;
    let t4 = (this.y2 - start.y) * ndy;

    let tmin = Math.max(Math.min(t1, t2), Math.min(t3, t4));
    let tmax = Math.min(Math.max(t1, t2), Math.max(t3, t4));

    if (tmax < 0) return false;
    if (tmin > 1) return false;

    return true;
}
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
function NodeTree(region, obstacles, root) {
    if (root) {
        this.root = root;
    } else {
        this.root = this;
    }

    this.region = region;

    this.x = (region.x1 + region.x2) / 2;
    this.y = (region.y1 + region.y2) / 2;

    this.obstacles = obstacles;
    this.subdivided = false;

    this.is_leaf = false;
    this.crossable = true;

    if (region.x2 <= min_x || region.x1 >= max_x ||
        region.y2 <= min_y || region.y1 >= max_y) {
        this.crossable = false;
    }

    if (region.width() <= GRAPH_RESOLUTION) {
        this.is_leaf = true;
        this.crossable = obstacles.length == 0;
    }

    this.quads = [];
    this.nodes = [];

    this.neighbors = null;
}

NodeTree.prototype.get_quad = function(x, y) {
    if (x < this.x && y < this.y) return this.quads[0];
    if (x > this.x && y < this.y) return this.quads[1];
    if (x < this.x && y > this.y) return this.quads[2];
    if (x > this.x && y > this.y) return this.quads[3];
}

NodeTree.prototype.subdivide = function() {
    this.subdivided = true;

    let l = this.region.x1;
    let r = this.region.x2;
    let t = this.region.y1;
    let b = this.region.y2;

    let x = this.x;
    let y = this.y;

    let subregions = [
        new Box(l, t, x, y),
        new Box(x, t, r, y),
        new Box(l, y, x, b),
        new Box(x, y, r, b),
    ];

    for (let i = 0; i < subregions.length; i++) {
        let subregion = subregions[i];
        let subregion_obstacles = [];

        for (let obstacle of obstacles) {
            if (subregion.intersects(obstacle)) {
                subregion_obstacles.push(obstacle);
            }
        }

        this.quads[i] = new NodeTree(subregion, subregion_obstacles, this.root);
    }
}

NodeTree.prototype.get = function(x, y) {
    if (!this.crossable || this.is_leaf) return this;

    if (!this.subdivided) {
        this.subdivide();
    }

    return this.get_quad(x, y).get(x, y);
}

NodeTree.prototype.get_neighbors = function() {
    if (!this.is_leaf) throw new Exception('Tried getting neighbors of non-leaf node');
    if (this.neighbors) return this.neighbors;

    this.neighbors = [];

    let x = this.x;
    let y = this.y;
    let width = this.region.width();
    let height = this.region.height();

    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (i == 0 && j == 0) continue;

            let neighbor = this.root.get(x + width * i, y + height * j);
            if (neighbor && neighbor.crossable) {
                this.neighbors.push(neighbor);
            }
        }
    }

    return this.neighbors;
}

NodeTree.prototype.get_containing = function(a, b) {
    let a_quad = this.get_quad(a.x, a.y);
    let b_quad = this.get_quad(b.x, b.y);

    if (a_quad == b_quad) return a_quad.get_containing(a, b);

    return this;
}

NodeTree.prototype.has_sight = function(node) {
  return false;
    let ancestor = this.root.get_containing(this, node);

    for (let obstacle of ancestor.obstacles) {
        if (obstacle.intersects_segment(this, node)) {
            return false;
        }
    }

    return true;
}
