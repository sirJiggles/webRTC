/* Sound modifier file, this uses audio API to modify sound output */

var soundModifier = function(){
	

};

soundModifier.prototype.init = function(){

	window.AudioContext = window.AudioContext || window.webkitAudioContext;
    var context = new AudioContext(),
    	microphone = context.createMediaStreamSource(stream),
    	filter = context.createBiquadFilter();

    filter.type = 3;
   	filter.frequency.value = 440;
   	filter.gain.value = 15;
   	
   	// add a delay to get it all transformerie
 	var delay = context.createDelayNode();
   	delay.delayTime.value = 0.1;

   	microphone.connect(filter);
   	filter.connect(delay);
   	delay.connect(context.destination);

}

