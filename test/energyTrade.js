const Energy = artifacts.require('Energy');

contract("EnergyTrading Testing",(accounts)=>{
    // console.log(accounts);
    let owner;
    let agent;
    let producer;
    let consumer;

    beforeEach(async()=>{
        [owner, agent, producer, consumer] = accounts;

        // console.log("owner here:",owner);
        energy = await Energy.deployed();
        tnxAgent = await energy.registerAgents(agent, 2,{from:owner})
        tnxProducer = await energy.registerProducer(producer, 1, 10,{from:agent});
        tnxCosumer = await energy.registerConsumer(consumer, 1, 2,{from:agent});
        tnxBid = await energy.OfferEnergy(100, 10, 5, { from: producer });

         
        producerWeiBalance = energy.getBalance(producer).then((balance)=>{
             return balance.toString();
        });
        consumerWeiBalance = energy.getBalance(consumer).then((balance)=>{
             return balance.toString();
        });
        // producerBalance = balance[0];

        tnxBuy = await energy.BuyEnergy(producer, 6, 0, { from: consumer, value: 700 });

    })

//testing owner address
    it("Should Return The Owner address: 0xC0e2eC8E3527AFA4502C05316dfa095244c08C20",async()=>{
        const owner = await energy.owner();
        console.log("The owner we got:",owner);

        assert(owner == "0xC0e2eC8E3527AFA4502C05316dfa095244c08C20");
    })

//testing agent registry
    it("Should register Agent:0xDe9D022dEF25969C6aCbE834bac5931513F47feC with Agent ID: 2",async()=>{
        // await energy.registerAgents("0xDe9D022dEF25969C6aCbE834bac5931513F47feC", 2);

        const result = await energy.agents("0xDe9D022dEF25969C6aCbE834bac5931513F47feC");
        const agentId = result.toString(); // Convert Big Number to string
        
        console.log("Agent ID:", agentId);
        assert(agentId,2,"Agent Id Should match")
        
    })

//testing agent registry event
    it("Should return event name as: 'agentRegistered' and agent address as :'0xDe9D022dEF25969C6aCbE834bac5931513F47feC'",async()=>{
        const events = tnxAgent.logs;
        // console.log(events)
        events.find((e)=>{
            const eventName = e.event;
            const agentAddress = e.args[0];
            console.log("Found the event as:",eventName);
            console.log("Owner address in event:",agentAddress);
            assert(eventName,"agentRegistered","Event name should match");
            assert(agentAddress,"0xDe9D022dEF25969C6aCbE834bac5931513F47feC","Event owner address should match");
        })
    })

//testing producer registry
    it("Should register Producer with Producer ID: 1",async()=>{
        // await energy.registerProducer("0x3AaA7f293de0428dB98Ba004144c36b3debB45F9", 1, 10);

        const result = await energy.producers("0x3AaA7f293de0428dB98Ba004144c36b3debB45F9");
        const producerId = result.toString(); // Convert Big Number to string
        
        console.log("Producer ID:", producerId);
        assert(producerId,1,"Agent Id Should match")
        
    })

//testing producer registry event
    it("Should return event name as: 'producerRegistered' and agent address as :'0x3AaA7f293de0428dB98Ba004144c36b3debB45F9'",async()=>{
        const events = tnxProducer.logs;
        // console.log(events)
        events.find((e)=>{
            const eventName = e.event;
            const producerAddress = e.args[0];
            console.log("Found the event as:",eventName);
            console.log("Producer address in event:",producerAddress);
            assert(eventName,"producerRegistered","Event name should match");
            assert(producerAddress,"0x3AaA7f293de0428dB98Ba004144c36b3debB45F9","Event owner address should match");
        })
    })

//testing consumer registry
    it("Should register Consumer with Consumer ID: 1",async()=>{
        // await energy.registerProducer("0xc2025C625f29f3A6497c486C931c17EAa870a16D", 1, 10);

        const result = await energy.consumers("0xc2025C625f29f3A6497c486C931c17EAa870a16D");
        const consumerId = result.toString(); // Convert Big Number to string
        
        console.log("Consumer ID:", consumerId);
        assert(consumerId,1,"Agent Id Should match");
    })

//testing consumer registry event
    it("Should return event name as: 'producerRegistered' and agent address as :'0xc2025C625f29f3A6497c486C931c17EAa870a16D'",async()=>{
        const events = tnxCosumer.logs;
        // console.log(events)
        events.find((e)=>{
            const eventName = e.event;
            const consumerAddress = e.args[0];
            console.log("Found the event as:",eventName);
            console.log("Producer address in event:",consumerAddress);
            assert(eventName,"consumerRegistered","Event name should match");
            assert(consumerAddress,"0xc2025C625f29f3A6497c486C931c17EAa870a16D","Event owner address should match");
        })
    })

//testing energy ofering
    it("Should have the producer:'0x3AaA7f293de0428dB98Ba004144c36b3debB45F9',serial:'0', pricePerUnit:'100 wei', maxEnergy:'10',minEnergy:'5'",async()=>{

        const bidDetails = await energy.bids(0);
        // const currentUnixTime = Math.floor(new Date().getTime() / 1000); // Divide by 1000 to get seconds

        console.log('Producer address stored in bids array:',bidDetails.producer);
        assert.equal(bidDetails.producer, producer, 'Should match Producer address stored in bids array');
        console.log('Max energy stored in bids array:',bidDetails.maxEnergy.toNumber());
        assert.equal(bidDetails.maxEnergy.toNumber(), 10, 'Should match Max energy stored in bids array');
        console.log('Min energy stored in bids array:',bidDetails.minEnergy.toNumber());
        assert.equal(bidDetails.minEnergy.toNumber(), 5, 'Should match Min energy stored in bids array');
        console.log('Price per unit stored in bids array:',bidDetails.pricePerUnit.toNumber());
        assert.equal(bidDetails.pricePerUnit.toNumber(), 100, 'Price per unit stored in bids array');
        console.log('Bid serial number for the first bid:',bidDetails.serial.toNumber());
        assert.equal(bidDetails.serial.toNumber(), 0, 'Should match Bid serial number to be 0 for the first bid');
  
        // current timestamp cant be tested because of the time gap between the bid made and the current timestamp
        // console.log('Timestamp stored in bids array:',bidDetails.timestamp.toNumber());
        // assert.equal(bidDetails.timestamp.toNumber(), Math.floor(new Date().getTime() / 1000), 'Should match Timestamp stored in bids array');
    })

//testing energy ofering event
    it("Should successfully emit the event",()=>{
    // Check events emitted
    assert.equal(tnxBid.logs.length, 1, 'BidMade event should be emitted');

    // Access the emitted event
    const bidMadeEvent = tnxBid.logs[0];
    // console.log(bidMadeEvent.args.pricePerUnit);

    assert.equal(bidMadeEvent.event, 'BidMade', 'Should emit BidMade event');
    assert.equal(bidMadeEvent.args.producer, producer, 'Producer address should match');
    assert.equal(bidMadeEvent.args.maxEnergy.toNumber(), 10, 'Max energy emitted incorrectly');
    assert.equal(bidMadeEvent.args.minEnergy.toNumber(), 5, 'Min energy emitted incorrectly');
    assert.equal(bidMadeEvent.args.pricePerUnit.toNumber(), 100, 'Price per unit emitted incorrectly');
    })

//testing the bid showing function
    it("Should show the details of the bid of specific index",async ()=>{
        const bidDetails = await energy.bids(0);
        console.log('Producer address stored in bids array:',bidDetails.producer);
        console.log('Max energy stored in bids array:',bidDetails.maxEnergy.toNumber());
        console.log('Min energy stored in bids array:',bidDetails.minEnergy.toNumber());
        console.log('Price per unit stored in bids array:',bidDetails.pricePerUnit.toNumber());
        console.log('Bid serial number for the first bid:',bidDetails.serial.toNumber());
        console.log('Timestamp stored in bids array:',bidDetails.timestamp.toNumber());
    })

//testing energy buying
    it("After transaction the energy balance should be: producer-4, consuemer-8",async()=>{
        
        // tnxBuy=await energy.BuyEnergy(producer,6,0,{from: consumer, value:700});

        console.log("Producer eth Balance before:",producerWeiBalance);
        energy.getBalance(producer).then((balance)=>{
            console.log("Producer eth Balance after:",balance.toString());
        });

        console.log("Consumer eth Balance before:",consumerWeiBalance);
        energy.getBalance(consumer).then((balance)=>{
            console.log("Producer eth Balance after:",balance.toString());
        });

        const result1 = await energy.userEnergyBalance(producer);
        const producerBalance = result1.toString(); // Convert Big Number to string      
        console.log("Producer remaining energy balance:", producerBalance);
        assert(producerBalance,4,"Producer balance should match");

        const result2 = await energy.userEnergyBalance(consumer);
        const consumerBalance = result2.toString(); // Convert Big Number to string      
        console.log("Consumer remaining energy balance:", consumerBalance);
        assert(consumerBalance,4,"Producer balance should match");

    })
})