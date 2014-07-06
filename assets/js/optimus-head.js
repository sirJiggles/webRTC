// class for the optimus head logic (used in the face swap example)

var OptimusHead = function(){

	this.width = 340;
	this.height = 502;
	this.outputWidth = 340;
	this.outputHeight = 502;
	this.widthToHeight = (2/4);
	this.img = new Image();
	this.img.src = 'assets/img/optimus-head.png';

	// set up our canvas tag
	this.canvas = document.getElementById('canvas');
	this.ctx = this.canvas.getContext('2d');
}

// update function is called with positions from the face tracker 
OptimusHead.prototype.update = function(positions) {
	
	// first thing we need to do is work out how big the render of the optimus face should be,
	// this is done by measuring the disatance from ear to ear, we will also get center point from this

	// distance from 0x to 14x (ear to ear)
	var faceWidth = positions[14][0] - positions[0][0],
		factor = faceWidth / 10,
		centerPoint = (positions[14][0] + faceWidth / 2);

	// we have a factor as thr mask is a little bigger than our head
	this.outputWidth =  faceWidth + factor;
	this.outputHeight = this.outputWidth / this.widthToHeight;

	// draw the image in the correct place
	this.ctx.drawImage( this.img, 
						0, 
						0, 
						this.width, 
						this.height, 
						centerPoint + (this.outputWidth / 2), 
						centerPoint + this.outputHeight, 
						this.outputWidth, 
						this.outputHeight);
};
