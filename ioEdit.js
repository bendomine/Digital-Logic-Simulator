let currentTarget = null;

document.getElementById("edit").style.transform = "scale(0)";
document.getElementById("edit").style.opacity = "0";
document.getElementById("workspace").onmousedown = () => {
	document.getElementById("edit").style.transform = "scale(0)";
	document.getElementById("edit").style.opacity = "0";
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
	document.getElementById("edit").scrollTop = 0;
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
				if (blocks[index].outPins[i].ref.dataset.name == "Pin") name.placeholder = "Pin Label";
				else name.placeholder = blocks[index].outPins[i].ref.dataset.name;
				let save = document.createElement('input');
				save.type = "button";
				save.value = "Save";
				save.class = "save";
				save.disabled = true;
				save.onclick = saveName;
	

				let button = document.createElement('input');
				button.type = "button";
				button.value = "Remove";
				button.class = "remove";

				let container = document.createElement('div');
				container.classList.add("editPin");

				container.appendChild(toggle);
				container.appendChild(name);
				container.appendChild(save);
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
				if (blocks[index].inPins[i].ref.dataset.name == "Pin") name.placeholder = "Pin Label";
				else name.placeholder = blocks[index].inPins[i].ref.dataset.name;

				let save = document.createElement('input');
				save.type = "button";
				save.value = "Save";
				save.disabled = true;
				save.onclick = saveName;

				let button = document.createElement('input');
				button.type = "button";
				button.value = "Remove";
				button.class = "remove";

				let container = document.createElement('div');
				container.classList.add("editPin");

				container.appendChild(name);
				container.appendChild(save);
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

	for (let i = 0; i < document.getElementsByClassName('name').length; ++i){
		document.getElementsByClassName('name')[i].addEventListener('keyup', () => {
			if (document.getElementsByClassName('name')[i].value != "") document.getElementsByClassName('name')[i].nextSibling.disabled = false;
			else document.getElementsByClassName('name')[i].nextSibling.disabled = true;
		});
	}
}

function saveName(event){
	event.target.previousSibling.placeholder = event.target.previousSibling.value;
	let index = Array.from(event.target.parentElement.parentElement.children).indexOf(event.target.parentElement);
	currentTarget.ref.children[index].dataset.name = event.target.previousSibling.value;
	event.target.previousSibling.value = "";
	event.target.disabled = true;	
}