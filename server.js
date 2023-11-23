const express = require('express');
const fetch = require('node-fetch');
const app = express();

// Allow CORS for all resources
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

// Proxy endpoint
app.get('/steam/gameDetails', async (req, res) => {
    const appid = req.query.appid;
    const countryCode = req.query.countryCode || 'tr';
    const url = `https://store.steampowered.com/api/appdetails?appids=${appid}&cc=${countryCode}`;

    try {
        const steamResponse = await fetch(url);
        const data = await steamResponse.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Server error');
    }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
