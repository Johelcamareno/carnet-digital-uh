import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { n8nService } from '../../services/n8nService';
import Tarjeta from '../../components/Tarjeta/Tarjeta';
import AccessDenied from '../../components/AccessDenied/AccessDenied';
import { Loader, CheckCircle } from 'lucide-react';

const Verificar = () => {
    const { id } = useParams();
    const [status, setStatus] = useState('loading'); // loading, success, error
    const [studentData, setStudentData] = useState(null);

    useEffect(() => {
        const verify = async () => {
            if (!id) return;

            // Simulación para pruebas rápidas (Test Token)
            if (id === 'test-token' || id === 'CARNET-001') {
                setTimeout(() => {
                    setStudentData({
                        id: '2024-001',
                        name: 'Juan Perez (Demo)',
                        career: 'Ingeniería de Software',
                        photoUrl: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=200&h=200',
                        status: 'Activo',
                        validThru: '2026'
                    });
                    setStatus('success');
                }, 1000);
                return;
            }

            // Llamada real a n8n
            const result = await n8nService.checkCarnet(id);

            if (result.exists && result.student) {
                setStudentData(result.student);
                setStatus('success');
            } else {
                setStatus('error');
            }
        };

        verify();
    }, [id]);

    if (status === 'loading') {
        return (
            <div className="layout-container" style={{ flexDirection: 'column', gap: '1rem' }}>
                <Loader className="spin-fast" size={50} color="var(--accent-primary)" />
                <h2 style={{ color: 'white' }}>Verificando Carnet...</h2>
                <p style={{ color: 'rgba(255,255,255,0.6)' }}>Conectando con base de datos segura</p>
            </div>
        );
    }

    if (status === 'error') {
        return <AccessDenied />;
    }

    return (
        <div className="layout-container" style={{ flexDirection: 'column', padding: '1rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem', animation: 'fadeIn 0.5s' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(34, 197, 94, 0.2)', padding: '0.5rem 1rem', borderRadius: '50px', border: '1px solid #22c55e' }}>
                    <CheckCircle size={20} color="#4ade80" />
                    <span style={{ color: '#4ade80', fontWeight: 'bold' }}>Carnet Válido</span>
                </div>
            </div>

            <Tarjeta student={studentData} />

            <p style={{ marginTop: '2rem', fontSize: '0.8rem', opacity: 0.5, textAlign: 'center' }}>
                ID Verificado: {id}
            </p>
        </div>
    );
};

export default Verificar;
