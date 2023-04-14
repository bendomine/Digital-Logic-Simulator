// Test code; this will be deleted (ish)
let blocks = [
	{type: "mouse", pin: new Pin(null)},
	{type: "block", ref: document.getElementById('input'), inPins: [], outPins: [1, 1], inNames: [], outNames: ["Pin", "Pin"], operation: "input"},
	{type: "block", ref: document.getElementById('output'), inPins: [1], outPins: [], inNames: ["Pin"], outNames: [], operation: "output"}
];
for (let i = 0; i < blocks.length; ++i){
	if (blocks[i].type == "block"){
		blocks[i].ref.addEventListener('mousedown', startDrag);
		blocks[i].ref.addEventListener('mousedown', selectBlock);
		blocks[i] = initPins(blocks[i]);
	}
}
addEventListener('keydown', (e) => {
	if (e.key == "Shift") isShiftPressed = true;
	else if (e.key == "Backspace") deleteBlocks(e);
});
addEventListener('keyup', (e) => {
	if (e.key == "Shift") isShiftPressed = false;
});
document.getElementById('canvas').addEventListener('mousedown', (e) => {
	if (!isShiftPressed) deselectBlocks();
	beginSelectDrag(e);
});
// End test code

// Yes, I use global variables.
let selectedBlocks = [];
let isShiftPressed = false;
let draggedBlock = null;
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
	draggedBlock = event.target;
	document.onmousemove = moveElement;
	document.onmouseup = endDrag;
	updateLines(event);
}

// If you're dragging a block, this function is called whenever you move your mouse.
function moveElement(event){
	// Honestly I forgot why this works. I hope it doesn't break.
	newX = oldX + draggedBlock.offsetLeft - event.clientX;
	newY = oldY + draggedBlock.offsetTop - event.clientY;
	let plannedTop = draggedBlock.offsetTop - newY;
	let plannedLeft = draggedBlock.offsetLeft - newX;
	if (plannedTop + draggedBlock.offsetHeight > innerHeight){
		plannedTop = innerHeight - draggedBlock.offsetHeight;
	}
	else if (plannedTop < 0) plannedTop = 0;
	if (plannedLeft + draggedBlock.offsetWidth > innerWidth){
		plannedLeft = innerWidth - draggedBlock.offsetWidth;
	}
	else if (plannedLeft < 0) plannedLeft = 0;
	// I kind of went through a phase with the `${}` thing.
	draggedBlock.style.top = `${plannedTop}px`;
	draggedBlock.style.left = `${plannedLeft}px`;
	updateLines(event);
}

// This function is called when you finish dragging a block.
function endDrag(event){
	document.onmousemove = null;
	document.onmouseup = null;
	draggedBlock = null;
}

// This visually sets the layering of the blocks such that the strong survive on top and the weak wither 
// 		in the shadows of the others.
function updateLayers(){
	for (let i = 0; i < blocks.length; ++i){
		if (blocks[i].type == "block") blocks[i].ref.style.zIndex = `${i}`;
	}
}

function selectBlock(event){
	if (!event.target.classList.contains('block')) return;
	let num = -1;
	for (let i = 0; i < blocks.length; ++i){
		if (blocks[i].ref == event.target){
			num = i;
			break;
		}
	}
	if (!isShiftPressed) deselectBlocks();
	selectedBlocks.push(blocks[num]);
	if (!event.target.classList.contains('isSelected')) event.target.classList.add('isSelected');
}

function deselectBlocks(){
	for (let i = 0; i < selectedBlocks.length; ++i){
		selectedBlocks[i].ref.classList.remove('isSelected');
	}
	selectedBlocks = [];
}

function deleteBlocks(event){
	for (let i = 0; i < selectedBlocks.length; ++i){
		if (selectedBlocks[i].operation != "input" && selectedBlocks[i].operation != "output"){
			for (let j = 0; j < selectedBlocks[i].inPins.length; ++j){
				if (selectedBlocks[i].inPins[j] != null) clearWires(event, selectedBlocks[i].inPins[j]);
			}
			for (let j = 0; j < selectedBlocks[i].outPins.length; ++j){
				if (selectedBlocks[i].outPins[j] != null) clearWires(event, selectedBlocks[i].outPins[j]);
			}
			selectedBlocks[i].ref.remove();
			blocks.splice(blocks.indexOf(selectedBlocks[i]), 1);
		}
	}
}

function beginSelectDrag(event){
	oldX = event.x;
	oldY = event.y;
	document.getElementById('selector').style.display = "block";
	document.getElementById('selector').style.left = event.x + "px";
	document.getElementById('selector').style.top = event.y + "px";
	document.onmousemove = updateSelectDrag;
	document.onmouseup = endSelectDrag;
}

function updateSelectDrag(event){
	if (event.x >= oldX) document.getElementById('selector').style.width = event.x - oldX + "px";
	else{
		document.getElementById('selector').style.left = event.x + "px";
		document.getElementById('selector').style.width = oldX - event.x + "px";
	}
	if (event.y >= oldY) document.getElementById('selector').style.height = event.y - oldY + "px";
	else{
		document.getElementById('selector').style.top = event.y + "px";
		document.getElementById('selector').style.height = oldY - event.y + "px";
	}
	let r1 = document.getElementById('selector').getBoundingClientRect();
	for (let i = 1; i < blocks.length; ++i){
		let r2 = blocks[i].ref.getBoundingClientRect();
		if (((r2.left > r1.left && r2.left < r1.right) || (r2.right > r1.left && r2.right < r1.right)) && ((r2.top > r1.top && r2.top < r1.bottom) || (r2.bottom > r1.top && r2.bottom < r1.bottom))){
			if (selectedBlocks.indexOf(blocks[i]) == -1) selectedBlocks.push(blocks[i]);
			if (!blocks[i].ref.classList.contains('isSelected')) blocks[i].ref.classList.add('isSelected');
		}
		else if (selectedBlocks.indexOf(blocks[i]) != -1 && !isShiftPressed){
			blocks[i].ref.classList.remove('isSelected');
			selectedBlocks.splice(selectedBlocks.indexOf(blocks[i]), 1);
		}
	}
}

function endSelectDrag(event){
	document.getElementById('selector').style.display = "none";
	document.getElementById('selector').style.width = "0px";
	document.getElementById('selector').style.height = "0px";
	document.onmousemove = null;
	document.onmouseup = null;
}