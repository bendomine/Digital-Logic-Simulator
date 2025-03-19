let currentTarget = null;

document.getElementById('edit').style.transform = 'scale(0)';
document.getElementById('edit').style.opacity = '0';
document.getElementById('workspace').onmousedown = () => {
	document.getElementById('edit').style.transform = 'scale(0)';
	document.getElementById('edit').style.opacity = '0';
};
document.getElementById('input').ondblclick = (event) => {
	let target;
	if (event.target.classList.contains('block')) target = event.target;
	else target = event.target.parentElement;
	buildEditMenu(target);
};
document.getElementById('output').ondblclick = (event) => {
	let target;
	if (event.target.classList.contains('block')) target = event.target;
	else target = event.target.parentElement;
	buildEditMenu(target);
};

function buildEditMenu(triggerElem) {
	document.getElementById('edit').style.transform = 'scale(1)';
	document.getElementById('edit').style.opacity = '1';
	document.getElementById('edit').replaceChildren();

	let index = -1;
	for (let i = 0; i < blocks.length; ++i) {
		if (blocks[i].ref == triggerElem) {
			index = i;
			break;
		}
	}
	currentTarget = blocks[index];
	if (index == -1) return;
	if (blocks[index].operation == 'input') {
		for (let i = 0; i < blocks[index].outPins.length; ++i) {
			if (blocks[index].outPins[i] == null) {
				let text = document.createElement('i');
				text.innerHTML = 'Spacer (<u>remove</u>)';
				text.children[0].style.cursor = 'pointer';
				text.children[0].onclick = removePin;
				let container = document.createElement('div');
				container.classList.add('editPin');

				if (i == 0) {
					let addPinTop = document.createElement('div');
					let addSpacerTop = document.createElement('div');
					addPinTop.innerText = '+';
					addSpacerTop.innerText = '+';
					addPinTop.classList.add('addNew');
					addPinTop.classList.add('addTop');
					addPinTop.classList.add('addPin');
					addSpacerTop.classList.add('addNew');
					addSpacerTop.classList.add('addSpacer');
					addSpacerTop.classList.add('addTop');
					addPinTop.onclick = newPin;
					addSpacerTop.onclick = newSpacer;
					container.appendChild(addPinTop);
					container.appendChild(addSpacerTop);
				}

				container.appendChild(text);
				let addPin = document.createElement('div');
				let addSpacer = document.createElement('div');
				addPin.innerText = '+';
				addSpacer.innerText = '+';
				addPin.classList.add('addNew');
				addPin.classList.add('addPin');
				addSpacer.classList.add('addNew');
				addSpacer.classList.add('addSpacer');
				addPin.onclick = newPin;
				addSpacer.onclick = newSpacer;
				container.appendChild(addPin);
				container.appendChild(addSpacer);
				document.getElementById('edit').appendChild(container);
			} else {
				let toggle = document.createElement('input');
				toggle.type = 'checkbox';
				toggle.classList.add('toggle');
				toggle.checked = blocks[index].outPins[i].active;
				toggle.onclick = (e) => {
					let childNum = Array.from(e.target.parentNode.parentNode.children).indexOf(
						e.target.parentNode
					);
					currentTarget.outPins[childNum].active = e.target.checked;
					evaluate();
				};

				let name = document.createElement('input');
				name.type = 'text';
				name.classList.add('name');
				if (blocks[index].outPins[i].ref.dataset.name == 'Pin')
					name.placeholder = 'Pin Label';
				else name.placeholder = blocks[index].outPins[i].ref.dataset.name;
				let save = document.createElement('input');
				save.type = 'button';
				save.value = 'Save';
				save.class = 'save';
				save.disabled = true;
				save.onclick = saveName;

				let button = document.createElement('input');
				button.type = 'button';
				button.value = 'Remove';
				button.class = 'remove';
				button.onclick = removePin;

				let container = document.createElement('div');
				container.classList.add('editPin');

				if (i == 0) {
					let addPinTop = document.createElement('div');
					let addSpacerTop = document.createElement('div');
					addPinTop.innerText = '+';
					addSpacerTop.innerText = '+';
					addPinTop.classList.add('addNew');
					addPinTop.classList.add('addTop');
					addPinTop.classList.add('addPin');
					addSpacerTop.classList.add('addNew');
					addSpacerTop.classList.add('addSpacer');
					addSpacerTop.classList.add('addTop');
					addPinTop.onclick = newPin;
					addSpacerTop.onclick = newSpacer;
					container.appendChild(addPinTop);
					container.appendChild(addSpacerTop);
				}

				container.appendChild(toggle);
				container.appendChild(name);
				container.appendChild(save);
				container.appendChild(button);
				let addPin = document.createElement('div');
				let addSpacer = document.createElement('div');
				addPin.innerText = '+';
				addSpacer.innerText = '+';
				addPin.classList.add('addNew');
				addPin.classList.add('addPin');
				addSpacer.classList.add('addNew');
				addSpacer.classList.add('addSpacer');
				addPin.onclick = newPin;
				addSpacer.onclick = newSpacer;
				container.appendChild(addPin);
				container.appendChild(addSpacer);
				document.getElementById('edit').appendChild(container);
			}
		}
	} else if (blocks[index].operation == 'output') {
		for (let i = 0; i < blocks[index].inPins.length; ++i) {
			if (blocks[index].inPins[i] == null) {
				let text = document.createElement('i');
				text.innerHTML = 'Spacer (<u>remove</u>)';
				text.children[0].style.cursor = 'pointer';
				text.children[0].onclick = removePin;
				let container = document.createElement('div');
				container.classList.add('editPin');
				if (i == 0) {
					let addPinTop = document.createElement('div');
					let addSpacerTop = document.createElement('div');
					addPinTop.innerText = '+';
					addSpacerTop.innerText = '+';
					addPinTop.classList.add('addNew');
					addPinTop.classList.add('addTop');
					addPinTop.classList.add('addPin');
					addSpacerTop.classList.add('addNew');
					addSpacerTop.classList.add('addSpacer');
					addSpacerTop.classList.add('addTop');
					addPinTop.onclick = newPin;
					addSpacerTop.onclick = newSpacer;
					container.appendChild(addPinTop);
					container.appendChild(addSpacerTop);
				}
				container.appendChild(text);
				let addPin = document.createElement('div');
				let addSpacer = document.createElement('div');
				addPin.innerText = '+';
				addSpacer.innerText = '+';
				addPin.classList.add('addNew');
				addPin.classList.add('addPin');
				addSpacer.classList.add('addNew');
				addSpacer.classList.add('addSpacer');
				addPin.onclick = newPin;
				addSpacer.onclick = newSpacer;
				container.appendChild(addPin);
				container.appendChild(addSpacer);
				document.getElementById('edit').appendChild(container);
			} else {
				let name = document.createElement('input');
				name.type = 'text';
				name.classList.add('name');
				name.placeholder = 'Pin Label';
				if (blocks[index].inPins[i].ref.dataset.name == 'Pin')
					name.placeholder = 'Pin Label';
				else name.placeholder = blocks[index].inPins[i].ref.dataset.name;

				let save = document.createElement('input');
				save.type = 'button';
				save.value = 'Save';
				save.disabled = true;
				save.onclick = saveName;

				let button = document.createElement('input');
				button.type = 'button';
				button.value = 'Remove';
				button.class = 'remove';
				button.onclick = removePin;

				let container = document.createElement('div');
				container.classList.add('editPin');

				if (i == 0) {
					let addPinTop = document.createElement('div');
					let addSpacerTop = document.createElement('div');
					addPinTop.innerText = '+';
					addSpacerTop.innerText = '+';
					addPinTop.classList.add('addNew');
					addPinTop.classList.add('addTop');
					addPinTop.classList.add('addPin');
					addSpacerTop.classList.add('addNew');
					addSpacerTop.classList.add('addSpacer');
					addSpacerTop.classList.add('addTop');
					addPinTop.onclick = newPin;
					addSpacerTop.onclick = newSpacer;
					container.appendChild(addPinTop);
					container.appendChild(addSpacerTop);
				}

				container.appendChild(name);
				container.appendChild(save);
				container.appendChild(button);
				let addPin = document.createElement('div');
				let addSpacer = document.createElement('div');
				addPin.innerText = '+';
				addSpacer.innerText = '+';
				addPin.classList.add('addNew');
				addPin.classList.add('addPin');
				addSpacer.classList.add('addNew');
				addSpacer.classList.add('addSpacer');
				addPin.onclick = newPin;
				addSpacer.onclick = newSpacer;
				container.appendChild(addPin);
				container.appendChild(addSpacer);
				document.getElementById('edit').appendChild(container);
			}
		}
	}
	let posY = triggerElem.offsetTop - 35 - document.getElementById('edit').offsetHeight;
	let posX =
		triggerElem.offsetLeft +
		triggerElem.offsetWidth / 2 -
		document.getElementById('edit').offsetWidth / 2;
	posY = posY >= 0 ? posY : 0;
	posX = posX >= 0 ? posX : 0;
	document.getElementById('edit').style.top = posY + 'px';
	document.getElementById('edit').style.left = posX + 'px';

	for (let i = 0; i < document.getElementsByClassName('name').length; ++i) {
		document.getElementsByClassName('name')[i].addEventListener('keyup', () => {
			if (document.getElementsByClassName('name')[i].value != '')
				document.getElementsByClassName('name')[i].nextSibling.disabled = false;
			else document.getElementsByClassName('name')[i].nextSibling.disabled = true;
		});
	}
}

function saveName(event) {
	event.target.previousSibling.placeholder = event.target.previousSibling.value;
	let arr = Array.from(event.target.parentElement.parentElement.children);
	for (let i = 0; i < arr.length; ++i) {
		if (arr[i].children[0].tagName == 'I') {
			arr.splice(i, 1);
			i--;
		}
	}
	currentTarget.ref.children[arr.indexOf(event.target.parentElement)].dataset.name =
		event.target.previousSibling.value;
	if (currentTarget.operation == 'input')
		currentTarget.outNames[
			Array.from(event.target.parentElement.parentElement.children).indexOf(
				event.target.parentElement
			)
		] = event.target.previousSibling.value;
	else
		currentTarget.inNames[
			Array.from(event.target.parentElement.parentElement.children).indexOf(
				event.target.parentElement
			)
		] = event.target.previousSibling.value;
	event.target.previousSibling.value = '';
	event.target.disabled = true;
}

function removePin(event) {
	if (document.getElementById('edit').children.length <= 1) return;
	let side;
	if (event.target.tagName != 'U') {
		let index = Array.from(event.target.parentElement.parentElement.children).indexOf(
			event.target.parentElement
		);
		if (currentTarget.operation == 'input') {
			// Prevent removal if there are no pins
			let numPins = 0;
			for (let i = 0; i < currentTarget.outPins.length; ++i)
				if (currentTarget.outPins[i] != null) numPins++;
			if (numPins < 2) return;

			// Remove pin DOM object
			currentTarget.outPins[index].ref.remove();

			currentTarget.outNames.splice(index, 1);
			clearWires(event, currentTarget.outPins[index]);
			currentTarget.outPins.splice(index, 1);

			side = 1;
		} else {
			// Prevent removal if there are no pins
			let numPins = 0;
			for (let i = 0; i < currentTarget.inPins.length; ++i)
				if (currentTarget.inPins[i] != null) numPins++;
			if (numPins < 2) return;

			// Remove pin DOM object
			currentTarget.inPins[index].ref.remove();
			currentTarget.inNames.splice(index, 1);
			clearWires(event, currentTarget.inPins[index]);
			currentTarget.inPins.splice(index, 1);

			side = 0;
		}
	} else {
		let index = Array.from(
			event.target.parentElement.parentElement.parentElement.children
		).indexOf(event.target.parentElement.parentElement);
		if (currentTarget.operation == 'input') {
			currentTarget.outNames.splice(index, 1);
			currentTarget.outPins.splice(index, 1);
			side = 1;
		} else {
			currentTarget.inNames.splice(index, 1);
			currentTarget.inPins.splice(index, 1);
			side = 0;
		}
	}
	// currentTarget.ref.replaceChildren();
	// currentTarget.ref.innerText = temp;
	// initPins(currentTarget);
	repositionPinsSide(currentTarget, side);

	buildEditMenu(currentTarget.ref);
	evaluate(event);
}

function newSpacer(event) {
	let isTop = event.target.classList.contains('addTop');
	let numPins;
	let side;
	let temp = currentTarget.ref.innerText;
	let index = isTop
		? -1
		: Array.from(event.target.parentElement.parentElement.children).indexOf(
				event.target.parentElement
		  );
	if (currentTarget.operation == 'input') {
		currentTarget.outPins.splice(index + 1, 0, null);
		currentTarget.outNames.splice(index + 1, 0, null);
		numPins = currentTarget.outPins.length;
		side = 1;
	} else {
		//for (let i = 0; i < currentTarget.inPins.length; ++i) {
		// if (currentTarget.inPins[i] != null) clearWires(event, currentTarget.inPins[i]);
		//}
		currentTarget.inNames.splice(index + 1, 0, null);
		currentTarget.inPins.splice(index + 1, 0, null);
		numPins = currentTarget.inPins.length;
		side = 0;
	}
	// currentTarget.ref.replaceChildren();
	// currentTarget.ref.innerText = temp;
	initPin(currentTarget, side, index + 1);
	repositionPinsSide(currentTarget, side);
	buildEditMenu(currentTarget.ref);
	if (index == numPins - 2)
		document.getElementById('edit').scrollTo(0, document.getElementById('edit').scrollHeight);
	evaluate(event);
}

function newPin(event) {
	let isTop = event.target.classList.contains('addTop');
	let numPins;
	let side;
	let temp = currentTarget.ref.innerText;
	let index = isTop
		? -1
		: Array.from(event.target.parentElement.parentElement.children).indexOf(
				event.target.parentElement
		  );
	if (currentTarget.operation == 'input') {
		currentTarget.outPins.splice(index + 1, 0, 1);
		currentTarget.outNames.splice(index + 1, 0, 'Pin');
		numPins = currentTarget.outPins.length;
		side = 1;
	} else {
		// for (let i = index; i < currentTarget.inPins.length; ++i) {
		// 	if (currentTarget.inPins[i] != null) {
		// 		clearWires(event, currentTarget.inPins[i]);
		// 	}
		// }
		currentTarget.inPins.splice(index + 1, 0, 1);
		currentTarget.inNames.splice(index + 1, 0, 'Pin');
		numPins = currentTarget.inPins.length;
		side = 0;
	}
	// currentTarget.ref.replaceChildren();
	// currentTarget.ref.innerText = temp;
	initPin(currentTarget, side, index + 1);
	repositionPinsSide(currentTarget, side);
	buildEditMenu(currentTarget.ref);
	if (index == numPins - 2)
		document.getElementById('edit').scrollTo(0, document.getElementById('edit').scrollHeight);
	evaluate(event);
}

function contextMenu(event, mode) {
	let menu = document.getElementById('contextMenu');
	let options = document.getElementById('contextOptions');
	options.replaceChildren();

	if (mode == 'createBlock') {
		document.getElementById('contextMenuHeader').innerText = 'Create Block';
		let and = document.createElement('div');
		and.innerText = 'AND';
		and.onclick = (event) => {
			createBlockFromCMenu('and', event);
		};
		let not = document.createElement('div');
		not.innerText = 'NOT';
		not.onclick = (event) => {
			createBlockFromCMenu('not', event);
		};
		options.appendChild(and);
		options.appendChild(not);

		for (let i = 0; i < data.length; ++i) {
			let newData = data[i];
			let newOption = document.createElement('div');
			newOption.innerText = newData.name;
			newOption.onclick = (e) => {
				createBlockFromCMenu(newData.name, e);
			};
			document.getElementById('contextOptions').appendChild(newOption);
			document.getElementById(
				'contextBackgroundStyle'
			).innerHTML += `#contextOptions div:nth-child(${
				document.getElementById('contextOptions').children.length
			}):hover{background-color: ${newData.color}!important;}`;
		}
	} else if (mode == 'blockOptions') {
		document.getElementById('contextMenuHeader').innerText = 'Block Options';
		let blockName = event.target.innerText;
		if (blockName != 'AND' && blockName != 'NOT') {
			let deleteOption = document.createElement('div');
			deleteOption.innerText = 'Delete Block';
			document.getElementById('contextOptions').appendChild(deleteOption);
			document.getElementById(
				'contextBackgroundStyle'
			).innerHTML += `#contextOptions div:nth-child(${
				document.getElementById('contextOptions').children.length
			}):hover{background-color: rgb(232, 15, 0)!important;}`;
			deleteOption.onclick = () => {
				menu.style.transform = 'scaleY(0)';
				menu.style.opacity = '0';
				removeBlockFromData(blockName);
			};
		}
	}

	menu.style.top = event.clientY + 'px';
	menu.style.left = event.clientX + 'px';
	menu.style.transform = 'scaleY(1)';
	menu.style.opacity = '1';
	menu.scrollTop = 0;
}

