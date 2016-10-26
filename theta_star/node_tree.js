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
