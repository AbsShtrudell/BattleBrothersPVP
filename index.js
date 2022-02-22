import { Engine } from "./modules/engine.js";

window.addEventListener("load", function(){
	window.engine = new Engine();
    window.engine.init(1000,600);
    window.engine.start();
});