import { Obj } from "../modules/obj.js";
import { Sprite } from "../modules/material.js";
import { Point } from "../modules/matrix_math.js";

export class Cell extends Obj{
	weight = 1;
	level = 0;
	coords = new Point(0, 0);

	constructor(owner = null){
		super(owner);
		
		let sprite1 = new Sprite(this, "resurses/terrain.png", document.getElementById("vs_01").textContent,document.getElementById("fs_01").textContent, 0, 3, {width: 180, height:121, z:0});
		
		this.addSprite(sprite1);
    }
}
