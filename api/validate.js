export default async function handler(request, response) {
    // Configurar CORS para permitir peticiones desde la app
    response.setHeader('Access-Control-Allow-Credentials', true);
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    response.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (request.method === 'OPTIONS') {
        response.status(200).end();
        return;
    }

    const { token } = request.query;
    // Usar la variable de entorno configurada en Vercel
    const n8nUrl = process.env.VITE_N8N_WEBHOOK_URL;

    if (!n8nUrl) {
        return response.status(500).json({ error: 'Configuración del servidor incompleta (Falta URL n8n)' });
    }

    try {
        // El servidor de Vercel (Node.js) SÍ puede hacer peticiones HTTP a n8n
        const fetchResponse = await fetch(`${n8nUrl}?token=${token}`);

        if (!fetchResponse.ok) {
            throw new Error(`Error n8n: ${fetchResponse.statusText}`);
        }

        const data = await fetchResponse.json();
        return response.status(200).json(data);

    } catch (error) {
        console.error("Error en proxy:", error);
        return response.status(500).json({
            error: 'Error conectando con el servicio de validación',
            details: error.message
        });
    }
}
