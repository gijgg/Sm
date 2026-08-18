const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 3000;

// आपका मेन टारगेट सर्वर
const TARGET_SERVER = "https://version.astutech.online/";

// 1. सभी आने वाले Headers, Tokens, Cookies और Data को ट्रांसपेरेंटली फॉरवर्ड करना
app.use('/', createProxyMiddleware({
    target: TARGET_SERVER,
    changeOrigin: true,
    autoRewrite: true,
    ws: true, // WebSocket / Live Connections के लिए
    onProxyReq: (proxyReq, req, res) => {
        // क्लाइंट के सभी मूल Headers को सुरक्षित रखना
        Object.keys(req.headers).forEach((key) => {
            proxyReq.setHeader(key, req.headers[key]);
        });
    },
    onProxyRes: (proxyRes, req, res) => {
        // Garena सर्वर से आने वाले सभी Response Headers को वापस क्लाइंट को देना
        Object.keys(proxyRes.headers).forEach((key) => {
            res.setHeader(key, proxyRes.headers[key]);
        });
    },
    onError: (err, req, res) => {
        console.error('Proxy Error:', err);
        res.status(500).json({ error: 'Proxy connection failed' });
    }
}));

app.listen(PORT, () => {
    console.log(`Server running smoothly on port ${PORT}`);
});
