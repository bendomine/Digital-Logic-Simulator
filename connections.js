// I can't decide which of these files is the most spaghetti-coded. If you have an opinion, please send me an email
// 		with your choice and the reasoning behind your decision!


// Basic initialization
let canvas = document.getElementById('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let ctx = canvas.getContext('2d');

// This function draws all the connecting lines between blocks. It's a visual representation of wires.
function updateLines(event){
	// Fit canvas (if the window was resized) and clear it.
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
	ctx.lineWidth = 3.5;
	let gradient;
	let x1;
	let x2;
	let y1;
	let y2;

	for (let i = 0; i < blocks.length; ++i){
		// I made the arbitrary decision to draw from output pins to input pins.
		if (blocks[i].type == "block") for (let j = 0; j < blocks[i].outPins.length; ++j){
			if (blocks[i].outPins[j] != null) for (let k = 0; k < blocks[i].outPins[j].connected.length; ++k){
				if (blocks[i].outPins[j].connected[k].ref != null){
					// This gets the position of the origin pin and the pin it's connecting to.
					// The transformations are because .right and .bottom get, logically, the right and bottom of the object.
					// Because each pin is 10x10, translating each line by (5, 5) centers each line in the pin.
					x1 = blocks[i].outPins[j].ref.getBoundingClientRect().right - 5;
					x2 = blocks[i].outPins[j].connected[k].ref.getBoundingClientRect().right - 5;
					y1 = blocks[i].outPins[j].ref.getBoundingClientRect().bottom - 5;
					y2 = blocks[i].outPins[j].connected[k].ref.getBoundingClientRect().bottom - 5;
					// Fancy!
					gradient = ctx.createLinearGradient(x1, y1, x2, y2);
					gradient.addColorStop(0, blocks[i].ref.style.backgroundColor);
					gradient.addColorStop(1, blocks[i].outPins[j].connected[k].ref.parentElement.style.backgroundColor);
					if (blocks[i].outPins[j].active || blocks[i].outPins[j].connected[k].active) ctx.strokeStyle = gradient;
					else ctx.strokeStyle = "black";
					ctx.beginPath();
					ctx.moveTo(x1, y1);
					ctx.lineTo(x2, y2);
					ctx.stroke();
				}
			}
		}
		// The sole purpose of this code is to draw whatever line is currently connected to the mouse cursor.
		// I did mess this code up a bit; the mouse is always the first element in the blocks array, so some of this
		// 		logic is unnecessary.
		// Also, there's a loop here. Theoretically it won't be needed, as there should be no way to connect multiple
		//		lines to the mouse cursor at once, but if that somehow does happen, I want to know about it.
		else if (blocks[i].type == "mouse"){
			for (let j = 0; j < blocks[i].pin.connected.length; ++j){
				x1 = event.clientX;
				x2 = blocks[i].pin.connected[j].ref.getBoundingClientRect().right - 5;
				y1 = event.clientY;
				y2 = blocks[i].pin.connected[j].ref.getBoundingClientRect().bottom - 5;
				// This just looks better to me. Maybe I'll change it back later.
				// if (blocks[i].pin.connected[j].active) ctx.strokeStyle = blocks[i].pin.connected[j].ref.parentElement.style.backgroundColor;
				ctx.strokeStyle = "black";
				ctx.beginPath();
				ctx.moveTo(x1, y1);
				ctx.lineTo(x2, y2);
				ctx.stroke();
			}
		}
	}
}

// This function is called whenever you click on a pin to create a new wire.
function newWire(origin){
	// This code is kind of scuffed. It's really just a hacky bugfix to prevent an issue where when the user tried to
	// 		connect a wire, the wire would be connected but a new wire would be started from the pin they clicked.
	if (blocks[0].pin.connected.length > 0){
		for (let i = 0; i < blocks[0].pin.connected.length; ++i){
			blocks[0].pin.disconnect(blocks[0].pin.connected[i]);
		}
		return;
	}
	// blocks[0] is always a reference to the mouse. It has its own pin associated with it.
	origin.connect(blocks[0].pin);
	// Don't you just love the notation for event handlers in javascript?
	document.onmousemove = (e1) => {updateLines(e1)};
	// This is also part of fixing the bug from earlier in the function. The newWire and endWire both used the mousedown
	// 		event, so newWire would fire at the same time as endWire, and vice versa, and you can imagine the nonsense
	// 		that caused. This just makes it so that newWire won't activate until you lift up the mouse.
	// If you're wondering why I didn't just use onclick or something, trust me, this is a lot more complicated than it looks.
	document.onmouseup = () => {
		document.onmousedown = (e2) => {endWire(origin, e2)};
		document.onmouseup = null;
	}
}

// This function is called whenever you're in the wire-setting state and click on a pin to bring the wire there.
function endWire(origin, event){
	let block = -1;
	let pin = -1;
	// The side variable determines which side the pin is on. 0 means it's an input pin, 1 means it's an output pin.
	let side = -1;
	if (event.target.classList.contains("pin")){
		// Here I'm searching through all the pins stored looking for the one you just clicked on.
		for (let i = 1; i < blocks.length; ++i){
			for (let j = 0; j < blocks[i].inPins.length; ++j){
				if (blocks[i].inPins[j] != null && blocks[i].inPins[j].ref == event.target){
					block = i;
					pin = j;
					side = 0;
					break;
				}
			}
			for (let j = 0; j < blocks[i].outPins.length; ++j){
				if (blocks[i].outPins[j] != null && blocks[i].outPins[j].ref == event.target){
					block = i;
					pin = j;
					side = 1;
					break;
				}
			}
			// Redundancy
			if (block != -1 && pin != -1 && pin != -1) break;
		}
		
		// This is important- you can't connect two input pins, or two output pins. They have to be different.
		if (side != origin.side){
			// Also important- we can never have two wires connecting to an input pin, so if you try to do so, the others
			// 		get deleted.
			if (origin.side == 0){
				for (let i = 0; i < origin.connected.length; ++i){
					origin.disconnect(origin.connected[i]);
				}
			}
			else if (side == 0){
				for (let i = 0; i < blocks[block].inPins[pin].connected.length; ++i){
					blocks[block].inPins[pin].disconnect(blocks[block].inPins[pin].connected[i]);
				}
			}

			if (side == 0) origin.connect(blocks[block].inPins[pin]);
			else origin.connect(blocks[block].outPins[pin]);
			// Disconnect the newly-created wire from the mouse.
			for (let i = 0; i < blocks[0].pin.connected.length; ++i){
				blocks[0].pin.disconnect(blocks[0].pin.connected[i]);
			}

			if (origin.side == 1) evaluate(event, [origin.block]);
			else if (side == 1) evaluate(event, [blocks[block]]);
		}
		
	}
	// If you clicked on something that's not a pin, or you tried to connect two input/output pins, you get denied.
	if (!event.target.classList.contains("pin") || side == origin.side){
		for (let i = 0; i < blocks[0].pin.connected.length; ++i){
			blocks[0].pin.disconnect(blocks[0].pin.connected[i]);
		}
	}
	document.onmousemove = null;
	document.onmousedown = null;
	evaluate(event);

}

function clearWires(event, pin){
	let extraBlocks = [];
	if (pin.side == 0){
		pin.active = false;
		extraBlocks.push(pin.block);
	}
	while (pin.connected.length > 0){
		if (pin.connected[0].side == 0){
			pin.connected[0].active = false;
			extraBlocks.push(pin.connected[0].block);
		}
		pin.disconnect(pin.connected[0]);
	}
	evaluate(event, extraBlocks);
}