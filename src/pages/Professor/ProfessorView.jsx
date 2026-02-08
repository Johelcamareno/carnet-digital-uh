import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useNavigate } from 'react-router-dom';
import { QrCode, CheckCircle, Search, User } from 'lucide-react';

const ProfessorView = () => {
    const { logout } = useAuth();
    const { students } = useData();
    const navigate = useNavigate();

    // Estados para escáner
    const [scanning, setScanning] = useState(false);
    const [scannedData, setScannedData] = useState(null);

    // Estados para búsqueda manual
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const handleSimulateScan = () => {
        setScanning(true);
        setTimeout(() => {
            setScanning(false);
            setScannedData({
                id: '2024-0123',
                name: 'Estudiante Simulado',
                time: new Date().toLocaleTimeString()
            });
        }, 2000);
    };

    const handleSearch = (e) => {
        const term = e.target.value;
        setSearchTerm(term);
        if (term.length > 2) {
            const results = students.filter(s =>
                s.name.toLowerCase().includes(term.toLowerCase()) ||
                s.id.includes(term)
            );
            setSearchResults(results);
        } else {
            setSearchResults([]);
        }
    };

    const handleSelectStudent = (student) => {
        setScannedData({
            id: student.id,
            name: student.name,
            time: new Date().toLocaleTimeString() + ' (Manual)'
        });
        setSearchTerm('');
        setSearchResults([]);
    };

    return (
        <div className="layout-container" style={{ flexDirection: 'column', gap: '2rem', paddingBottom: '4rem' }}>
            <header style={{ width: '100%', maxWidth: '600px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>Escáner de Asistencia</h1>
                <button onClick={() => { logout(); navigate('/'); }} style={{ padding: '0.5rem', background: 'transparent', border: '1px solid white', color: 'white', borderRadius: '8px' }}>Salir</button>
            </header>

            {/* Resultado de Asistencia */}
            {scannedData ? (
                <div className="glass-panel fade-in" style={{ padding: '3rem', textAlign: 'center', width: '100%', maxWidth: '400px' }}>
                    <CheckCircle size={64} color="#4ade80" style={{ marginBottom: '1rem', margin: '0 auto' }} />
                    <h2>¡Asistencia Registrada!</h2>
                    <p style={{ marginTop: '0.5rem', fontSize: '1.2rem', fontWeight: 'bold' }}>{scannedData.name}</p>
                    <p style={{ color: 'var(--text-secondary)' }}>Hora: {scannedData.time}</p>
                    <button onClick={() => setScannedData(null)} style={{ marginTop: '2rem', padding: '0.8rem 1.5rem', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '8px', color: 'white', cursor: 'pointer' }}>
                        Escanear Siguiente
                    </button>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '100%', maxWidth: '400px', alignItems: 'center' }}>

                    {/* Escáner Visual */}
                    <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', width: '100%' }}>
                        <div style={{ width: '180px', height: '180px', border: '2px dashed var(--accent-primary)', borderRadius: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
                            {scanning && <div className="scan-line"></div>}
                            <QrCode size={64} style={{ opacity: 0.5 }} />
                        </div>
                        <p style={{ textAlign: 'center' }}>{scanning ? 'Escaneando...' : 'Apunta al código QR'}</p>
                        <button onClick={handleSimulateScan} style={{ padding: '1rem 2rem', background: 'var(--accent-primary)', border: 'none', borderRadius: '12px', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>
                            Simular Escaneo
                        </button>
                    </div>

                    {/* Búsqueda Manual */}
                    <div className="glass-panel" style={{ padding: '1.5rem', width: '100%' }}>
                        <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Search size={18} /> Búsqueda Manual
                        </h3>
                        <input
                            type="text"
                            placeholder="Buscar por nombre o ID..."
                            value={searchTerm}
                            onChange={handleSearch}
                            style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
                        />

                        {searchResults.length > 0 && (
                            <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '200px', overflowY: 'auto' }}>
                                {searchResults.map(s => (
                                    <div key={s.id} onClick={() => handleSelectStudent(s)} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '0.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', cursor: 'pointer' }}>
                                        <User size={16} />
                                        <div style={{ textAlign: 'left' }}>
                                            <p style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>{s.name}</p>
                                            <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{s.id}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                </div>
            )}

            <style>{`
                .scan-line {
                    position: absolute;
                    width: 100%;
                    height: 2px;
                    background: #4ade80;
                    box-shadow: 0 0 10px #4ade80;
                    animation: scan 1.5s infinite linear;
                }
                @keyframes scan {
                    0% { top: 10%; opacity: 0; }
                    50% { opacity: 1; }
                    100% { top: 90%; opacity: 0; }
                }
            `}</style>
        </div>
    );
};

export default ProfessorView;
