import { M3x3, Point } from "./matrix_math.js";

"use strict"

export class Material{
    constructor(vs, fs){
        this.gl = window.engine.getGl();
        let vsShader = this.getShader(vs, this.gl.VERTEX_SHADER);
		let fsShader = this.getShader(fs, this.gl.FRAGMENT_SHADER);

        if(vsShader && fsShader){
            this.program = this.gl.createProgram();
            this.gl.attachShader(this.program, vsShader);
            this.gl.attachShader(this.program, fsShader)
            this.gl.linkProgram(this.program)
        }
        if(!this.gl.getProgramParameter(this.program ,this.gl.LINK_STATUS)){
            console.error("Cannot load shader \n"+this.gl.getProgramInfoLog(this.program));
            return null;
        }
        this.gl.detachShader(this.program, vsShader);
        this.gl.detachShader(this.program, fsShader);
        this.gl.deleteShader(vsShader);
        this.gl.deleteShader(fsShader);



        this.gl.useProgram(null);
    }

    getShader(script, type){
        let gl = this.gl;
		let output = gl.createShader(type);
		gl.shaderSource(output, script);
		gl.compileShader(output);
		
		if(!gl.getShaderParameter(output, gl.COMPILE_STATUS)){
			console.error("Shader error: \n:" + gl.getShaderInfoLog(output));
			return null;
		}
		
		return output;
    }
}

export class Sprite{
    owner;
    gl;
    material;
    zValue = 0;
    size = new Point(64, 64);
    location = new Point(0, 0);
    frame = new Point(0, 0);
    isCollide = true;
    
    constructor(owner, img_url, vs, fs, frameX, frameY, opts={}){
        this.owner = owner;
        this.gl = window.engine.getGl();
        this.isLoaded = false;

        this.material = new Material(vs, fs);

        this.frame.x = frameX;
        this.frame.y = frameY

        if("z" in opts){
            this.zValue = opts.z;
        }
        if("width" in opts){
            this.size.x = opts. width * 1;
        }
        if("height" in opts){
            this.size.y = opts.height * 1;
        }
        if("locX" in opts){
            this.location.x = opts.locX;
        }
        if("locY" in opts){
            this.location.y = opts.locY;
        }
        if("collide" in opts){
            this.isCollide = opts.collide;
        }

        this.image = new Image();
        this.image.src = img_url;
        this.image.sprite = this;
        this.image.onload = function(){
            this.sprite.setup();
        }
    }

    static createRectArray(x =0, y =0, w =1, h =1){
        return new Float32Array([
            x,y,
            x+w,y,
            x,y+h,
            x,y+h,
            x+w,y,
            x+w,y+h
        ]);
    }

    setup(){
        let gl = this.gl;

        gl.useProgram(this.material.program);
        this.gl_tex = gl.createTexture();

        gl.bindTexture(gl.TEXTURE_2D, this.gl_tex);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_SHORT_5_5_5_1, this.image);
		gl.bindTexture(gl.TEXTURE_2D, null);

        this.uv_x = this.size.x / this.image.width;
        this.uv_y = this.size.y / this.image.height;

        this.tex_buff = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.tex_buff);
		gl.bufferData(gl.ARRAY_BUFFER, Sprite.createRectArray(0, 0, this.uv_x, this.uv_y), gl.STATIC_DRAW);

        this.geo_buff = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.geo_buff);
		gl.bufferData(gl.ARRAY_BUFFER, Sprite.createRectArray(0, 0, this.size.x, this.size.y), gl.STATIC_DRAW);

        this.aPositionLoc = gl.getAttribLocation(this.material.program, "a_position");
        this.aTexcoordLoc = gl.getAttribLocation(this.material.program, "a_texCoord");
        this.uImageLoc = gl.getUniformLocation(this.material.program, "u_image");

        this.uFrameLoc = gl.getUniformLocation(this.material.program, "u_frame");
        this.uWorldLoc = gl.getUniformLocation(this.material.program, "u_world");
        this.uObjectLoc = gl.getUniformLocation(this.material.program, "u_object");
        
        gl.useProgram(null);
        this.isLoaded = true;
    }

    render(){
        if(this.isLoaded){
            let gl = this.gl;

            let frame_x = Math.floor(this.frame.x,) * this.uv_x;
            let frame_y = Math.floor(this.frame.y,) * this.uv_y;

            let ownerLocation = this.owner.getWorldLocation();
            let oMat = new M3x3().transition(this.location.x + ownerLocation.x, this.location.y + ownerLocation.y);

            gl.useProgram(this.material.program);

            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, this.gl_tex);
            gl.uniform1i(this.uImageLoc, 0);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.tex_buff);
            gl.enableVertexAttribArray(this.aTexcoordLoc);
            gl.vertexAttribPointer(this.aTexcoordLoc, 2, gl.FLOAT, false, 0, 0);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.geo_buff);
            gl.enableVertexAttribArray(this.aPositionLoc);
            gl.vertexAttribPointer(this.aPositionLoc, 2, gl.FLOAT, false, 0, 0);

            gl.uniform2f(this.uFrameLoc, frame_x, frame_y);
            gl.uniformMatrix3fv(this.uWorldLoc, false, window.engine.camera.worldSpaceMatrix.getFloatArray());
            gl.uniformMatrix3fv(this.uObjectLoc, false, oMat.getFloatArray());

            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 6);

            gl.useProgram(null);
        }
    }

    destroy(){
        this.material = null;
        this.owner = null;
    }

    isColliding(x, y){
        let ownerLocation = this.owner.getWorldLocation();
        if(x >= ownerLocation.x && x <= ownerLocation.x + this.size.x)
            if(y >= ownerLocation.y && y <= ownerLocation.y + this.size.y) return true;
        else return false
    }
}