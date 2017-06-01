const SolidityEvent = require("web3/lib/web3/event.js");
const Web3 = require('web3');
const web3 = new Web3(
	new Web3.providers.HttpProvider("http://localhost:8545")
);
console.log('Web3 is connected: ' + web3.isConnected());

const owner = web3.eth.accounts[0];
const consumer = web3.eth.accounts[1];
const producer = web3.eth.accounts[2];

// Load the contract artifacts
const energyMarketArtifacts = require('./build/contracts/EnergyMarket.json');

/// @dev TODO
function addParticipant() {
    loadContract(energyMarketArtifacts).then(market => {
        // Deposit new energy tokens
        return market.addParticipant({
            from: owner,
            gas: 1000000
        });

    }).then(res => {
		console.log(res);
    }).catch(error => {
		console.log(error);
    });
}

/// @dev TODO
function addStoredEnergy(account, amount) {

    loadContract(energyMarketArtifacts).then(market => {
        // Deposit new energy tokens
        return market.addStoredEnergy(producer, amount, {
            from: owner
        });

    }).then(res => {
		console.log(res);
    }).catch(error => {
		console.log(error);
    });
}

/// @dev TODO
function depositEnergyTokens(account, amount) {

    loadContract(energyMarketArtifacts).then(market => {
        // Deposit new energy tokens
        return market.depositEnergyTokens(consumer, amount, {
            from: owner
        });

    }).then(res => {
		console.log(res);
    }).catch(error => {
		console.log(error);
    });
}

/// @dev TODO
function getTokenBalance(account) {
    loadContract(energyMarketArtifacts).then(market => {
        // Deposit new energy tokens
        return market.tokenBalance.call(account);

    }).then(res => {
		console.log(res.toNumber());
    }).catch(error => {
		console.log(error);
    });
}

/// @dev TODO
function getStoredEnergy(account) {
    loadContract(energyMarketArtifacts).then(market => {
        // Deposit new energy tokens
        return market.storedEnergy.call(account);

    }).then(res => {
		console.log(res.toNumber());
    }).catch(error => {
		console.log(error);
    });
}

/// @dev TODO
function transferEnergy(producer, consumer, amount){
    loadContract(energyMarketArtifacts).then(market => {
        // Deposit new energy tokens
        return market.transferEnergy(producer, consumer, amount, {
            from: owner
        });

    }).then(res => {
		console.log(res);
    }).catch(error => {
		console.log(error);
    });
}

/// @dev TODO
function createEventListener(contract, _event) {
    contract[_event]().watch(function(error, result) {
        console.log(error, result);
    })
}

/// @dev TODO
function getMarketLogs() {
    return loadContract(energyMarketArtifacts).then(market => {
        // create the filter for this
        // TODO define the from block
        let filter = web3.eth.filter({
            fromBlock: 0,
            toBlock: 'latest',
            address: market.address,
        });

        // Get all past logs for this product based on the filter
        return filter.get((err, logs) => {
            // default logs are not useful so decode them into the initial event objects
            let decodedLogs = decodeFilterLogsToEventObjects(
                web3, market.abi, logs
            );

            console.log(decodedLogs);
            return decodedLogs;
        });
    });
}

/*
* Helpers
*/
/// @dev Convert the default filter logs into useful event objects
/// Lookup the event object definition with ABI and instantiate with data of the log
function decodeFilterLogsToEventObjects(web3, contractAbi, logs) {
    // Get the event definitions from the ABI which will be used to decode the filter
    // returned events
    var decoders = contractAbi.filter(function (json) {
        return json.type === 'event';
    }).map(function(json) {
        // note first and third params required only by enocde and execute;
        // so don't call those!
        return new SolidityEvent(null, json, null);
    });

    // return the decoded array of all logs
    return logs.map(function(log) {
        // find the decoder that matches this logs 'topic' and decode
        return decoders.find(function(decoder) {
            return (decoder.signature() == log.topics[0].replace("0x",""));
        }).decode(log);
    })
}

/// @dev TODO
function detectNetwork() {
    return new Promise((accept, reject) => {
        web3.version.getNetwork((err, res) => {
            accept(res.toString());
        });
    });
}

/// @dev TODO
function loadContract(contractArtifacts) {
    // Detect current network in order to grab address if deployed
    return detectNetwork().then(network => {
        let address = contractArtifacts.networks[network].address;
        let abi = contractArtifacts.abi;

        return web3.eth.contract(abi).at(address);
    });
}


/*
* Test API Methods
*/
// addParticipant();
// addParticipant();

// depositEnergyTokens(web3.eth.accounts[0], 50);
// getTokenBalance(consumer);
// getTokenBalance(producer);

// addStoredEnergy(producer, 50);
// getStoredEnergy(producer);

// transferEnergy(producer, consumer, 50);

// getMarketLogs();
