document.getElementById('workspace').addEventListener('contextmenu', (e) => {
	e.preventDefault();
	if (e.target.id == 'canvas' || e.target.classList.contains('block'))
		contextMenu(e, 'createBlock');
});

document.getElementById('workspace').addEventListener('mousedown', (e) => {
	let menu = document.getElementById('contextMenu');
	if (menu.style.transform == 'scaleY(1)') menu.style.transform = 'scaleY(0)';
	if (menu.style.opacity == '1') menu.style.opacity = '0';
});

let andContainer = document.getElementsByClassName('sidebarContainer')[0];
let notContainer = document.getElementsByClassName('sidebarContainer')[1];
andContainer.children[0].onmousedown = (e) => {
	if (e.button == 0) sidebarCreate('and', e);
};
notContainer.children[0].onmousedown = (e) => {
	if (e.button == 0) sidebarCreate('not', e);
};
andContainer.children[0].oncontextmenu = (e) => {
	e.preventDefault();
	contextMenu(e, 'blockOptions');
};
notContainer.children[0].oncontextmenu = (e) => {
	e.preventDefault();
	contextMenu(e, 'blockOptions');
};

// Set width of container based on width of block created
andContainer.style.width = andContainer.children[0].offsetWidth + 20 + 'px';
andContainer.style.height = andContainer.children[0].offsetHeight + 20 + 'px';
andContainer.children[0].style.backgroundColor = 'rgb(255, 91, 91)';
notContainer.style.width = notContainer.children[0].offsetWidth + 20 + 'px';
notContainer.style.height = notContainer.children[0].offsetHeight + 20 + 'px';
notContainer.children[0].style.backgroundColor = 'rgb(138, 254, 136)';

initPreviewPins(andContainer.children[0], ['', ''], ['']);
initPreviewPins(notContainer.children[0], [''], ['']);

function createBlockFromCMenu(name, event) {
	let newBlock = createBlock(name);
	let cMenu = document.getElementById('contextMenu');
	newBlock.ref.style.top = cMenu.style.top + '';
	newBlock.ref.style.left = cMenu.style.left + '';
}

function createBlock(name) {
	document.getElementById('sidebar').style.zIndex = blocks.length + 3;
	document.getElementById('selector').style.zIndex = blocks.length + 2;

	let newDiv = document.createElement('div');
	newDiv.classList.add('block');
	newDiv.innerText = name;
	// NOTE: the code below should ensure that selection propagates before dragging occurs, but this is technically
	// NOT part of the DOM2 standard. It should still work everywhere except IE, and is part of the DOM3 standard,
	// but still, keep this in mind.
	newDiv.addEventListener('mousedown', selectBlock);
	newDiv.addEventListener('mousedown', startDrag);
	document.getElementById('workspace').appendChild(newDiv);
	let newBlock = {};
	newBlock.operation = name;
	newBlock.type = 'block';
	newBlock.ref = newDiv;
	if (name != 'and' && name != 'not') {
		let idx = -1;
		for (let i = 0; i < data.length; ++i) {
			if (data[i].name == name) {
				idx = i;
				break;
			}
		}
		let blockComponents = data[idx].components;
		let inIdx = -1;
		let outIdx = -1;
		newDiv.style.backgroundColor = data[idx].color;
		for (let i = 0; i < blockComponents.length; ++i) {
			if (blockComponents[i].name == 'input') inIdx = i;
			else if (blockComponents[i].name == 'output') outIdx = i;
		}
		newBlock.inPins = structuredClone(blockComponents[inIdx].outPins);
		newBlock.outPins = structuredClone(blockComponents[outIdx].inPins);
		newBlock.inNames = structuredClone(blockComponents[inIdx].pinNames);
		newBlock.outNames = structuredClone(blockComponents[outIdx].pinNames);
	} else if (name == 'and') {
		newBlock.inPins = [1, 1];
		newBlock.outPins = [1];
		newBlock.inNames = ['In 1', 'In 2'];
		newBlock.outNames = ['Out 1'];
		newDiv.innerText = 'AND';
		newDiv.style.backgroundColor = 'rgb(255, 91, 91)';
	} else {
		newBlock.inPins = [1];
		newBlock.outPins = [1];
		newBlock.inNames = ['In 1'];
		newBlock.outNames = ['Out 1'];
		newDiv.innerText = 'NOT';
		newDiv.style.backgroundColor = 'rgb(138, 254, 136)';
	}
	newBlock = initPins(newBlock);
	blocks.push(newBlock);
	updateLayers();
	return newBlock;
}

function collapseSidebar() {
	document.getElementById('sidebar').style.left =
		-document.getElementById('sidebar').offsetWidth + 'px';
	document.getElementById('expandButton').style.opacity = '1';
}
function expandSidebar() {
	document.getElementById('sidebar').style.left = '0';
	document.getElementById('expandButton').style.opacity = '0';
}

function sidebarCreate(name, event) {
	let newBlock = createBlock(name);
	newBlock.ref.style.left = Math.max(event.clientX - newBlock.ref.offsetWidth / 2, 0) + 'px';
	newBlock.ref.style.top = Math.max(event.clientY - newBlock.ref.offsetHeight / 2, 0) + 'px';

	startDragOnBlock(newBlock);

	newBlock.ref.style.zIndex = blocks.length + 4;
}

// Popup when attempting to leave page
// DISABLED FOR TESTING-ENABLE BEFORE DEPLOYING
// addEventListener('beforeunload', (e) => {
// 	e.preventDefault();
// 	return '';
// });

