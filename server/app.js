const express = require('express');
const cors = require('cors');
require('dotenv').config();
const Flutterwave = require('flutterwave-node-v3');

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
}));

app.get('/verify-payment', async (req, res) => {
    const { transaction_id } = req.query; // Get transaction ID from query params
    console.log(transaction_id)

    try {
        const flw = new Flutterwave(process.env.FLW_PUBLIC_KEY, process.env.FLW_SECRET_KEY);
        const response = await flw.Transaction.verify({ id: transaction_id });

        if (
            response.data.status === 'successful' 
            // response.data.amount === expectedAmount &&
            // response.data.currency === expectedCurrency
        ) {
            // Success! Confirm the customer's payment
            res.status(200).json({ success: true, message: 'Payment verified successfully' });
        } else {
            // Inform the customer their payment was unsuccessful
            res.status(400).json({ success: false, message: 'Payment verification failed' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
