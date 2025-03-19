// Test code; this will be deleted (ish)
let blocks = [
	{ type: 'mouse', pin: new Pin(null) },
	{
		type: 'block',
		ref: document.getElementById('input'),
		inPins: [],
		outPins: [1, 1],
		inNames: [],
		outNames: ['Pin', 'Pin'],
		operation: 'input'
	},
	{
		type: 'block',
		ref: document.getElementById('output'),
		inPins: [1],
		outPins: [],
		inNames: ['Pin'],
		outNames: [],
		operation: 'output'
	}
];
for (let i = 0; i < blocks.length; ++i) {
	if (blocks[i].type == 'block') {
		blocks[i].ref.addEventListener('mousedown', selectBlock);
		blocks[i].ref.addEventListener('mousedown', startDrag);
		blocks[i] = initPins(blocks[i]);
	}
}
addEventListener('keydown', (e) => {
	if (e.key == 'Shift') isShiftPressed = true;
	else if (
		(e.key == 'Backspace' || e.key == 'Delete') &&
		document.getElementById('encapsulateWindow').style.display == 'none' &&
		document.activeElement.tagName != 'INPUT'
	)
		deleteBlocks(e);
	else if (
		e.code == 'KeyA' &&
		document.getElementById('encapsulateWindow').style.display == 'none' &&
		document.activeElement.tagName != 'INPUT'
	) {
		deselectBlocks();
		for (let i = 1; i < blocks.length; ++i) {
			selectedBlocks.push(blocks[i]);
			blocks[i].ref.classList.add('isSelected');
		}
	}
});
addEventListener('keyup', (e) => {
	if (e.key == 'Shift') isShiftPressed = false;
});
document.getElementById('canvas').addEventListener('mousedown', (e) => {
	if (e.button == 0) {
		if (!isShiftPressed) deselectBlocks();
		beginSelectDrag(e);
	}
});
document.getElementById('sidebarResize').addEventListener('mousedown', startResizeDrag);
// End test code

let selectedBlocks = [];
let isShiftPressed = false;
let draggedBlock = null;
let oldX = 0;
let oldY = 0;
let boundingLeft = 0;
let boundingTop = 0;
let boundingWidth = 0;
let boundingHeight = 0;

updateLayers();
updateLines();

// This function is called if you click on a block.
function startDrag(event) {
	// Yes, a block. Not something on a block (you used to be able to drag pins around).
	if (!event.target.classList.contains('block')) return;
	let num = -1;
	for (let i = 0; i < blocks.length; ++i) {
		if (blocks[i].ref == event.target) {
			num = i;
			break;
		}
	}
	if (num != -1) {
		// This code sticks the block you clicked on to the front of the array (the order is used for layering).
		// This makes it so that when you click on a block it comes to the front of everything.
		let temp = blocks.splice(num, 1)[0];
		blocks.push(temp);
		updateLayers();
	}

	draggedBlock = event.target;
	boundingLeft = draggedBlock.offsetLeft;
	boundingTop = draggedBlock.offsetTop;
	boundingWidth = draggedBlock.offsetWidth;
	boundingHeight = draggedBlock.offsetHeight;
	// This code generates a bounding box around all selected blocks.
	selectedBlocks.forEach((block) => {
		if (block.ref.offsetLeft < boundingLeft) boundingLeft = block.ref.offsetLeft;
		if (block.ref.offsetTop < boundingTop) boundingTop = block.ref.offsetTop;
	});
	// We unfortunately cannot combine these into one loop as the width and height depend on the left and top.
	// We have to ensure that those values are set before we can calculate the width and height.
	selectedBlocks.forEach((block) => {
		if (block.ref.offsetLeft + block.ref.offsetWidth - boundingLeft > boundingWidth)
			boundingWidth = block.ref.offsetLeft + block.ref.offsetWidth - boundingLeft;
		if (block.ref.offsetTop + block.ref.offsetHeight - boundingTop > boundingHeight) {
			boundingHeight = block.ref.offsetTop + block.ref.offsetHeight - boundingTop;
		}
	});

	// These variables are the x and y positions within the bounding box.
	oldX = event.clientX - boundingLeft;
	oldY = event.clientY - boundingTop;

	document.onmousemove = moveElement;
	document.onmouseup = endDrag;
	updateLines(event);
}

function startDragOnBlock(block) {
	deselectBlocks();
	selectBlock({ target: block.ref });
	draggedBlock = block.ref;
	boundingLeft = draggedBlock.offsetLeft;
	boundingTop = draggedBlock.offsetTop;
	boundingWidth = draggedBlock.offsetWidth;
	boundingHeight = draggedBlock.offsetHeight;
	oldX = block.ref.offsetWidth / 2;
	oldY = block.ref.offsetHeight / 2;
	// oldY = event.clientY - boundingTop;
	document.onmousemove = moveElement;
	document.onmouseup = (e) => {
		endDrag(e);
		updateLayers();
	};
}

function startResizeDrag(event) {
	document.onmousemove = resizeSidebar;
	document.onmouseup = endResizeDrag;
}

// If you're dragging a block, this function is called whenever you move your mouse.
// We're going to use a large bounding box generated around all blocks.
// We'll locate the x and y positions of the mouse relative to the bounding box.
function moveElement(event) {
	let newX = oldX + boundingLeft - event.clientX;
	let newY = oldY + boundingTop - event.clientY;
	let plannedLeft = boundingLeft - newX;
	let plannedTop = boundingTop - newY;
	if (plannedLeft < 0) plannedLeft = 0;
	if (plannedTop < 0) plannedTop = 0;
	if (plannedLeft + boundingWidth > innerWidth) plannedLeft = innerWidth - boundingWidth;
	if (plannedTop + boundingHeight > innerHeight) plannedTop = innerHeight - boundingHeight;
	// Loop over every selected block
	for (let i = 0; i < selectedBlocks.length; ++i) {
		let newLeft = plannedLeft + selectedBlocks[i].ref.offsetLeft - boundingLeft;
		let newTop = plannedTop + selectedBlocks[i].ref.offsetTop - boundingTop;
		// I kind of went through a phase with the `${}` thing.
		selectedBlocks[i].ref.style.left = `${newLeft}px`;
		selectedBlocks[i].ref.style.top = `${newTop}px`;
	}
	boundingLeft = plannedLeft;
	boundingTop = plannedTop;
	updateLines(event);
}

// This function is called when you finish dragging a block.
function endDrag(event) {
	document.onmousemove = null;
	document.onmouseup = null;
	draggedBlock = null;
}

function resizeSidebar(event) {
	let newWidth = Math.min(event.clientX, innerWidth / 2);
	document.getElementById('sidebar').style.width = `${newWidth}px`;
}
function endResizeDrag(event) {
	document.onmousemove = null;
	document.onmouseup = null;
}

function updateLayers() {
	for (let i = 0; i < blocks.length; ++i) {
		if (blocks[i].type == 'block') blocks[i].ref.style.zIndex = `${i}`;
	}
}

function selectBlock(event) {
	if (!event.target.classList.contains('block')) return;
	let num = -1;
	for (let i = 0; i < blocks.length; ++i) {
		if (blocks[i].ref == event.target) {
			num = i;
			break;
		}
	}
	if (!isShiftPressed && !event.target.classList.contains('isSelected')) deselectBlocks();
	if (selectedBlocks.indexOf(blocks[num]) == -1) selectedBlocks.push(blocks[num]);
	if (!event.target.classList.contains('isSelected')) event.target.classList.add('isSelected');
}

function deselectBlocks() {
	for (let i = 0; i < selectedBlocks.length; ++i) {
		selectedBlocks[i].ref.classList.remove('isSelected');
	}
	selectedBlocks = [];
}

function deleteBlocks(event) {
	for (let i = 0; i < selectedBlocks.length; ++i) {
		if (selectedBlocks[i].operation != 'input' && selectedBlocks[i].operation != 'output') {
			for (let j = 0; j < selectedBlocks[i].inPins.length; ++j) {
				if (selectedBlocks[i].inPins[j] != null)
					clearWires(event, selectedBlocks[i].inPins[j]);
			}
			for (let j = 0; j < selectedBlocks[i].outPins.length; ++j) {
				if (selectedBlocks[i].outPins[j] != null)
					clearWires(event, selectedBlocks[i].outPins[j]);
			}
			selectedBlocks[i].ref.remove();
			blocks.splice(blocks.indexOf(selectedBlocks[i]), 1);
			selectedBlocks.splice(i, 1);
			i--;
		}
	}
}

function beginSelectDrag(event) {
	oldX = event.x;
	oldY = event.y;
	document.getElementById('selector').style.display = 'block';
	document.getElementById('selector').style.left = event.x + 'px';
	document.getElementById('selector').style.top = event.y + 'px';
	document.onmousemove = updateSelectDrag;
	document.onmouseup = endSelectDrag;
}

function checkSelectBoundingBox(r1, r2) {
	let xOverlap = r1.left < r2.right && r1.right > r2.left;
	let yOverlap = r1.top < r2.bottom && r1.bottom > r2.top;
	return xOverlap && yOverlap;
}

function updateSelectDrag(event) {
	if (event.x >= oldX) {
		document.getElementById('selector').style.width = event.x - oldX + 'px';
		// Prevents a quick drag from offsetting the selector.
		document.getElementById('selector').style.left = oldX + 'px';
	} else {
		document.getElementById('selector').style.left = event.x + 'px';
		document.getElementById('selector').style.width = oldX - event.x + 'px';
	}
	if (event.y >= oldY) {
		document.getElementById('selector').style.height = event.y - oldY + 'px';
		document.getElementById('selector').style.top = oldY + 'px';
	} else {
		document.getElementById('selector').style.top = event.y + 'px';
		document.getElementById('selector').style.height = oldY - event.y + 'px';
	}
	let r1 = document.getElementById('selector').getBoundingClientRect();
	for (let i = 1; i < blocks.length; ++i) {
		let r2 = blocks[i].ref.getBoundingClientRect();
		if (checkSelectBoundingBox(r1, r2)) {
			if (selectedBlocks.indexOf(blocks[i]) == -1) selectedBlocks.push(blocks[i]);
			if (!blocks[i].ref.classList.contains('isSelected'))
				blocks[i].ref.classList.add('isSelected');
		} else if (selectedBlocks.indexOf(blocks[i]) != -1 && !isShiftPressed) {
			blocks[i].ref.classList.remove('isSelected');
			selectedBlocks.splice(selectedBlocks.indexOf(blocks[i]), 1);
		}
	}
}

function endSelectDrag(event) {
	document.getElementById('selector').style.display = 'none';
	document.getElementById('selector').style.width = '0px';
	document.getElementById('selector').style.height = '0px';
	document.onmousemove = null;
	document.onmouseup = null;
}

