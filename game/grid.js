import { Node } from "../modules/node.js";
import { Cell } from "./cell.js";
import { Point } from "../modules/matrix_math.js";

export class Grid extends Node{

    grid;
    width;
    height;
	neigbours = [new Point(1, 1), new Point(1, 0), new Point(0,1),new Point(-1, 0),new Point(-1, 1), new Point(0, -1)];
	constructor(width, height, owner = null){
		super(owner);

        this.width = width;
        this.height = height;

        this.grid = [];
        this.generate()
    }

    generate(){

        for (let i = 0; i < this.width; i++) {
			let list = []
            for (let j = 0; j < this.height; j++) { 
            list[j] = new Cell(this);
            list[j].setRelativeLocation(i * 124, j * 82 - (i % 2 ?44 : 0));
            list[j].zValue = i;
			list[j].coords = new Point(i, j);
            }
            this.grid[i] = list;
        }

    }
}