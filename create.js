document.getElementById('workspace').oncontextmenu = (e) => {
	e.preventDefault();
	document.getElementById('contextMenu').style.top = e.clientY + "px";
	document.getElementById('contextMenu').style.left = e.clientX + "px";
	document.getElementById('contextMenu').style.transform = "scaleY(1)";
	document.getElementById('contextMenu').style.opacity = "1";
	document.getElementById('contextMenu').scrollTop = 0;
}
document.getElementById('workspace').addEventListener('mousedown', (e) => {
	if (document.getElementById('contextMenu').style.transform == "scaleY(1)") document.getElementById('contextMenu').style.transform = "scaleY(0)";
	if (document.getElementById('contextMenu').style.opacity == "1") document.getElementById('contextMenu').style.opacity = "0";
});

document.getElementById('contextOptions').children[0].onclick = (e) => {createBlockFromCMenu('and', e);}
document.getElementById('contextOptions').children[1].onclick = (e) => {createBlockFromCMenu('not', e);}

function createBlockFromCMenu(name, event){
	let newBlock = createBlock(name);
	if (document.getElementById('contextMenu').style.transform == "scaleY(1)") document.getElementById('contextMenu').style.transform = "scaleY(0)";
	if (document.getElementById('contextMenu').style.opacity == "1") document.getElementById('contextMenu').style.opacity = "0";
	newBlock.ref.style.top = event.y + "px";
	newBlock.ref.style.left = event.x + "px";
}

function createBlock(name){
	let newDiv = document.createElement('div');
	newDiv.classList.add('block');
	// newDiv.style.backgroundColor = "rgb(255, 91, 91)";
	newDiv.innerText = name;
	newDiv.addEventListener('mousedown', startDrag);
	newDiv.addEventListener('mousedown', selectBlock);
	// newDiv.style.backgroundColor = "hsl(" + Math.random() * 360 + ", 100%, 68%)";
	document.getElementById('workspace').appendChild(newDiv);
	let newBlock = {};
	newBlock.operation = name;
	newBlock.type = "block";
	newBlock.ref = newDiv;
	if (name != "and" && name != "not"){
		let idx = -1;
		for (let i = 0; i < data.length; ++i){
			if (data[i].name == name){
				idx = i;
				break;
			}
		}
		let blockComponents = data[idx].components;
		let inIdx = -1;
		let outIdx = -1;
		newDiv.style.backgroundColor = data[idx].color;
		for (let i = 0; i < blockComponents.length; ++i){
			if (blockComponents[i].name == "input") inIdx = i;
			else if (blockComponents[i].name == "output") outIdx = i;
		}
		newBlock.inPins = structuredClone(blockComponents[inIdx].outPins);
		newBlock.outPins = structuredClone(blockComponents[outIdx].inPins);
		newBlock.inNames = structuredClone(blockComponents[inIdx].pinNames);
		newBlock.outNames = structuredClone(blockComponents[outIdx].pinNames);
	}
	else if (name == "and"){
		newBlock.inPins = [1, 1];
		newBlock.outPins = [1];
		newBlock.inNames = ["In 1", "In 2"];
		newBlock.outNames = ["Out 1"];
		newDiv.innerText = "AND";
		newDiv.style.backgroundColor = "rgb(255, 91, 91)";
	}
	else{
		newBlock.inPins = [1];
		newBlock.outPins = [1];
		newBlock.inNames = ["In 1"];
		newBlock.outNames = ["Out 1"];
		newDiv.innerText = "NOT";
		newDiv.style.backgroundColor = "rgb(140, 255, 123)";
	}
	newBlock = initPins(newBlock);
	blocks.push(newBlock);
	updateLayers();
	return newBlock;
}

function collapseSidebar(){
	document.getElementById('sidebar').style.left = "-20%";
	document.getElementById('expandButton').style.opacity = "1";
}
function expandSidebar(){
	document.getElementById('sidebar').style.left = "0";
	document.getElementById('expandButton').style.opacity = "0";
}