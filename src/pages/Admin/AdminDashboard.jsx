import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { BarChart, Users, Camera, Upload, Check, X } from 'lucide-react';

const AdminDashboard = () => {
    const { students, addStudent, addStudentsBulk, deleteStudent, updateStudent } = useData();
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('list'); // list, create, photos, analytics
    const [csvContent, setCsvContent] = useState('');

    const [newStudent, setNewStudent] = useState({
        id: '', name: '', career: '', status: 'Activo',
        photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
        institutionLogo: 'https://cdn-icons-png.flaticon.com/512/2997/2997235.png',
        validThru: 'DEC 2025', emergencyContact: '', bloodType: ''
    });

    const pendingPhotos = students.filter(s => s.photoStatus === 'pending');

    const handleCreate = (e) => {
        e.preventDefault();
        addStudent(newStudent);
        alert('Estudiante creado');
        setNewStudent({ ...newStudent, id: '', name: '', career: '' });
    };

    const handleBulkUpload = () => {
        try {
            const lines = csvContent.split('\n');
            const newStudents = [];
            lines.forEach(line => {
                const [id, name, career] = line.split(',');
                if (id && name) {
                    newStudents.push({
                        ...newStudent, // Use defaults
                        id: id.trim(),
                        name: name.trim(),
                        career: career ? career.trim() : 'General'
                    });
                }
            });
            addStudentsBulk(newStudents);
            alert(`Se importaron ${newStudents.length} estudiantes.`);
            setCsvContent('');
        } catch (e) {
            alert('Error al procesar CSV');
        }
    };

    const handleApprovePhoto = (id, approved) => {
        if (approved) {
            updateStudent(id, { photoStatus: 'approved' });
        } else {
            // Revert to placeholder or keep rejected status
            updateStudent(id, {
                photoStatus: 'rejected',
                photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80'
            });
        }
    };

    return (
        <div className="layout-container" style={{ padding: '2rem', justifyContent: 'flex-start' }}>
            <header style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1>Panel de Administrador</h1>
                <button onClick={() => { logout(); navigate('/'); }} style={{ padding: '0.5rem 1rem', background: '#ef4444', border: 'none', borderRadius: '8px', color: 'white', cursor: 'pointer' }}>
                    Cerrar Sesión
                </button>
            </header>

            {/* Tabs de Navegación */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                <TabButton icon={<Users size={18} />} label="Lista" active={activeTab === 'list'} onClick={() => setActiveTab('list')} />
                <TabButton icon={<Upload size={18} />} label="Alta Masiva" active={activeTab === 'create'} onClick={() => setActiveTab('create')} />
                <TabButton icon={<Camera size={18} />} label={`Fotos (${pendingPhotos.length})`} active={activeTab === 'photos'} onClick={() => setActiveTab('photos')} />
                <TabButton icon={<BarChart size={18} />} label="Estadísticas" active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} />
            </div>

            <div style={{ width: '100%', maxWidth: '1200px' }}>

                {activeTab === 'list' && (
                    <div className="glass-panel" style={{ padding: '1.5rem' }}>
                        <h3>Estudiantes Activos ({students.length})</h3>
                        <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '500px', overflowY: 'auto' }}>
                            {students.map(s => (
                                <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.8rem', borderBottom: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.02)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <img src={s.photoUrl} alt="" style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }} />
                                        <div>
                                            <p style={{ fontWeight: 'bold' }}>{s.name}</p>
                                            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{s.id} - {s.career}</p>
                                        </div>
                                    </div>
                                    <button onClick={() => deleteStudent(s.id)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}>Eliminar</button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'create' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                        <div className="glass-panel" style={{ padding: '1.5rem' }}>
                            <h3>Expender Nuevo Carnet (Individual)</h3>
                            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                                <input placeholder="ID Estudiante" value={newStudent.id} onChange={e => setNewStudent({ ...newStudent, id: e.target.value })} required style={inputStyle} />
                                <input placeholder="Nombre Completo" value={newStudent.name} onChange={e => setNewStudent({ ...newStudent, name: e.target.value })} required style={inputStyle} />
                                <input placeholder="Carrera" value={newStudent.career} onChange={e => setNewStudent({ ...newStudent, career: e.target.value })} required style={inputStyle} />
                                <button type="submit" style={btnStyle}>Generar Carnet</button>
                            </form>
                        </div>

                        <div className="glass-panel" style={{ padding: '1.5rem' }}>
                            <h3>Carga Masiva (CSV)</h3>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>Formato: ID, Nombre, Carrera (por línea)</p>
                            <textarea
                                value={csvContent}
                                onChange={e => setCsvContent(e.target.value)}
                                placeholder={"101, Ana Lopez, Derecho\n102, Luis G, Medicina"}
                                style={{ ...inputStyle, height: '150px', resize: 'none' }}
                            />
                            <button onClick={handleBulkUpload} style={{ ...btnStyle, marginTop: '1rem', background: 'var(--accent-secondary)' }}>Procesar CSV</button>
                        </div>
                    </div>
                )}

                {activeTab === 'photos' && (
                    <div className="glass-panel" style={{ padding: '1.5rem' }}>
                        <h3>Aprobación de Fotos Pendientes</h3>
                        {pendingPhotos.length === 0 ? <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>No hay fotos pendientes.</p> : (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
                                {pendingPhotos.map(s => (
                                    <div key={s.id} style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
                                        <img src={s.photoUrl} alt="" style={{ width: 100, height: 100, borderRadius: '50%', objectFit: 'cover', marginBottom: '0.5rem' }} />
                                        <p style={{ fontWeight: 'bold' }}>{s.name}</p>
                                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginTop: '0.5rem' }}>
                                            <button onClick={() => handleApprovePhoto(s.id, true)} style={{ ...iconBtnStyle, color: '#4ade80' }}><Check size={20} /></button>
                                            <button onClick={() => handleApprovePhoto(s.id, false)} style={{ ...iconBtnStyle, color: '#ef4444' }}><X size={20} /></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'analytics' && (
                    <div className="glass-panel" style={{ padding: '1.5rem' }}>
                        <h3>Estadísticas Generales</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
                            <StatCard label="Total Estudiantes" value={students.length} color="var(--accent-primary)" />
                            <StatCard label="Fotos Pendientes" value={pendingPhotos.length} color="#eab308" />
                            <StatCard label="Fotos Aprobadas" value={students.length - pendingPhotos.length} color="#4ade80" />
                            <StatCard label="Asistencias Hoy" value="0" color="#f472b6" />
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

const TabButton = ({ icon, label, active, onClick }) => (
    <button onClick={onClick} style={{
        display: 'flex', alignItems: 'center', gap: '8px', padding: '0.8rem 1.5rem',
        background: active ? 'rgba(255,255,255,0.1)' : 'transparent',
        border: '1px solid ' + (active ? 'var(--accent-primary)' : 'transparent'),
        borderRadius: '8px', color: 'white', cursor: 'pointer', transition: 'all 0.2s'
    }}>
        {icon} {label}
    </button>
);

const StatCard = ({ label, value, color }) => (
    <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '12px', borderLeft: `4px solid ${color}` }}>
        <h4 style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>{label}</h4>
        <p style={{ fontSize: '2rem', fontWeight: '800' }}>{value}</p>
    </div>
);

const inputStyle = { padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)', color: 'white' };
const btnStyle = { padding: '0.8rem', borderRadius: '8px', border: 'none', background: 'var(--accent-primary)', color: 'white', fontWeight: 'bold', cursor: 'pointer' };
const iconBtnStyle = { background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', padding: '8px', cursor: 'pointer' };

export default AdminDashboard;
