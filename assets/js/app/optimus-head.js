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
		factor = faceWidth / 2.5,
		centerX = positions[41][0],
		centerY = positions[41][1],
		rotateBy = positions[0][1] - positions[14][1];

	// we have a factor as thr mask is a little bigger than our head
	this.outputWidth =  faceWidth + factor;
	this.outputHeight = this.outputWidth / this.widthToHeight;

	this.ctx.save();

	// set origin to the center of the image
	this.ctx.translate(centerX, centerY);

	// rotate the ctx
	this.ctx.rotate(-(rotateBy / 2) * (Math.PI / 180) );

	// translate back to top left
	this.ctx.translate(-centerX,-centerY);

	// draw the image in the correct place
	this.ctx.drawImage( this.img, 
						0, 
						0, 
						this.width, 
						this.height, 
						(centerX - (this.outputWidth / 2)) - (factor / 9), 
						(centerY - (this.outputHeight / 2)) - (factor / 1.4), 
						this.outputWidth, 
						this.outputHeight);


	// restore the origin for the context
	this.ctx.restore();


};