import React, { createContext, useContext, useState, useEffect } from 'react';
import { useData } from './DataContext';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // { id, role, name }
    const { getStudentById } = useData();

    const login = (id, role) => {
        // Simulación de autenticación simple
        if (role === 'admin' && id === 'admin') {
            setUser({ id: 'admin', role: 'admin', name: 'Administrador' });
            return true;
        }

        if (role === 'professor' && id === 'prof') {
            setUser({ id: 'prof', role: 'professor', name: 'Profesor' });
            return true;
        }

        if (role === 'student') {
            const student = getStudentById(id);
            if (student) {
                setUser({ id: student.id, role: 'student', name: student.name, data: student });
                return true;
            }
        }

        return false;
    };

    const logout = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
