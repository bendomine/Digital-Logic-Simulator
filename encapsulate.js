function encapsulate(){
	let newData = {};
	newData.name = prompt("What should be the name?");
	let newComponents = [];
	// First loop adds all blocks to components.
	// Starting at one because of the mouse, which is in the blocks array at position 0. This also means that components index + 1 = blocks index.
	for (let i = 1; i < blocks.length; ++i){
		let component = {};
		component.name = blocks[i].operation;
		component.inPins = [];
		component.outPins = [];
		component.connections = [];
		for (let j = 0; j < blocks[i].inPins.length; ++j){
			if (blocks[i].inPins[j] != null) component.inPins.push(false);
			else component.inPins.push(null);
		}
		for (let j = 0; j < blocks[i].outPins.length; ++j){
			if (blocks[i].outPins[j] != null){
				component.outPins.push(false);
				component.connections.push([]);
				for (let k = 0; k < blocks[i].outPins[j].connected.length; ++k){
					component.connections[j].push([]);
				}
			}
			else{
				component.outPins.push(null);
				component.connections.push(null);
			}
		}
		newComponents.push(component);
	}
	// Second loop adds all connections between blocks.
	for (let i = 1; i < blocks.length; ++i){
		for (let j = 0; j < blocks[i].outPins.length; ++j){
			if (blocks[i].outPins[j] != null){
				for (let k = 0; k < blocks[i].outPins[j].connected.length; ++k){
					newComponents[i - 1].connections[j][k] = [];
					newComponents[i - 1].connections[j][k][0] = blocks.indexOf(blocks[i].outPins[j].connected[k].block) - 1;
					newComponents[i - 1].connections[j][k][1] = blocks[i].outPins[j].connected[k].block.inPins.indexOf(blocks[i].outPins[j].connected[k]);
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
	}
	document.getElementById('contextOptions').appendChild(newOption);
}