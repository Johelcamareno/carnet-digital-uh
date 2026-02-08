export default async function handler(request, response) {
    // Configuración CORS
    response.setHeader('Access-Control-Allow-Credentials', true);
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,PUT,DELETE');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (request.method === 'OPTIONS') {
        return response.status(200).end();
    }

    // Obtener parámetros
    const { action } = request.query; // 'validate' o 'create'

    // Determinar URL destino
    let n8nUrl;
    if (action === 'create') {
        n8nUrl = process.env.VITE_N8N_CREATE_WEBHOOK_URL;
    } else {
        // Default: validate
        n8nUrl = process.env.VITE_N8N_WEBHOOK_URL;
    }

    if (!n8nUrl) {
        return response.status(500).json({ error: `Configuration error: Webhook URL for action '${action || 'default'}' not found` });
    }

    try {
        const options = {
            method: request.method,
            headers: {
                'Content-Type': 'application/json',
            },
        };

        // Si es POST/PUT, pasar el cuerpo
        if (['POST', 'PUT', 'PATCH'].includes(request.method) && request.body) {
            options.body = JSON.stringify(request.body);
        }

        // Construir queryString final (pasar params del cliente al n8n)
        // Excluir 'action' porque es interno del proxy
        const queryParams = new URLSearchParams(request.query);
        queryParams.delete('action');
        const queryString = queryParams.toString();

        const targetUrl = queryString ? `${n8nUrl}?${queryString}` : n8nUrl;

        console.log(`Proxying ${request.method} to ${targetUrl}`);

        const fetchResponse = await fetch(targetUrl, options);

        // Devolver status y body originales de n8n
        const data = await fetchResponse.json();
        return response.status(fetchResponse.status).json(data);

    } catch (error) {
        console.error("Proxy Error:", error);
        return response.status(500).json({
            error: 'Proxy connection failed',
            details: error.message
        });
    }
}
