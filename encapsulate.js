function encapsulate(){
	let newData = {};
	newData.name = prompt("What should be the name?");
	let newComponents = [];
	let blockQueue = [];
	for (let i = 0; i < blocks.length; ++i){
		if (blocks[i].type == "block" && blocks[i].operation == "input"){
			blockQueue.push(blocks[i]);
			break;
		}
	}
	while (blockQueue.length > 0){
		let component = {};
		component.name = blockQueue[0].operation;
		component.inPins = [];
		component.outPins = [];
		component.connections = [];
		for (let i = 0; i < blockQueue[0].inPins.length; ++i){
			if (blockQueue[0].inPins[i] != null) component.inPins.push(false);
		}
		for (let i = 0; i < blockQueue[0].outPins.length; ++i){
			if (blockQueue[0].outPins[i] != null){
				component.outPins.push(false);
				component.connections.push([]);
				for (let j = 0; j < blockQueue[0].outPins[i].connected.length; ++j){
					component.connections[i].push([]);
					blockQueue.push(blockQueue[0].outPins[i].connected[j].block);
				}
			}
		}
		newComponents.push(component);
		blockQueue.splice(0, 1);
	}
	newData.components = newComponents;
	data.push(newData);
}