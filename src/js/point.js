export class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    distance(p1, p2) {
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        return Math.hypot(dx, dy);
    }
    distanceTo(p) {
        return this.distance(this, p);
    }
    asArray() {
        return [this.x, this.y];
    }
    moveX(dx) {
        return new Point(this.x + dx, this.y);
    }
    moveY(dy) {
        return new Point(this.x, this.y + dy);
    }
    move(dx, dy) {
        return new Point(this.x + dx, this.y + dy);
    }
}
