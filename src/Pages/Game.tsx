import React, { useState } from "react";
import {
    Container,
    TextField,
    Button,
    Grid,
    Typography,
    Box,
    Alert,
} from "@mui/material";
import MD5 from "crypto-js/md5";

export const Game = () => {
    const [formData, setFormData] = useState({
        orderId: "",
        amount: "",
        description: "",
        merchantId: 2, // UMI-MERCHANT-ID
        ts: Math.floor(Date.now() / 1000),
        sign: "",
        extraParams: "",
    });

    const key = "d03b8486ce7d8ec4c3600c6ff5123013"; // Signature key (UMI-API-KEY)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const calculateSignature = () => {
        const { orderId, amount, description, merchantId, ts } = formData;
        let str = "";

        const param = { merchantId, orderId, amount, description }; // WITHOUT Extraparams
        // !!! SIGN STRING SHOULD BE: ${merchantId}${orderId}${amount}${description} 

        for (const paramKey in param) {
            if (Object.prototype.hasOwnProperty.call(param, paramKey)) {
                const value = param[paramKey as keyof typeof param];
                str += `${value}`;
            }
        }

        str += `${ts}${key}`;
        console.log("str", str);
        const sign = MD5(str).toString();

        setFormData((prev) => ({ ...prev, sign }));
    };

    const handleSubmit = () => {
        const { orderId, amount, description, merchantId, ts, sign, extraParams } = formData;

        const jsonData = {
            orderId,
            amount,
            description,
            merchantId,
            ts,
            sign,
            extraParams,
        };

        console.log("Posting message to iframe:", jsonData);

        // Post message to iframe's parent
        window.parent.postMessage(jsonData, "*");
    };

    return (
        <Container maxWidth="sm" style={{ backgroundColor: "#fff" }}>
            <Box sx={{ mt: 4, mb: 2 }}>
                <Typography variant="h5" align="center" gutterBottom>
                    Initiate Recharge
                </Typography>
            </Box>
            <Alert severity="info" sx={{ mb: 3 }}>
                <Typography variant="body2">
                    <strong>How this works:</strong>
                    <ol>
                        <li>Fill in the form with required details such as Order ID, Amount, Description, etc.</li>
                        <li>Click "Calculate Signature" to generate a secure signature based on the form data and timestamp.</li>
                        <li>Click "Submit" to send the recharge request to the parent page using <code>postMessage</code>.</li>
                        <li>
                            The parent page will receive and process the request. Ensure the signature is valid for successful processing.
                        </li>
                    </ol>
                </Typography>
            </Alert>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Order ID"
                        name="orderId"
                        value={formData.orderId}
                        onChange={handleChange}
                        variant="outlined"
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Amount (USD)"
                        name="amount"
                        value={formData.amount}
                        onChange={handleChange}
                        variant="outlined"
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        variant="outlined"
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Merchant ID"
                        name="merchantId"
                        value={formData.merchantId}
                        onChange={handleChange}
                        variant="outlined"
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Timestamp (seconds)"
                        name="ts"
                        value={formData.ts}
                        variant="outlined"
                        disabled
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Signature"
                        name="sign"
                        value={formData.sign}
                        variant="outlined"
                        disabled
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Extra Parameters"
                        name="extraParams"
                        value={formData.extraParams}
                        onChange={handleChange}
                        variant="outlined"
                    />
                </Grid>
                <Grid item xs={6}>
                    <Button
                        fullWidth
                        variant="contained"
                        color="secondary"
                        onClick={calculateSignature}
                    >
                        Calculate Signature
                    </Button>
                </Grid>
                <Grid item xs={6}>
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                    >
                        Submit
                    </Button>
                </Grid>
            </Grid>
            <Box sx={{ mt: 4 }}>
                <Alert severity="warning">
                    Please test this page in our testing environment:
                    <strong>
                        {" "}
                        <a href="https://preview.umiverse.io/game/debug" target="_blank" rel="noopener noreferrer">
                            https://preview.umiverse.io/game/debug
                        </a>
                    </strong>
                </Alert>
            </Box>
        </Container>
    );
};