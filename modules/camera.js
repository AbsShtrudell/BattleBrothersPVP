import { Node } from "./node.js";
import { M3x3 } from "./matrix_math.js";

export class Camera extends Node{

    worldSpaceMatrix = new M3x3().transition(0, 0);
    width;
    height;

    constructor(width, height, owner = null){
        super(owner);

        this.width = width;
        this.height = height;

        let wRatio = (this.height*9/16);
        this.worldSpaceMatrix = new M3x3().transition(0, 0).scale(2/width,-2/this.height );
    }

    keyboardevents(key){
        switch(key) {
        case 83:
            this.move(0, 2)
            //console.log("s");
            break;
        case 87:
            this.move(0, -2)
            //console.log("w");
            break;
        case 65:
            this.move(-2, 0)
            //console.log("a");
            break;
        case 68:
            this.move(2, 0)
            //console.log("d");
            break;
        }
    }
    
    move(x, y){
        super.move(x, y);
        this.worldSpaceMatrix = this.worldSpaceMatrix.transition(-1 * x, -1 * y);
    }
}