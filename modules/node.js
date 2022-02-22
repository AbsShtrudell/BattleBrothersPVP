import { Material, Sprite } from "./material.js";
import { Point } from "./matrix_math.js";

"use strict"

export class Node{

    static  allNodes = [];

    children = [];
    #size = new Point(1,1);
    #location = new Point(0,0);
    #owner;

    constructor(owner){
        this.#owner =  owner;
        if(owner != null) this.#owner.attachChild(this);

        Node.allNodes.push(this);
    }

    destroy(){
        this.#owner = null;
        for(let i = 0; i < Node.allNodes.length; i++){
            if(Node.allNodes[i] == this) Node.allNodes.splice(i, 1);
            break;
        }
        for(let i = 0; i < this.children.length; i++){
            this.children[i].destroy();
            this.children.splice(i, 1);
        }
    }

    begin(){}
    update(){}
    keyboardevents(key){}
    mouseClickEvent(){}
    
    getWorldLocation(){
        if(this.#owner != null) {
            let loc = this.#location.add(this.#owner.getWorldLocation());
            return new Point(loc.x, loc.y)
        }
        else return new Point(this.#location.x, this.#location.y);
    }

    getRelativeLocation(){
        return new Point(this.#location.x, this.#location.y);
    }

    setWorldLocation(x, y){
        let loc = this.getWorldLocation();
        x = x - loc.x;
        y = y - loc.y;
        this.move(x, y);
    }

    setRelativeLocation(x, y){
        this.#location.x = x;
        this.#location.y = y;
    }

    move(x, y){
        this.#location.x += x;
        this.#location.y += y;
    }

    setRelativeSize(x, y){
        this.size.x = x;
        this.size.y = y;
    }

    setWorldSize(x, y){
        let sz = this.getWorldSize();
        x = x / sz.x;
        y = y / sz.y;
        this.setRelativeSize(x, y);
    }

    getRelativeSize(){
        return new Point(this.#size.x, this.#size.y)
    }

    getWorldSize(){
        if(this.#owner != null){
        let sz = this.#size.multi(this.#owner.getWorldSize());
        return new Point(sz.x, sz.y);
        }
        else return new Point(this.#size.x, this.#size.y);
    }

    getOwner(){
        return this.#owner;
    }

    setOwner(owner){
        if(owner != this && this.#owner != owner){
            this.#owner = owner;
        }
    }

    attachChild(child){
        if(child != null && child != this){
            let isChild = false;
            this.children.forEach(element => {
               isChild = child == element ? true : false;
            });
            if(!isChild){
                this.children.push(child);
                child.setOwner(this);
            }
        }
    }

    attachTo(parent){
        if(parent != null && parent != this && parent != this.#owner){
            parent.children.push(this);
            this.setOwner(parent);
        } 
    }

    detachChild(child){
        if(child != null && child != this){
            for(let i = 0; i < this.children.length; i++){
                if(child == this.children[i]) this.children.remove(i);
            }
            child.setOwner(null);
        }
    }

    detachFrom(){
        if(parent != null){
            this.#owner.detachChild(this);
        }
    }
}