document.documentElement.style.setProperty('--sliderColor', 'hsl(180, 100%, 68%)');
document.getElementById('colorSlider').addEventListener('input', () => {
	document.documentElement.style.setProperty(
		'--sliderColor',
		'hsl(' + document.getElementById('colorSlider').value + ', 100%, 68%)'
	);
});
document.getElementById('enterName').addEventListener('input', () => {
	document.getElementById('previewBlock').innerText = document.getElementById('enterName').value;
	if (document.getElementById('enterName').value.length == 0)
		document.getElementById('previewBlock').innerText = 'NAME';
	initPreviewPins();
});
function initPreviewPins() {
	let inIndex, outIndex;
	for (let i = 0; i < blocks.length; ++i) {
		if (blocks[i].operation == 'input') inIndex = i;
		else if (blocks[i].operation == 'output') outIndex = i;
	}
	let inNames = blocks[inIndex].outNames;
	let outNames = blocks[outIndex].inNames;
	// The following code took several days to write. I have no idea how it works.
	let maxPins = Math.max(inNames.length, outNames.length);
	if (maxPins > 2)
		document.getElementById('previewBlock').style.height = 15 * (maxPins - 1) + 'px';
	else document.getElementById('previewBlock').style.height = 23.2;
	document.getElementById('previewBlock').style.lineHeight =
		document.getElementById('previewBlock').style.height;
	// See, I'm resorting to ternary operators. That's a sign that something is very, very wrong.
	let outTopPadding =
		outNames.length <= inNames.length || outNames.length < 3
			? (document.getElementById('previewBlock').offsetHeight - 15 * outNames.length) / 2
			: 0;
	let inTopPadding =
		inNames.length <= outNames.length || inNames.length < 3
			? (document.getElementById('previewBlock').offsetHeight - 15 * inNames.length) / 2
			: 0;
	// Scary code over.

	for (let i = 0; i < inNames.length; ++i) {
		if (inNames[i] != null) {
			// Creation of the pin element and application of all of the style stuff.
			let elem = document.createElement('div');
			elem.classList.add('pin');
			// Each pin has 5px of space between them (because each pin is 10x10, 15-10 = 5).
			elem.style.top = inTopPadding + 15 * i + 'px';
			document.getElementById('previewBlock').appendChild(elem);
			elem.style.left = '-7.5px';
			let data = elem.dataset;
			data.name = inNames[i];
		}
	}
	// Believe it or not, this is almost exactly the same as the last bit of code!!
	for (let i = 0; i < outNames.length; ++i) {
		if (outNames[i] != null) {
			let elem = document.createElement('div');
			elem.classList.add('pin');
			elem.style.top = outTopPadding + 15 * i + 'px';
			document.getElementById('previewBlock').appendChild(elem);
			elem.style.left = document.getElementById('previewBlock').offsetWidth - 10 + 'px';
			let data = elem.dataset;
			data.name = outNames[i];
		}
	}
}
function encapsulate() {
	document.getElementById('colorSlider').value = Math.floor(Math.random() * 360);
	document.documentElement.style.setProperty(
		'--sliderColor',
		'hsl(' + document.getElementById('colorSlider').value + ', 100%, 68%)'
	);
	// document.getElementById('encapsulateWindow').style.opacity = '1';
	document.getElementById('encapsulateWindow').style.display = 'block';
	// document.getElementById('encapsulateWindow').style.transform =
	// 	'scale(100%, 100%), translate(-50%, -50%)';
	document.getElementById('blockOut').style.display = 'block';
	// document.getElementById('blockOut').style.opacity = '1';
	initPreviewPins();
}
function closeEncapsulateWindow() {
	document.getElementById('blockOut').style.display = 'none';
	// document.getElementById('blockOut').style.opacity = '0';
	document.getElementById('encapsulateWindow').style.display = 'none';
	// document.getElementById('encapsulateWindow').style.opacity = '0';
	// document.getElementById('encapsulateWindow').style.transform =
	// 	'scale(0, 0), translate(-50%, -50%)';
	document.getElementById('enterName').value = '';
	document.getElementById('previewBlock').innerText = 'NAME';
}
function saveBlock() {
	let newData = {};
	newData.name = document.getElementById('enterName').value;
	if (newData.name == '') newData.name = 'NAME';
	newData.color = 'hsl(' + document.getElementById('colorSlider').value + ', 100%, 68%)';
	let newComponents = [];
	// First loop adds all blocks to components.
	// Starting at one because of the mouse, which is in the blocks array at position 0. This also means that components index + 1 = blocks index.
	for (let i = 1; i < blocks.length; ++i) {
		let component = {};
		if (blocks[i].operation == 'input' || blocks[i].operation == 'output')
			component.pinNames = [];
		component.name = blocks[i].operation;
		component.inPins = [];
		component.outPins = [];
		component.connections = [];
		for (let j = 0; j < blocks[i].inPins.length; ++j) {
			if (blocks[i].inPins[j] != null) {
				component.inPins.push(false);
				if (component.pinNames) component.pinNames.push(blocks[i].inNames[j]);
			} else {
				component.inPins.push(null);
				if (component.pinNames) component.pinNames.push(null);
			}
		}
		for (let j = 0; j < blocks[i].outPins.length; ++j) {
			if (blocks[i].outPins[j] != null) {
				component.outPins.push(false);
				component.connections.push([]);
				for (let k = 0; k < blocks[i].outPins[j].connected.length; ++k) {
					component.connections[j].push([]);
				}
				if (component.pinNames) component.pinNames.push(blocks[i].outNames[j]);
			} else {
				if (component.pinNames) component.pinNames.push(null);
				component.outPins.push(null);
				component.connections.push(null);
			}
		}
		newComponents.push(component);
	}
	// Second loop adds all connections between blocks.
	for (let i = 1; i < blocks.length; ++i) {
		for (let j = 0; j < blocks[i].outPins.length; ++j) {
			if (blocks[i].outPins[j] != null) {
				for (let k = 0; k < blocks[i].outPins[j].connected.length; ++k) {
					newComponents[i - 1].connections[j][k] = [];
					newComponents[i - 1].connections[j][k][0] =
						blocks.indexOf(blocks[i].outPins[j].connected[k].block) - 1;
					newComponents[i - 1].connections[j][k][1] = blocks[i].outPins[j].connected[
						k
					].block.inPins.indexOf(blocks[i].outPins[j].connected[k]);
				}
			}
		}
	}
	newData.components = newComponents;
	data.push(newData);

	let newOption = document.createElement('div');
	newOption.innerText = newData.name;
	newOption.onclick = (e) => {
		createBlockFromCMenu(newData.name, e);
	};
	document.getElementById('contextOptions').appendChild(newOption);
	document.getElementById('contextBackgroundStyle').innerHTML += `#contextOptions div:nth-child(${
		document.getElementById('contextOptions').children.length
	}):hover{background-color: ${newData.color}!important;}`;
	let newSidebarOption = document.createElement('p');
	newSidebarOption.innerText = newData.name;
	document.getElementById('sidebarOptions').appendChild(newSidebarOption);
	document.getElementById('sidebarBackgroundStyle').innerHTML += `#sidebarOptions p:nth-child(${
		document.getElementById('sidebarOptions').children.length
	}):hover{background-color: ${newData.color}!important;}`;
	// document.getElementById('encapsulateWindow').style.opacity = '0';
	document.getElementById('encapsulateWindow').style.display = 'none';
	// document.getElementById('encapsulateWindow').style.transform =
	// 	'scale(0, 0), translate(-50%, -50%)';
	// document.getElementById('blockOut').style.opacity = '0';
	document.getElementById('blockOut').style.display = 'none';
	document.getElementById('enterName').value = '';
	document.getElementById('previewBlock').innerText = 'NAME';
}
