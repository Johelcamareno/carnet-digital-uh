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

    useEffect(() => {
        // Simulación: En el futuro aquí conectaremos con el backend real
        const simulateValidation = () => {
            setTimeout(() => {
                if (token === 'test-token' || token.startsWith('jo-uh')) {
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
                } else {
                    setError(true);
                }
                setLoading(false);
            }, 1500);
        };

        if (token) {
            simulateValidation();
        } else {
            setError(true);
            setLoading(false);
        }
    }, [token]);

    if (loading) {
        return (
            <div className="layout-container" style={{ justifyContent: 'center', flexDirection: 'column', gap: '1rem' }}>
                <Loader className="spin-fast" size={48} color="var(--accent-primary)" />
                <p>Verificando credencial...</p>
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
                    <p style={{ fontSize: '0.8rem', opacity: 0.7 }}>Token: {token.substring(0, 8)}...</p>
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
