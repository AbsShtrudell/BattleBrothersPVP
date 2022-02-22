import { Node } from "./node.js"
import { Obj } from "./obj.js";

export class EventDispatcher{

    keys = [];
    mouseCliked = false;

    constructor(){
        let self = this;
        window.addEventListener("keydown", function(event){
			self.addKyes(event);
        }, true);

        window.addEventListener('keyup', function(event){
            self.removeKeys(event);
        }, true);

        window.engine.getCanvas().addEventListener('click', function(event){
            self.mouseClick(event);
        }, true);
    }

    addKyes(event){
        if (event.defaultPrevented) {
            return; 
        }
        this.keys[event.keyCode] = true;
        event.preventDefault();
    }

    removeKeys(event){
        this.keys[event.keyCode] = false;
    }

    mouseClick(event){
        let x = event.clientX - window.engine.getCanvas().offsetLeft + 1;
        let y = event.clientY - window.engine.getCanvas().offsetTop + 0;
        let xWorld;
        if(x < window.engine.camera.width/2){
            xWorld = window.engine.camera.getWorldLocation().x - (window.engine.camera.width/2 - x);
        } else if( x > window.engine.camera.width/2){
            xWorld = window.engine.camera.getWorldLocation().x + (x - window.engine.camera.width/2);
        } else xWorld = window.engine.camera.getWorldLocation().x;
        let yWorld;
        if(y < window.engine.camera.height/2){
            yWorld = window.engine.camera.getWorldLocation().y - (window.engine.camera.height/2 - y);
        } else if( y > window.engine.camera.height/2){
            yWorld = window.engine.camera.getWorldLocation().y + (y - window.engine.camera.height/2);
        } else yWorld = window.engine.camera.getWorldLocation().y;

        console.log(xWorld + " " + yWorld);
        Obj.allObjects.forEach(element => {
            if(element.isColliding(xWorld, yWorld))element.mouseClickEvent()
        });
    }
}