import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import Tarjeta from '../../components/Tarjeta/Tarjeta';
import Layout from '../../components/Diseno/Layout';
import { useNavigate } from 'react-router-dom';
import { LogOut, AlertTriangle, Camera, Upload } from 'lucide-react';

const StudentView = () => {
    const { user, logout } = useAuth();
    const { updatePhoto } = useData();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [showEmergency, setShowEmergency] = useState(false);

    useEffect(() => {
        if (!user || user.role !== 'student') {
            navigate('/');
        }
    }, [user, navigate]);

    const handlePhotoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                updatePhoto(user.id, reader.result);
                alert('Foto subida exitosamente. Pendiente de aprobación.');
                // Forzar recarga simple para ver cambios (en app real usaríamos estado global reactivo mejor)
                window.location.reload();
            };
            reader.readAsDataURL(file);
        }
    };

    if (!user || !user.data) return null;

    return (
        <Layout>
            <div style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 100 }}>
                <button
                    onClick={() => { logout(); navigate('/'); }}
                    style={{ padding: '0.5rem', background: 'rgba(255,255,255,0.1)', border: '1px solid var(--glass-border)', borderRadius: '50%', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                    <LogOut size={20} />
                </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem', width: '100%' }}>

                <Tarjeta student={user.data} />

                {/* Botones de Acción */}
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>

                    <button
                        onClick={() => fileInputRef.current.click()}
                        className="action-btn"
                        style={{ background: 'var(--accent-primary)' }}
                    >
                        <Camera size={20} /> Actualizar Foto
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handlePhotoUpload}
                        accept="image/*"
                        style={{ display: 'none' }}
                    />

                    <button
                        onClick={() => setShowEmergency(!showEmergency)}
                        className="action-btn"
                        style={{ background: '#ef4444' }}
                    >
                        <AlertTriangle size={20} /> Emergencia
                    </button>
                </div>

                {/* Panel de Emergencia */}
                {showEmergency && (
                    <div className="glass-panel fade-in" style={{ padding: '1.5rem', width: '100%', maxWidth: '320px', border: '1px solid #ef4444' }}>
                        <h3 style={{ color: '#ef4444', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <AlertTriangle /> Contactos de Seguridad
                        </h3>
                        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                            <li>
                                <a href="tel:911" style={{ color: 'white', textDecoration: 'none', display: 'flex', justifyContent: 'space-between', padding: '0.5rem', background: 'rgba(239, 68, 68, 0.2)', borderRadius: '8px' }}>
                                    <span>🚑 Emergencias Nacionales</span>
                                    <strong>911</strong>
                                </a>
                            </li>
                            <li>
                                <a href="tel:+525550000000" style={{ color: 'white', textDecoration: 'none', display: 'flex', justifyContent: 'space-between', padding: '0.5rem', background: 'rgba(239, 68, 68, 0.2)', borderRadius: '8px' }}>
                                    <span>👮 Seguridad Campus</span>
                                    <strong>555-0000</strong>
                                </a>
                            </li>
                        </ul>
                    </div>
                )}

            </div>

            <style>{`
        .action-btn {
            padding: 0.8rem 1.5rem;
            border: none;
            border-radius: 12px;
            color: white;
            font-weight: 600;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
            transition: transform 0.2s;
            box-shadow: 0 4px 6px rgba(0,0,0,0.2);
        }
        .action-btn:active {
            transform: scale(0.95);
        }
      `}</style>
        </Layout>
    );
};

export default StudentView;
