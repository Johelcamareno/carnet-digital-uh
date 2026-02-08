
const WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL;

/**
 * Servicio para comunicarse con n8n
 */
export const n8nService = {
    /**
     * Valida un token de estudiante.
     * En Producción: Usa el proxy Serverless (/api/validate) para evitar Mixed Content (SSL).
     * En Desarrollo: Usa la conexión directa para facilitar el debug.
     * @param {string} token 
     * @returns {Promise<Object>} Datos del estudiante
     */
    validateStudent: async (token) => {
        let url;

        // Simulación visual (Test Token)
        if (token === 'test-token') {
            return new Promise(resolve => {
                setTimeout(() => resolve({
                    id: '2024-TEST',
                    name: 'Estudiante de Prueba',
                    career: 'Ingeniería (Simulado)',
                    photoUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&h=200',
                    status: 'Activo',
                    validThru: 'DEC 2026',
                    emergencyContact: 'Soporte: 555-0000',
                    bloodType: 'O+'
                }), 1000);
            });
        }

        // Lógica de Proxy vs Directo
        if (import.meta.env.PROD) {
            // Producción (Vercel): Usar Proxy
            url = `/api/validate?token=${encodeURIComponent(token)}`;
        } else {
            // Desarrollo (Localhost): Directo a n8n
            if (!WEBHOOK_URL) throw new Error('VITE_N8N_WEBHOOK_URL no definida en .env');
            url = `${WEBHOOK_URL}?token=${encodeURIComponent(token)}`;
        }

        console.log(`[n8nService] Validando token en: ${url}`);

        try {
            const response = await fetch(url);

            if (!response.ok) {
                // Intentar leer error del cuerpo
                const errorText = await response.text();
                throw new Error(`Error ${response.status}: ${errorText}`);
            }

            const data = await response.json();
            return data;
        } catch (err) {
            console.error("[n8nService] Fallo en validación:", err);
            throw err;
        }
    }
};
