/**
 * Servicio de conexión con n8n
 * Sigue el patrón solicitado: App -> Fetch -> n8n -> JSON
 */
export const n8nService = {
    /**
     * Verifica si un carnet existe.
     * @param {string} id - El ID del carnet escaneado
     */
    checkCarnet: async (id) => {
        // En Producción (Vercel) usamos el proxy para evitar errores de SSL (Mixed Content)
        // En Desarrollo (Localhost) podemos ir directo si queremos, o usar el proxy si "vercel dev" corre.
        // Por consistencia, y para asegurar que funcione el deploy, usamos la lógica de entorno.

        let url;
        if (import.meta.env.PROD) {
            url = `/api/proxy?id=${encodeURIComponent(id)}`;
        } else {
            // Si hay variable de entorno, usarla directo en dev
            const baseUrl = import.meta.env.VITE_N8N_WEBHOOK_URL;
            if (!baseUrl) {
                console.warn("VITE_N8N_WEBHOOK_URL no está configurada en .env");
                // Fallback para pruebas si el usuario olvidó el .env
                return { exists: false, error: "Falta configuración .env" };
            }
            url = `${baseUrl}?id=${encodeURIComponent(id)}`;
        }

        try {
            console.log(`Verificando ID: ${id} en ${url}`);
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Error en servidor: ${response.status}`);
            }

            const data = await response.json();
            return data; // Esperamos { exists: true/false, student: {...} }
        } catch (error) {
            console.error("Error en checkCarnet:", error);
            return { exists: false, error: "Error de conexión" };
        }
    }
};
