// let data = [
// 	{
// 		"name": "or",
// 		"components":
// 		[
// 			{
// 				"name": "input",
// 				"inPins": [],
// 				"outPins": [false, null, false],
// 				"connections": [
// 					[[1, 0]],
// 					null,
// 					[[2, 0]]
// 				]			
// 			},
// 			{
// 				"name": "not",
// 				"inPins": [false],
// 				"outPins": [false],
// 				"connections": [
// 					[[3, 0]]
// 				]
// 			},
// 			{
// 				"name": "not",
// 				"inPins": [false],
// 				"outPins": [false],
// 				"connections": [
// 					[[3, 1]]
// 				]
// 			},
// 			{
// 				"name": "and",
// 				"inPins": [false, false],
// 				"outPins": [false],
// 				"connections": [
// 					[[4, 0]]
// 				]
// 			},
// 			{
// 				"name": "not",
// 				"inPins": [false],
// 				"outPins": [false],
// 				"connections": [
// 					[[5, 0]]
// 				]
// 			},
// 			{
// 				"name": "output",
// 				"inPins": [false],
// 				"outPins": [],
// 				"connections": []
// 			}
// 		]
// 	},
// 	{
// 		"name": "or_but_better",
// 		"components": [
// 			{
// 				"name": "input",
// 				"inPins": [],
// 				"outPins": [false, false],
// 				"connections": [
// 					[[1, 0]],
// 					[[1, 1]]
// 				]
// 			},
// 			{
// 				"name": "or",
// 				"inPins": [false, false],
// 				"outPins": [false],
// 				"connections": [
// 					[[2, 0]]
// 				]
// 			},
// 			{
// 				"name": "output",
// 				"inPins": [false],
// 				"outPins": [],
// 				"connections": []
// 			}
// 		]
// 	}
// ]
let data = [
	{"name":"my_or","components":[{"name":"and","inPins":[false,false],"outPins":[false],"connections":[[]]},{"name":"and","inPins":[false,false],"outPins":[false],"connections":[[]]},{"name":"input","inPins":[],"outPins":[false,false],"connections":[[[4,0]],[[5,0]]]},{"name":"halfadder","inPins":[false,false],"outPins":[false,false],"connections":[[],[]]},{"name":"not","inPins":[false],"outPins":[false],"connections":[[[8,0]]]},{"name":"not","inPins":[false],"outPins":[false],"connections":[[[8,1]]]},{"name":"not","inPins":[false],"outPins":[false],"connections":[[[9,0]]]},{"name":"or","inPins":[false,null,false],"outPins":[false],"connections":[[]]},{"name":"and","inPins":[false,false],"outPins":[false],"connections":[[[6,0]]]},{"name":"output","inPins":[false],"outPins":[],"connections":[]}]}
];
// data.push(JSON.parse('{"name":"my_or","components":[{"name":"and","inPins":[false,false],"outPins":[false],"connections":[[]]},{"name":"and","inPins":[false,false],"outPins":[false],"connections":[[]]},{"name":"input","inPins":[],"outPins":[false,false],"connections":[[[4,0]],[[5,0]]]},{"name":"halfadder","inPins":[false,false],"outPins":[false,false],"connections":[[],[]]},{"name":"not","inPins":[false],"outPins":[false],"connections":[[[8,0]]]},{"name":"not","inPins":[false],"outPins":[false],"connections":[[[8,1]]]},{"name":"not","inPins":[false],"outPins":[false],"connections":[[[9,0]]]},{"name":"or","inPins":[false,null,false],"outPins":[false],"connections":[[]]},{"name":"and","inPins":[false,false],"outPins":[false],"connections":[[[6,0]]]},{"name":"output","inPins":[false],"outPins":[],"connections":[]}]}'));
function evaluateFromData(index, input){
	let block = structuredClone(data[index]);
	let components = block.components;
	let idx = -1;
	for (let i = 0; i < components.length; ++i){
		if (components[i].name == "input"){
			idx = i;
			break;
		}
	}
	let blockQueue = [components[idx]];
	while (blockQueue.length > 0){
		if (blockQueue[0].name == "input"){
			blockQueue[0].outPins = input;
		}
		else if (blockQueue[0].name == "not"){
			blockQueue[0].outPins[0] = !blockQueue[0].inPins[0];
		}
		else if (blockQueue[0].name == "and"){
			blockQueue[0].outPins[0] = (blockQueue[0].inPins[0] && blockQueue[0].inPins[1]);
		}
		else if (blockQueue[0].name == "output"){
			if (blockQueue.length == 1) break;
			else{
				blockQueue.push(blockQueue[0]);
				blockQueue.splice(0, 1);
				continue;
			}
		}
		else{
			let output = [];
			for (let i = 0; i < data.length; ++i){
				if (data[i].name == blockQueue[0].name){
					let input = [];
					for (let j = 0; j < blockQueue[0].inPins.length; ++j){
						input.push(blockQueue[0].inPins[j]);
					}
					output = evaluateFromData(i, input);
					break;
				}
			}
			for (let i = 0; i < output.length; ++i){
				blockQueue[0].outPins[i] = output[i];
			}
		}
		for (let i = 0; i < blockQueue[0].outPins.length; ++i){
			if (blockQueue[0].outPins[i] != null){
				for (let k = 0; k < blockQueue[0].connections[i].length; ++k){
					components[blockQueue[0].connections[i][k][0]].inPins[[blockQueue[0].connections[i][k][1]]] = blockQueue[0].outPins[i];
					if (blockQueue.indexOf(components[blockQueue[0].connections[i][k][0]]) == -1){
						blockQueue.push(components[blockQueue[0].connections[i][k][0]]);
					}
				}
			}
		}
		blockQueue.splice(0, 1);
	}
	idx = -1;
	for (let i = 0; i < components.length; ++i){
		if (components[i].name == "output"){
			idx = i;
			break;
		}
	}
	return components[idx].inPins;

}

function evaluate(event, extraBlocks){
	let input = 0;
	for (let i = 0; i < blocks.length; ++i){
		if (blocks[i].operation == "input"){
			input = i;
			break;
		}
	}
	let blockQueue = [blocks[input]];
	if (extraBlocks) blockQueue = extraBlocks.concat(blockQueue);
	while (blockQueue.length > 0){
		switch (blockQueue[0].operation){
			case "and":
				if (blockQueue[0].inPins[0].active && blockQueue[0].inPins[1].active){
					blockQueue[0].outPins[0].active = true;
				}
				else blockQueue[0].outPins[0].active = false;
				break;
			// case "or":
			// 	if (blockQueue[0].inPins[0].active || blockQueue[0].inPins[1].active){
			// 		blockQueue[0].outPins[0].active = true;
			// 	}
			// 	else blockQueue[0].outPins[0].active = false;
			// 	break;
			case "not":
				blockQueue[0].outPins[0].active = !blockQueue[0].inPins[0].active;
				break;
			case "halfadder":
				if (blockQueue[0].inPins[0].active != blockQueue[0].inPins[1].active){
					blockQueue[0].outPins[0].active = true;
				}
				else blockQueue[0].outPins[0].active = false;
				break;
			default:
				let output = [];
				for (let i = 0; i < data.length; ++i){
					if (data[i].name == blockQueue[0].operation){
						let input = [];
						for (let j = 0; j < blockQueue[0].inPins.length; ++j){
							if (blockQueue[0].inPins[j] != null) input.push(blockQueue[0].inPins[j].active);
							else input.push(null);
						}
						output = evaluateFromData(i, input);
						break;
					}
				}
				for (let i = 0; i < output.length; ++i){
					blockQueue[0].outPins[i].active = output[i];
				}
				break;
		}
		for (let i = 0; i < blockQueue[0].inPins.length; ++i){
			if (blockQueue[0].inPins[i] != null && !blockQueue[0].inPins[i].active && blockQueue[0].inPins[i].ref.classList.contains('isActive')) blockQueue[0].inPins[i].ref.classList.remove('isActive');
		}
		for (let i = 0; i < blockQueue[0].outPins.length; ++i){

			if (blockQueue[0].outPins[i] != null){
				if (blockQueue[0].outPins[i].active) blockQueue[0].outPins[i].ref.classList.add("isActive");
				else blockQueue[0].outPins[i].ref.classList.remove("isActive");

				for (let k = 0; k < blockQueue[0].outPins[i].connected.length; ++k){
					blockQueue[0].outPins[i].connected[k].active = blockQueue[0].outPins[i].active;
					
					if (blockQueue[0].outPins[i].active){
						blockQueue[0].outPins[i].connected[k].ref.classList.add("isActive");
					}

					else{
						blockQueue[0].outPins[i].connected[k].ref.classList.remove("isActive");
					}

					let connectedBlock = blockQueue[0].outPins[i].connected[k].block;
					if (blockQueue.indexOf(connectedBlock) == -1) blockQueue.push(connectedBlock);
				}
			}
		}
		blockQueue.splice(0, 1);
	}
	updateLines(event);
}