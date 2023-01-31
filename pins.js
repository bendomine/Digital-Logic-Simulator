// This function is big and does a lot of things, so to explain it fully, I will use a...
/*
 +====================+
 | MULTI-LINE COMMENT |
 +====================+

 --> The initPins function <--

	This function runs on each block when it's created and initializes its pins. Each block starts with an array which
	looks something like [1, 1, null, 1]. Blocks actually have two of these arrays, one for input pins and one for output
	pins. This function parses these arrays. 
	The ones are turned into pin objects, while the null remains (it represents an empty space for stylistic purposes). 
	The function also creates HTML elements for each pin and places them on the correct block. These pins are spaced in 
	a very specific way which took FOREVER to figure out and resulted in about a cubic meter of pain.
	Finally, the block the pins belong to is scaled depending on how many pins there are.

	What I'm saying is, this function is pretty great.

*/
function initPins(block){
	// The following code took several days to write. I have no idea how it works.
	let maxPins = Math.max(block.inPins.length, block.outPins.length);
	if (maxPins > 2) block.ref.style.height = 15 * (maxPins - 1) + "px";
	else block.ref.style.height = 23.2;
	block.ref.style.lineHeight = block.ref.style.height;
	// See, I'm resorting to ternary operators. That's a sign that something is very, very wrong.
	let outTopPadding = (block.outPins.length <= block.inPins.length || block.outPins.length < 3) ? (block.ref.offsetHeight - (15 * (block.outPins.length)))/ 2 : 0;
	let inTopPadding = (block.inPins.length <= block.outPins.length || block.inPins.length < 3) ? (block.ref.offsetHeight - (15 * (block.inPins.length)))/ 2 : 0;
	// Scary code over.

	for (let i = 0; i < block.inPins.length; ++i){
		if (block.inPins[i] != null){
			// Creation of the pin element and application of all of the style stuff.
			let elem = document.createElement('div');
			elem.classList.add('pin');
			// Each pin has 5px of space between them (because each pin is 10x10, 15-10 = 5).
			elem.style.top = inTopPadding + 15 * i + "px";
			block.ref.appendChild(elem);
			elem.style.left = "-7.5px";
			// Now that the element is created and added, we need to create the pin object to attach.
			let pin = new Pin(elem, block);
			pin.side = 0;
			block.inPins[i] = pin;
			// Also, when the pin is clicked on, we need to create a new wire.
			elem.onmousedown = (e) => {
				if (e.ctrlKey) clearWires(e, pin);
				else newWire(pin);
			};
		}
	}
	// Believe it or not, this is almost exactly the same as the last bit of code!!
	for (let i = 0; i < block.outPins.length; ++i){
		if (block.outPins[i] != null){
			let elem = document.createElement('div');
			elem.classList.add('pin');
			elem.style.top = outTopPadding + 15 * i + "px";
			block.ref.appendChild(elem);
			elem.style.left = block.ref.offsetWidth - 10 + "px";
			let pin = new Pin(elem, block);
			pin.side = 1;
			block.outPins[i] = pin;
			elem.onmousedown = (e) => {
				if (e.ctrlKey) clearWires(e, pin);
				else newWire(pin);
			};
		}
	}
	return block;
}


/* The following comments were written before I started writing the aforementioned spacing algorithm.

Each pin is 10x10. Each pin should have exactly 5px of space between them (so, 15px from the top of the previous pin).
If there are two or fewer pins on both sides of the block, the block's height is 23.2px.
If there are three or more pins on one side, the block's height is just the minimum amount of height needed
to contain all of the pins following the previously mentioned constraints.
The group of pins is always centered. 
*/
// Wow, I sounded very confident.


// This class represents one pin. It contains some basic information about the pin.
// ref is a reference to the html element of the pin.
// connected is an array of other pins that this one is connected to.
// active determines whether or not this pin is active or not.
// side is 0 if this pin is an input pin, 1 if it's an output pin.
class Pin{
	constructor(ref, block){
		this.ref = ref;
		this.connected = [];
		this.active = false;
		this.side;
		this.block = block;
	}
	connect(pin){
		this.connected.push(pin);
		pin.connected.push(this);
	}
	disconnect(pin){
		this.connected.splice(this.connected.indexOf(pin), 1);
		pin.connected.splice(pin.connected.indexOf(this), 1);
	}
}