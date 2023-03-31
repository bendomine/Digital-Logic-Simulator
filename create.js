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

function createBlock(name){
	let idx = -1;
	for (let i = 0; i < data.length; ++i){
		if (data[i].name == name){
			idx = i;
			break;
		}
	}
	let blockComponents = data[idx].components;
	let newDiv = document.createElement('div');
	newDiv.classList.add('block');
	newDiv.style.backgroundColor = "rgb(255, 91, 91)";
	newDiv.innerText = name;
	newDiv.onmousedown = startDrag;
	document.getElementById('workspace').appendChild(newDiv);
	let newBlock = {};
	newBlock.operation = name;
	newBlock.type = "block";
	newBlock.ref = newDiv;
	newBlock.inPins = 
}