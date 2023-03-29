// Test code; this will be deleted
// Purpose is 0 for normal blocks, -1 for input, 1 for output
let blocks = [
	{type: "mouse", pin: new Pin(null)},
	{type: "block", ref: document.getElementsByClassName('block')[0], inPins: [1, 1], outPins: [1], operation: "and"},
	{type: "block", ref: document.getElementsByClassName('block')[1], inPins: [1, 1], outPins: [1], operation: "and"},
	{type: "block", ref: document.getElementsByClassName('block')[2], inPins: [1, 1], outPins: [1], operation: "and"},
	{type: "block", ref: document.getElementsByClassName('block')[3], inPins: [1, 1], outPins: [1], operation: "or_but_better"},
	{type: "block", ref: document.getElementsByClassName('block')[4], inPins: [1], outPins: [1], operation: "not"},
	{type: "block", ref: document.getElementsByClassName('block')[5], inPins: [1], outPins: [1], operation: "not"},
	{type: "block", ref: document.getElementsByClassName('block')[6], inPins: [1], outPins: [1], operation: "not"},
	{type: "block", ref: document.getElementsByClassName('block')[7], inPins: [1, 1], outPins: [1, 1], operation: "halfadder"},
	{type: "block", ref: document.getElementById('input'), inPins: [], outPins: [1, 1, 1, 1, null, 1, 1, 1, 1], operation: "input"},
	{type: "block", ref: document.getElementById('output'), inPins: [1, 1, 1, 1, null, 1, 1, 1, 1], outPins: [], operation: "output"}
];
for (let i = 0; i < blocks.length; ++i){
	if (blocks[i].type == "block"){
		blocks[i].ref.onmousedown = startDrag;
		blocks[i] = initPins(blocks[i]);
	}
}
// End test code

// Yes, I use global variables.
let selectedBlock = null;
let oldX = 0;
let oldY = 0;
let newX = 0;
let newY = 0;

updateLayers();
updateLines();

// This function is called if you click on a block.
function startDrag(event){
	// Yes, a block. Not something on a block (you used to be able to drag pins around).
	if (!event.target.classList.contains('block')) return;
	let num = -1;
	for (let i = 0; i < blocks.length; ++i){
		if (blocks[i].ref == event.target){
			num = i;
			break;
		}
	}
	if (num != -1){
		// This code sticks the block you clicked on to the front of the array (the order is used for layering).
		// This makes it so that when you click on a block it comes to the front of everything.
		let temp = blocks.splice(num, 1)[0];
		blocks.push(temp);
		updateLayers();
	}
	oldX = event.offsetX;
	oldY = event.offsetY;
	selectedBlock = event.target;
	document.onmousemove = moveElement;
	document.onmouseup = endDrag;
	updateLines(event);
}

// If you're dragging a block, this function is called whenever you move your mouse.
function moveElement(event){
	// Honestly I forgot why this works. I hope it doesn't break.
	newX = oldX + selectedBlock.offsetLeft - event.clientX;
	newY = oldY + selectedBlock.offsetTop - event.clientY;
	let plannedTop = selectedBlock.offsetTop - newY;
	let plannedLeft = selectedBlock.offsetLeft - newX;
	if (plannedTop + selectedBlock.offsetHeight > innerHeight){
		plannedTop = innerHeight - selectedBlock.offsetHeight;
	}
	else if (plannedTop < 0) plannedTop = 0;
	if (plannedLeft + selectedBlock.offsetWidth > innerWidth){
		plannedLeft = innerWidth - selectedBlock.offsetWidth;
	}
	else if (plannedLeft < 0) plannedLeft = 0;
	// I kind of went through a phase with the `${}` thing.
	selectedBlock.style.top = `${plannedTop}px`;
	selectedBlock.style.left = `${plannedLeft}px`;
	updateLines(event);
}

// This function is called when you finish dragging a block.
function endDrag(event){
	document.onmousemove = null;
	document.onmouseup = null;
	selectedBlock = null;
}

// This visually sets the layering of the blocks such that the strong survive on top and the weak wither 
// 		in the shadows of the others.
function updateLayers(){
	for (let i = 0; i < blocks.length; ++i){
		if (blocks[i].type == "block") blocks[i].ref.style.zIndex = `${i}`;
	}
}