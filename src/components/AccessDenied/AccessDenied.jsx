import React from 'react';
import { XOctagon, ShieldAlert } from 'lucide-react';

const AccessDenied = () => {
    return (
        <div className="access-denied-container">
            <div className="error-card shake">
                <XOctagon size={80} color="#ef4444" />
                <h1>ACCESO DENEGADO</h1>
                <p>El token proporcionado no es válido o ha expirado.</p>

                <div className="security-log">
                    <p>IP Registrada: {window.location.hostname}</p>
                    <p>Timestamp: {new Date().toISOString()}</p>
                    <p className="status-code">ERR_TOKEN_INVALID_403</p>
                </div>

                <div className="contact-support">
                    <ShieldAlert size={16} />
                    <span>Reportar al Departamento de Seguridad</span>
                </div>
            </div>

            <style>{`
                .access-denied-container {
                    height: 100vh;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    background: #0f0f0f;
                    padding: 1rem;
                }
                .error-card {
                    background: rgba(239, 68, 68, 0.05);
                    border: 2px solid #ef4444;
                    padding: 3rem;
                    border-radius: 20px;
                    text-align: center;
                    color: #ef4444;
                    box-shadow: 0 0 30px rgba(239, 68, 68, 0.2);
                    max-width: 400px;
                    width: 100%;
                }
                .shake {
                    animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
                }
                @keyframes shake {
                    10%, 90% { transform: translate3d(-1px, 0, 0); }
                    20%, 80% { transform: translate3d(2px, 0, 0); }
                    30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
                    40%, 60% { transform: translate3d(4px, 0, 0); }
                }
                .security-log {
                    margin-top: 2rem;
                    background: black;
                    padding: 1rem;
                    border-radius: 8px;
                    font-family: monospace;
                    font-size: 0.8rem;
                    text-align: left;
                    color: #fca5a5;
                    border-left: 3px solid #ef4444;
                }
                .status-code {
                    font-weight: bold;
                    margin-top: 0.5rem;
                }
                .contact-support {
                    margin-top: 2rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    font-size: 0.8rem;
                    opacity: 0.8;
                }
            `}</style>
        </div>
    );
};

export default AccessDenied;
