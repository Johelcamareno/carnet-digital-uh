export default async function handler(request, response) {
    // CORS Configuration
    response.setHeader('Access-Control-Allow-Credentials', true);
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (request.method === 'OPTIONS') {
        return response.status(200).end();
    }

    const { id } = request.query;
    const n8nUrl = process.env.VITE_N8N_WEBHOOK_URL;

    if (!n8nUrl) {
        return response.status(500).json({ error: 'Server configuration error: Missing n8n URL' });
    }

    try {
        // Forward the request to n8n
        const fetchResponse = await fetch(`${n8nUrl}?id=${id}`);

        // Pass along the n8n status and data
        const data = await fetchResponse.json();
        return response.status(fetchResponse.status).json(data);

    } catch (error) {
        console.error("Proxy Error:", error);
        return response.status(500).json({
            error: 'Error connecting to validation service',
            details: error.message
        });
    }
}
