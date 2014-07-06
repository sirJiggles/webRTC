/* Sound modifier file, this uses audio API to modify sound output */

var soundModifier = function(){
	

};

soundModifier.prototype.init = function(){

	/*window.AudioContext = window.AudioContext || window.webkitAudioContext;
    var context = new AudioContext(),
    	microphone = context.createMediaStreamSource(stream),
    	filter = context.createBiquadFilter();

    /*filter.type = 4;
    //filter.Q.value = 20;
   	filter.frequency.value = 1000;
   	filter.gain.value = 20;
   	
   	// add a delay to get it all transformerie
 	var delay = context.createDelayNode();
   	delay.delayTime.value = 0.2;

   	//microphone.connect(filter);
   	//filter.connect(delay);
   	//delay.connect(context.destination);

   	var amountEchos = 10,
   		delays = [],
   		delayTime = 1;

   	for(var i = 1; i <= amountEchos; i ++){
   		delays[i] = context.createDelayNode();
   		delays[i].delayTime = delayTime + i;
   		if(delays[i -1]){
   			delays[i].connect(delays[i-1]);
   		}
   		//if(i === 1){
   			microphone.connect(delays[i]);
   		//}else{
   		//	delays[i].connect(delays[i - 1]);
   		//}
   	}
   	console.log(delays);
   	delays[amountEchos].connect(context.destination);*/

   
}

