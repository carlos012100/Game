export default class Physics {
    constructor(vLimit, omega = 0, angle = 0, yRef = 0) {
        this.vx = 0; // Ensure vx is initialized
        this.vy = 0;
        this.vLimit = vLimit;
        this.omega = omega; // Angular velocity
        this.angle = angle; // Current angle
        this.yRef = yRef; // Reference Y position
    }
}