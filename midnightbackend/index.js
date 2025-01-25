const express = require('express');
const Web3 = require('web3');
const app = express();
app.use(express.json());

const web3 = new Web3('https://testnet.midnight.org');
const contractAddress = 'CONTRACT_ADDRESS';
const contractABI = [/* ABI JSON */];
const auctionContract = new web3.eth.Contract(contractABI, contractAddress);

app.post('/submit-bid', async (req, res) => {
    const { userId, bidAmount } = req.body;

    // Process logic (e.g., validate bid)
    if (bidAmount <= currentHighestBid) {
        return res.status(400).json({ message: 'Bid too low.' });
    }

    // Update state on blockchain
    try {
        await auctionContract.methods
            .validateBid(bidAmount, userId)
            .send({ from: backendWalletAddress, gas: 3000000 });

        res.json({ message: 'Bid successfully submitted!' });
    } catch (error) {
        res.status(500).json({ message: 'Blockchain interaction failed', error });
    }
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
