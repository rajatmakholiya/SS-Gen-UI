// api/submit.js

export default async function handler(req, res) {
    // 1. Only accept POST requests from your frontend form
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // 2. Put your exact n8n webhook URL here (including port 5678)
    const N8N_WEBHOOK_URL = "http://msnssarticle.duckdns.org:5678/webhook/bbb961c0-17ee-44f3-96fa-43732344d9b3";

    try {
        // 3. Forward the request from Vercel to your Hostinger VPS
        const response = await fetch(N8N_WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            // Pass along the exact data the user typed in the form
            body: JSON.stringify(req.body),
        });

        // 4. Check if n8n accepted the data
        if (response.ok) {
            const data = await response.text();
            return res.status(200).json({ success: true, message: 'Workflow triggered' });
        } else {
            return res.status(response.status).json({ error: 'n8n rejected the request' });
        }

    } catch (error) {
        // 5. If Vercel cannot reach your server at all
        console.error("Proxy Error:", error);
        return res.status(500).json({ error: 'Failed to reach backend server' });
    }
}