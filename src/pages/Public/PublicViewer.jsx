import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Tarjeta from '../../components/Tarjeta/Tarjeta';
import AccessDenied from '../../components/AccessDenied/AccessDenied';
import { Loader } from 'lucide-react';

const PublicViewer = () => {
    const { token } = useParams();
    const [loading, setLoading] = useState(true);
    const [studentData, setStudentData] = useState(null);
    const [error, setError] = useState(false);

    // URL del Webhook de n8n (reemplazar con la real del usuario)
    const N8N_WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL || 'https://primary-production-4265.up.railway.app/webhook/validar-estudiante';

    useEffect(() => {
        const validateToken = async () => {
            try {
                // Simulación para pruebas si no hay backend real
                if (token === 'test-token') {
                    setTimeout(() => {
                        setStudentData({
                            id: '2024-TEST',
                            name: 'Estudiante de Prueba',
                            career: 'Ingeniería',
                            photoUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&h=200',
                            status: 'Activo',
                            validThru: 'DEC 2026',
                            emergencyContact: 'Mama: 555-1234',
                            bloodType: 'O+'
                        });
                        setLoading(false);
                    }, 1500);
                    return;
                }

                // Lógica Inteligente de URL:
                // En Producción (Vercel): Usar el Proxy local (/api/validate) para evitar error de SSL Mixed Content
                // En Desarrollo (Localhost): Usar directo n8n (o el proxy si vercel dev está corriendo)
                let fetchUrl;
                if (import.meta.env.PROD) {
                    fetchUrl = `/api/validate?token=${token}`;
                } else {
                    // Fallback directo para localhost (aquí HTTP sí funciona)
                    fetchUrl = `${N8N_WEBHOOK_URL}?token=${token}`;
                }

                console.log("Fetching student data from:", fetchUrl);

                const response = await fetch(fetchUrl);
                if (!response.ok) throw new Error('Network response was not ok');

                const data = await response.json();

                // N8N debe devolver { valid: true, student: { ... } } o similar
                // Adaptamos según el flujo del usuario: nombre, estado, foto, serial...
                if (data && (data.id || data.nombre)) {
                    // Mapeo de datos n8n -> App
                    const mappedStudent = {
                        id: data.serial || data.id || 'N/A',
                        name: data.nombre || data.name,
                        career: data.carrera || 'Estudiante UH',
                        photoUrl: data.foto || 'https://via.placeholder.com/150',
                        status: data.estado || 'Activo',
                        validThru: data.expiracion || '2026',
                        emergencyContact: data.emergency_contact || 'No registrado',
                        bloodType: data.blood_type || 'N/A'
                    };
                    setStudentData(mappedStudent);
                } else {
                    setError(true);
                }
            } catch (err) {
                console.error("Error validating token:", err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            validateToken();
        } else {
            setError(true);
            setLoading(false);
        }
    }, [token]);

    if (loading) {
        return (
            <div className="layout-container" style={{ justifyContent: 'center', flexDirection: 'column', gap: '1rem' }}>
                <Loader className="spin-fast" size={48} color="var(--accent-primary)" />
                <p>Verificando credencial en Blockchain Universitaria...</p>
            </div>
        );
    }

    if (error) {
        return <AccessDenied />;
    }

    return (
        <div className="layout-container" style={{ justifyContent: 'center', padding: '1rem' }}>
            <div style={{ width: '100%', maxWidth: '350px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                    <h2 style={{ color: '#4ade80', textShadow: '0 0 10px rgba(74, 222, 128, 0.5)' }}>✓ Credencial Verificada</h2>
                    <p style={{ fontSize: '0.8rem', opacity: 0.7 }}>Token Seguro: {token.substring(0, 8)}...</p>
                </div>
                <Tarjeta student={studentData} />

                {/* Botón UV / Seguridad Extra (Opcional) */}
                <button className="security-btn" onClick={() => document.body.classList.toggle('uv-mode')}>
                    🔦 Inspección UV
                </button>
            </div>

            <style>{`
                .security-btn {
                    padding: 1rem;
                    background: rgba(255,255,255,0.05);
                    border: 1px solid var(--glass-border);
                    color: white;
                    border-radius: 8px;
                    cursor: pointer;
                    margin-top: 1rem;
                    font-weight: bold;
                }
                /* Efecto UV Simulado */
                body.uv-mode .tarjeta-container {
                    filter: drop-shadow(0 0 15px violet) brightness(1.2) contrast(1.2);
                }
                body.uv-mode .student-photo {
                    border-color: violet;
                }
            `}</style>
        </div>
    );
};

export default PublicViewer;
