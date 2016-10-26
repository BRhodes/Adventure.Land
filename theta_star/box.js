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
