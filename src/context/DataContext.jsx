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

    const addStudent = (newStudent) => {
        const studentWithStatus = {
            ...newStudent,
            photoStatus: 'approved', // Default for admin created
            lastAttendance: null
        };
        setStudents((prev) => [...prev, studentWithStatus]);
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
