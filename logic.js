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
			case "or":
				if (blockQueue[0].inPins[0].active || blockQueue[0].inPins[1].active){
					blockQueue[0].outPins[0].active = true;
				}
				else blockQueue[0].outPins[0].active = false;
				break;
			case "not":
				blockQueue[0].outPins[0].active = !blockQueue[0].inPins[0].active;
				break;
			case "halfadder":
				if (blockQueue[0].inPins[0].active != blockQueue[0].inPins[1].active){
					blockQueue[0].outPins[0].active = true;
				}
				else blockQueue[0].outPins[0].active = false;
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