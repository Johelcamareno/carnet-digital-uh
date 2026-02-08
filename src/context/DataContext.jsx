import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockStudent } from '../data/mockStudent';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
    const [students, setStudents] = useState(() => {
        const saved = localStorage.getItem('students');
        return saved ? JSON.parse(saved) : [mockStudent];
    });

    useEffect(() => {
        localStorage.setItem('students', JSON.stringify(students));
    }, [students]);

    import { n8nService } from '../services/n8nService';

    // ... (imports)

    const addStudent = async (newStudent) => {
        try {
            const studentWithStatus = {
                ...newStudent,
                photoStatus: 'approved',
                lastAttendance: null
            };

            // 1. Guardar en Backend (Notion/n8n)
            console.log("Enviando a n8n:", studentWithStatus);
            await n8nService.createStudent(studentWithStatus);

            // 2. Actualizar estado local (Optimistic UI o tras éxito)
            setStudents((prev) => [...prev, studentWithStatus]);
            return { success: true };
        } catch (error) {
            console.error("Error al guardar en Notion:", error);
            alert("Error al guardar en la base de datos. Revisa la conexión con n8n.");
            return { success: false, error };
        }
    };

    const addStudentsBulk = (newStudents) => {
        const studentsWithStatus = newStudents.map(s => ({
            ...s,
            photoStatus: 'approved',
            lastAttendance: null
        }));
        setStudents((prev) => [...prev, ...studentsWithStatus]);
    };

    const updateStudent = (id, updatedData) => {
        setStudents((prev) =>
            prev.map(s => s.id === id ? { ...s, ...updatedData } : s)
        );
    };

    const updatePhoto = (id, newPhotoUrl) => {
        updateStudent(id, { photoUrl: newPhotoUrl, photoStatus: 'pending' });
    };

    const getStudentById = (id) => {
        return students.find(s => s.id === id);
    };

    const deleteStudent = (id) => {
        setStudents((prev) => prev.filter(s => s.id !== id));
    }

    return (
        <DataContext.Provider value={{
            students,
            addStudent,
            addStudentsBulk,
            updateStudent,
            updatePhoto,
            getStudentById,
            deleteStudent
        }}>
            {children}
        </DataContext.Provider>
    );
};
