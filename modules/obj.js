import { Node } from "./node.js";
import { Sprite } from "./material.js";

export class Obj extends Node{
    static allObjects = [];

    sprites = [];
    zValue = 0;

    constructor(owner = null){
        super(owner);

        Obj.allObjects.push(this);
        Obj.sortAllObjects();
    }

    static sortAllObjects(){
        Obj.allObjects.sort(function ( a, b ) {
            if ( a.zValue > b.zValue ){
                return 1;
            }
            if ( a.zValue < b.zValue ){
                return -1;
            }
            return 0;
        })
    }

    render(){
        this.sprites.forEach(element => {
            element.render();
        });
    }

    sortSprites(){
        this.sprites.sort(function ( a, b ) {
            if ( a.zValue > b.zValue ){
                return 1;
            }
            if ( a.zValue < b.zValue ){
                return -1;
            }
            return 0;
        })
    }

    addSprite(sprite){
        if(sprite != null){
            let individual = true;
            this.sprites.forEach(element => {
                if(element == sprite) {
                    individual == false;
                }
            });
            if(individual) {
                this.sprites.push(sprite)
                this.sortSprites()
            }
        }
    }

    isColliding(x, y){
        for(let i = 0; i < this.sprites.length; i++){
            if(this.sprites[i].isColliding(x, y)) return true;
        }
        return false;
    }
}