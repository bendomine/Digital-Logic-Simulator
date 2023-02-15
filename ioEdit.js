let currentTarget = null;

document.getElementById("editIn").style.transform = "scale(0)";
document.getElementById("editIn").style.opacity = "0";
document.getElementById("editOut").style.transform = "scale(0)";
document.getElementById("editOut").style.opacity = "0";
document.getElementById("workspace").onmousedown = () => {
	document.getElementById("editIn").style.transform = "scale(0)";
	document.getElementById("editIn").style.opacity = "0";
	document.getElementById("editOut").style.transform = "scale(0)";
	document.getElementById("editOut").style.opacity = "0";
}
document.getElementById("input").ondblclick = (event) => {
	let target;
	if (event.target.classList.contains('block')) target = event.target;
	else target = event.target.parentElement;
	buildEditMenu(target);
}
document.getElementById("output").ondblclick = (event) => {
	let target;
	if (event.target.classList.contains('block')) target = event.target;
	else target = event.target.parentElement;
	buildEditMenu(target);
	
}

function buildEditMenu(triggerElem){
	document.getElementById("edit").style.transform = "scale(1)";
	document.getElementById("edit").style.opacity = "1";
	document.getElementById("edit").replaceChildren();
	let index = -1;
	for (let i = 0; i < blocks.length; ++i){
		if (blocks[i].ref == triggerElem){
			index = i;
			break;
		}
	}
	currentTarget = blocks[index];
	if (index == -1) return;
	if (blocks[index].operation == "input"){
		for (let i = 0; i < blocks[index].outPins.length; ++i){
			if (blocks[index].outPins[i] == null){
				let text = document.createElement('i');
				text.innerText = "Spacer";
				let container = document.createElement('div');
				container.classList.add("editPin");
				container.appendChild(text);
				document.getElementById("edit").appendChild(container);
			}
			else{
				let toggle = document.createElement('input');
				toggle.type = "checkbox";
				toggle.classList.add("toggle");
				toggle.checked = blocks[index].outPins[i].active;
				toggle.onclick = (e) => {
					let childNum = Array.from(e.target.parentNode.parentNode.children).indexOf(e.target.parentNode);
					currentTarget.outPins[childNum].active = e.target.checked;
					evaluate();
				}

				let name = document.createElement('input');
				name.type = "text";
				name.classList.add("name");
				name.placeholder = "Pin Label";

				let button = document.createElement('input');
				button.type = "button";
				button.value = "Remove";
				button.class = "remove";

				let container = document.createElement('div');
				container.classList.add("editPin");

				container.appendChild(toggle);
				container.appendChild(name);
				container.appendChild(button);
				document.getElementById("edit").appendChild(container);
			}
		}
	}
	else if (blocks[index].operation == "output"){
		for (let i = 0; i < blocks[index].inPins.length; ++i){
			if (blocks[index].inPins[i] == null){
				let text = document.createElement('i');
				text.innerText = "Spacer";
				let container = document.createElement('div');
				container.classList.add("editPin");
				container.appendChild(text);
				document.getElementById("edit").appendChild(container);
			}
			else{
				let name = document.createElement('input');
				name.type = "text";
				name.classList.add("name");
				name.placeholder = "Pin Label";

				let button = document.createElement('input');
				button.type = "button";
				button.value = "Remove";
				button.class = "remove";

				let container = document.createElement('div');
				container.classList.add("editPin");

				container.appendChild(name);
				container.appendChild(button);
				document.getElementById("edit").appendChild(container);
			}
		}
	}
	let posY = triggerElem.offsetTop - 35 - document.getElementById('edit').offsetHeight;
	let posX = triggerElem.offsetLeft + (triggerElem.offsetWidth / 2) - (document.getElementById("edit").offsetWidth / 2);
	posY = posY >= 0 ? posY : 0;
	posX = posX >= 0 ? posX : 0;
	document.getElementById("edit").style.top = posY + "px";
	document.getElementById("edit").style.left = posX + "px";
}