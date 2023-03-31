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
	// while (blockQueue.length > 0){
	// 	let component = {};
	// 	component.name = blockQueue[0].operation;
	// 	component.inPins = [];
	// 	component.outPins = [];
	// 	component.connections = [];
	// 	for (let i = 0; i < blockQueue[0].inPins.length; ++i){
	// 		if (blockQueue[0].inPins[i] != null) component.inPins.push(false);
	// 	}
	// 	for (let i = 0; i < blockQueue[0].outPins.length; ++i){
	// 		if (blockQueue[0].outPins[i] != null){
	// 			component.outPins.push(false);
	// 			component.connections.push([]);
	// 			for (let j = 0; j < blockQueue[0].outPins[i].connected.length; ++j){
	// 				component.connections[i].push([]);
	// 				blockQueue.push(blockQueue[0].outPins[i].connected[j].block);
	// 			}
	// 		}
	// 	}
	// 	newComponents.push(component);
	// 	blockQueue.splice(0, 1);
	// }
	// newData.components = newComponents;
	// data.push(newData);
}