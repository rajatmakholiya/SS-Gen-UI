// api/submit.js

export default async function handler(req, res) {
    // 1. Only accept POST requests from your frontend form
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // 2. Updated to HTTPS and removed port 5678 assuming your reverse proxy (Caddy) handles SSL
    const N8N_WEBHOOK_URL = "https://msnssarticle.duckdns.org/webhook/bbb961c0-17ee-44f3-96fa-43732344d9b3";

    try {
        // 3. Forward the request from Vercel to your n8n server
        const response = await fetch(N8N_WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(req.body),
        });

        // 4. Check if n8n accepted the data
        if (response.ok) {
            // Because n8n is set to respond immediately, this resolves instantly
            return res.status(200).json({ success: true, message: 'Workflow triggered successfully.' });
        } else {
            return res.status(response.status).json({ error: 'n8n rejected the request.' });
        }

    } catch (error) {
        // 5. Catch network or DNS errors
        console.error("Proxy Error:", error);
        return res.status(500).json({ error: 'Failed to reach the n8n backend server.' });
    }
}