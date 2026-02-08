import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Clock, ShieldCheck, RefreshCw } from 'lucide-react';
import './Tarjeta.css';

const Tarjeta = ({ student }) => {
    const [isFlipped, setIsFlipped] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [qrToken, setQrToken] = useState(Math.random().toString(36).substring(7));
    const [timeLeft, setTimeLeft] = useState(30);

    // Reloj en tiempo real
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // QR Rotativo (TOTP Simulado)
    useEffect(() => {
        const qrInterval = setInterval(() => {
            setQrToken(Math.random().toString(36).substring(7));
            setTimeLeft(30);
        }, 30000);

        const countdown = setInterval(() => {
            setTimeLeft((prev) => prev > 0 ? prev - 1 : 30);
        }, 1000);

        return () => {
            clearInterval(qrInterval);
            clearInterval(countdown);
        };
    }, []);

    const handleFlip = () => {
        setIsFlipped(!isFlipped);
    };

    const formattedTime = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    return (
        <div
            className={`tarjeta-container ${isFlipped ? 'flipped' : ''}`}
            onClick={handleFlip}
        >
            <div className="tarjeta-inner">

                {/* FRENTE */}
                <div className="tarjeta-face tarjeta-front">
                    {/* Marca de agua animada */}
                    <div className="watermark-overlay"></div>

                    {/* Logo Oculto UV */}
                    <div className="uv-hidden-logo">VALIDO UH</div>

                    <div className="tarjeta-header">
                        <div className="live-indicator">
                            <div className="pulse-dot"></div>
                            <span className="live-text">LIVE</span>
                        </div>
                    </div>

                    <div className="photo-container">
                        <img
                            src={student.photoUrl}
                            alt={student.name}
                            className="student-photo"
                        />
                        {/* Holograma sobre foto */}
                        <div className="hologram-overlay"></div>
                    </div>

                    <div className="student-info">
                        <h2 className="student-name">{student.name}</h2>
                        <p className="student-career">{student.career}</p>

                        <div className="info-grid">
                            <div className="info-item">
                                <h4>ID Estudiante</h4>
                                <p>{student.id}</p>
                            </div>
                            <div className="info-item">
                                <h4>Vigencia</h4>
                                <p>{student.validThru}</p>
                            </div>
                            <div className="info-item full-width">
                                <div className="security-clock">
                                    <Clock size={14} color="var(--accent-primary)" />
                                    <span>{formattedTime}</span>
                                </div>
                            </div>
                            <div className="info-item">
                                <h4>Estatus</h4>
                                <span className={`status-badge ${student.status === 'Activo' ? 'status-active' : ''}`}>
                                    {student.status} <ShieldCheck size={12} style={{ marginLeft: 4 }} />
                                </span>
                            </div>
                        </div>
                    </div>

                    <p className="click-hint">Toca para codigo seguro</p>
                </div>

                {/* DORSO */}
                <div className="tarjeta-face tarjeta-back">
                    <div className="strip"></div>

                    <div className="qr-section">
                        <div className="qr-container">
                            <QRCodeSVG
                                value={JSON.stringify({
                                    id: student.id,
                                    token: qrToken,
                                    timestamp: Date.now()
                                })}
                                size={160}
                                level="H"
                            />
                        </div>
                        <div className="qr-timer">
                            <RefreshCw size={12} className={timeLeft < 10 ? 'spin-fast' : ''} />
                            <span>Actualizando en {timeLeft}s</span>
                        </div>
                    </div>

                    <div className="validity-info">
                        <h3>Emergencia</h3>
                        <p className="emergency-contact">{student.emergencyContact || 'No registrado'}</p>
                        <p>Tipo de Sangre: {student.bloodType || 'N/A'}</p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Tarjeta;
