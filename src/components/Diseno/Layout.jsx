import React from 'react';
import './Layout.css';

const Layout = ({ children }) => {
    return (
        <div className="layout-container">
            <header className="layout-header">
                <h1>Universidad Digital</h1>
                <p>Identificación Oficial</p>
            </header>

            <main className="layout-content fade-in">
                {children}
            </main>

            <footer className="layout-footer">
                <p>© 2024 Universidad Digital. Todos los derechos reservados.</p>
            </footer>
        </div>
    );
};

export default Layout;
