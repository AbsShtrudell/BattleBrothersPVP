import { M3x3, Point } from "./matrix_math.js"
import { Material, Sprite } from "./material.js"
import { Node } from "./node.js"
import { Camera } from "./camera.js"
import { EventDispatcher } from "./eventdispatcher.js"
import { Obj } from "./obj.js"
import { Grid } from "../game/grid.js"

"use strict"

export class Engine{
    constructor(){
    }
    #canvas
    #canvasFps
    #ctx
    #gl
    #deltatime
    #oldtime
    camera;

    init(width, height){
        this.#canvas = document.getElementById("canvas");
        this.#canvas.height = height;
        this.#canvas.width = width;
        this.#canvasFps = document.getElementById("text");
        this.#ctx = this.#canvasFps.getContext("2d");
        this.camera = new Camera(this.#canvas.width, this.#canvas.height);

        this.#gl = this.#canvas.getContext("webgl2");
        if (!this.#gl) {
            alert("Unable to initialize WebGL. Your browser may not support it.");
            this.#gl = null;
        }
        
        this.#gl.viewport(0, 0, this.#canvas.width, this.#canvas.height);
        this.#gl.clearColor(0.5,0.1,1,1);

        this.#gl.enable(this.#gl.BLEND);
        this.#gl.blendFunc(this.#gl.SRC_ALPHA, this.#gl.ONE_MINUS_SRC_ALPHA);

        this.test();
    }

    test(){
        this. events = new EventDispatcher();

        //this.node = new Node();
        //this.node1 = new Node(this.node);
        //this.node2 = new Node();
        //this.obj = new Obj();
        this.grid = new Grid(10, 10)
        let p1 = new Point(1, 1)
        let p2 = new Point(10, 5)
        let n = new Node();
        let n1 = new Node();
        console.log(n == n1);
        //console.log(Grid.calcHeuristic(p1, p2));
    }

    start(){
        this.#oldtime = Date.now();

        let self = this;
        setInterval(calculateForDeltaHere, 15);

        function calculateForDeltaHere () {
            self.#main_loop();
        }
    }

    getGl(){
        return this.#gl;
    }

    getCanvas(){
        return this.#canvas;
    }

    resize(x, y){
        this.#canvas.width = x;
        this.#canvas.height= y;
        this.#gl.viewport(0, 0, this.#canvas.width, this.#canvas.height);
    }
    
    #render(){
        this.#gl.clear(this.#gl.COLOR_BUFFER_BIT);

        Obj.allObjects.forEach(element => {
            element.render();
        });
        
        this.#ctx.clearRect(0, 0, this.#ctx.canvas.width, this.#ctx.canvas.height);
        this.#ctx.fillText(1/this.#deltatime, 12, 12, 16);
        this.#gl.flush();
    }

    #update(){
        Node.allNodes.forEach(element => {
            element.update();
            for(let i = 0; i < this.events.keys.length; i++){
                if(this.events.keys[i]) element.keyboardevents(i); 
            }
        });
    }

    #main_loop(){ 
        this.#render();
        this.#update();
        this.#deltatime = (Date.now() - this.#oldtime)/1000;
        this.#oldtime = Date.now(); 
    }
}
