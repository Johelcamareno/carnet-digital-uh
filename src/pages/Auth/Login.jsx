import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, Shield, GraduationCap } from 'lucide-react';

const Login = () => {
    const [role, setRole] = useState('student'); // student, admin, professor
    const [id, setId] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (login(id, role)) {
            if (role === 'admin') navigate('/admin');
            else if (role === 'professor') navigate('/professor');
            else navigate('/student');
        } else {
            setError('Credenciales inválidas');
        }
    };

    return (
        <div className="layout-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div className="glass-panel" style={{ padding: '2rem', maxWidth: '400px', width: '100%', margin: '0 auto' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Iniciar Sesión</h2>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
                    <button
                        onClick={() => setRole('student')}
                        className={`role-btn ${role === 'student' ? 'active' : ''}`}
                        style={{ padding: '0.5rem', borderRadius: '8px', border: 'none', background: role === 'student' ? 'var(--accent-primary)' : 'rgba(255,255,255,0.1)', color: 'white', cursor: 'pointer' }}
                    >
                        <User size={20} />
                    </button>
                    <button
                        onClick={() => setRole('professor')}
                        className={`role-btn ${role === 'professor' ? 'active' : ''}`}
                        style={{ padding: '0.5rem', borderRadius: '8px', border: 'none', background: role === 'professor' ? 'var(--accent-secondary)' : 'rgba(255,255,255,0.1)', color: 'white', cursor: 'pointer' }}
                    >
                        <GraduationCap size={20} />
                    </button>
                    <button
                        onClick={() => setRole('admin')}
                        className={`role-btn ${role === 'admin' ? 'active' : ''}`}
                        style={{ padding: '0.5rem', borderRadius: '8px', border: 'none', background: role === 'admin' ? '#ef4444' : 'rgba(255,255,255,0.1)', color: 'white', cursor: 'pointer' }}
                    >
                        <Shield size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                            {role === 'admin' ? 'Usuario Admin' : role === 'professor' ? 'ID Profesor' : 'ID Estudiante'}
                        </label>
                        <input
                            type="text"
                            value={id}
                            onChange={(e) => setId(e.target.value)}
                            placeholder={role === 'admin' ? 'admin' : role === 'professor' ? 'prof' : '2024-0123'}
                            style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
                        />
                    </div>

                    {error && <p style={{ color: '#ef4444', fontSize: '0.8rem', textAlign: 'center' }}>{error}</p>}

                    <button
                        type="submit"
                        style={{
                            marginTop: '1rem',
                            padding: '0.8rem',
                            borderRadius: '8px',
                            border: 'none',
                            background: 'linear-gradient(to right, var(--accent-primary), var(--accent-secondary))',
                            color: 'white',
                            fontWeight: 'bold',
                            cursor: 'pointer'
                        }}
                    >
                        Entrar como {role === 'admin' ? 'Admin' : role === 'professor' ? 'Profesor' : 'Estudiante'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
