	class CameraPan{
		constructor(svgObject, newViewBox, seconds){
			var currentViewBox = svgObject.getAttribute("viewBox");
			this.svg = svgObject;
			this.milliseconds = seconds * 1000;
			this.startTime;
			var currentViewBoxCords = currentViewBox.split(" ");
			var newViewBoxCords = newViewBox.split(" ");
			this.minx = parseFloat(currentViewBoxCords[0]);
			this.minxDistance = parseFloat(newViewBoxCords[0]) - this.minx;
			this.miny =	parseFloat(currentViewBoxCords[1]);
			this.minyDistance = parseFloat(newViewBoxCords[1]) - this.miny;
			this.width = parseFloat(currentViewBoxCords[2]);
			this.widthDistance = parseFloat(newViewBoxCords[2]) - this.width;
			this.height = parseFloat(currentViewBoxCords[3]);
			this.heightDistance = parseFloat(newViewBoxCords[3]) - this.height;
			this.frameAmountLog = 0;
		}
	}
	//use a queue in case multiple calls are made without others finishing
	var queue = new Array();
	var lastUpdate = Date.now();
	var fps = 1000/60;
	
	function tick(){
		//console.log("tick");
		var currentTime = Date.now();
		//check we're not going over the FPS
		if ( currentTime < (lastUpdate + fps)){
			//we will go over 60fps, skip to next tick;
			window.requestAnimationFrame(tick);
			return;
		}
		
		//if we've made it this far, it's time for a tick.
		//get our job from the top of the queue
		var currentPan = queue[0];
		currentPan.frameAmountLog++;
		//find how much time has passed to make animation time relative
		var timePassed = currentTime - currentPan.startTime;
		//use this to find the percentage of progress based on time passed
		var timePercent = timePassed / currentPan.milliseconds;
		//use the percentage to update the viewbox
		lastUpdate = currentTime;
		//make sure we haven't overextended 100%
		//console.log(timePercent);
		if ((timePercent < 1)){
			var newX = currentPan.minx + currentPan.minxDistance * timePercent;
			var newY = currentPan.miny + currentPan.minyDistance * timePercent;
			var newWidth = currentPan.width + currentPan.widthDistance * timePercent;
			var newHeight = currentPan.height + currentPan.heightDistance * timePercent;
			//console.log("viewBox", "" + newX + " " + newY + " " + newWidth + " " + newHeight);
			currentPan.svg.setAttribute("viewBox", "" + newX + " " + newY + " " + newWidth + " " + newHeight);
			window.requestAnimationFrame(tick);
		}else{
			var newX = currentPan.minx + currentPan.minxDistance;
			var newY = currentPan.miny + currentPan.minyDistance;
			var newWidth = currentPan.width + currentPan.widthDistance;
			var newHeight = currentPan.height + currentPan.heightDistance;
			currentPan.svg.setAttribute("viewBox", "" + newX + " " + newY + " " + newWidth + " " + newHeight);
			//remove first element from array because we're done
			queue.shift();
			console.log(currentPan.frameAmountLog);
			if (queue.length > 0){
				queue[0].startTime = Date.now();
				window.requestAnimationFrame(tick);
			}
		}
		
		
		
	}
	
	function pan(svgObject, newViewBox, seconds){
		//create camera pan object
		var p = new CameraPan(svgObject, newViewBox, seconds);
		//add to the queue
		queue.push(p);
		//start animation
		if (queue.length == 1){
			//check if animation on this object has started
			p.startTime = Date.now();
			window.requestAnimationFrame(tick);
		}
	}
