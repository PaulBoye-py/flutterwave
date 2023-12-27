import React, {useState} from "react";
import { useFlutterwave, closePaymentModal } from 'flutterwave-react-v3';
import axios from 'axios'
import { InlineWidget } from 'react-calendly'

const Form = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phoneNumber: '',
    })

    const [showCalendly, setShowCalendly] = useState(false);

    const handleInputChange = (event) => {
        const {name, value } = event.target;
        setFormData({...formData, [name]: value});
    }

    const config = {
        public_key: 'FLWPUBK_TEST-4e284725134b4a15fff07c61ca2b288f-X',
        tx_ref: Date.now(),
        amount: 50,
        currency: 'USD',
        payment_options: 'card,mobilemoney,ussd',
        customer: {
            email: formData.email,
            phone_number: formData.name,
            name: formData.name
        },
        customizations: {
          title: 'Empathy Sapce Therapy Session',
          description: 'Payment for items in cart',
          logo: 'https://emapathy-therapists.s3.amazonaws.com/empathy-therapists/favicon.png',
        },
    }

    const handleFlutterPayment = useFlutterwave(config);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await handleFlutterPayment({
                callback: (response) => {
                    console.log(response);
                    closePaymentModal();
                    verifyPayment(response.transaction_id);
                }
            });
            console.log(response); // Log the Flutterwave response
        } catch (error) {
            console.error(error); // Log any errors during payment
        }
    };

    const verifyPayment = async (transactionId) => {
        try {
            const verifyResponse = await axios.get('http://localhost:4000/verify-payment', {
                params: {
                     transaction_id: transactionId,
                    },
            });
            if (verifyResponse.data.success) {
                setShowCalendly(true); // Set state to show Calendly modal
            } else {
                setShowCalendly(false);
            }
        } catch (error) {
            console.error(error); // Handle verification error
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="mx-auto my-auto flex-col justify-center items-center px-4">
                <>
                    <label htmlFor="name">Name</label>
                    <input
                        name="name"
                        type="text"
                        placeholder="Paul Aderoju"
                        value={formData.name}
                        onChange={handleInputChange}
                    />
                </>
               
                <>
                    <label htmlFor="email">Email</label>
                    <input
                        name="email"
                        type="email"
                        placeholder="email.mail@yahoo.com"
                        value={formData.email}
                        onChange={handleInputChange} 
                    />
                </>
               
                <>
                    <label htmlFor="phoneNumber">Phone Number</label>
                    <input
                        name="phoneNumber"
                        type="tel"
                        placeholder="08012345678"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                    />
                </>
                

                <button type="submit">Pay with Flutterwave</button>
            </form>

            {showCalendly && <Calendly />}
        </>
    )
    
}

export default Form

const Calendly = () => {
    return (
        <div>
                <InlineWidget url="https://calendly.com/paul-aderoju"/>
        </div>
    
    )
}

