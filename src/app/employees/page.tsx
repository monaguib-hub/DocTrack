'use client';

import { useState } from 'react';
import { useEmployees } from '@/hooks/useEmployees';
import EmployeeCard from '@/components/EmployeeCard';
import Modal from '@/components/Modal';
import { Plus } from 'lucide-react';

export default function EmployeesPage() {
    const { employees, loading, addEmployee } = useEmployees();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newName, setNewName] = useState('');
    const [newPosition, setNewPosition] = useState('');

    const handleAddEmployee = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newName && newPosition) {
            await addEmployee(newName, newPosition);
            setNewName('');
            setNewPosition('');
            setIsModalOpen(false);
        }
    };

    if (loading) {
        return (
            <div className="container" style={{ textAlign: 'center', padding: '5rem 2rem' }}>
                <div style={{ fontSize: '1.2rem', color: 'var(--secondary)', opacity: 0.7 }}>Loading your team...</div>
            </div>
        );
    }

    return (
        <div className="container">
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem', letterSpacing: '-0.025em' }}>
                        Your <span style={{ color: 'var(--primary)' }}>Team</span>
                    </h1>
                    <p style={{ color: 'var(--secondary)', opacity: 0.7 }}>Manage all your employees and their critical documents.</p>
                </div>
                <button
                    className="btn btn-primary"
                    style={{ fontSize: '1rem', padding: '0.8rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    onClick={() => setIsModalOpen(true)}
                >
                    <Plus size={20} />
                    Add New Employee
                </button>
            </header>

            <div className="grid">
                {employees.map(employee => (
                    <EmployeeCard key={employee.id} employee={employee} />
                ))}
                {employees.length === 0 && (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '5rem 2rem', background: 'rgba(255,255,255,0.03)', borderRadius: '2rem', border: '1px dashed rgba(255,255,255,0.1)' }}>
                        <p style={{ color: 'var(--secondary)', opacity: 0.5 }}>No employees found. Start by adding your first team member!</p>
                    </div>
                )}
            </div>

            {isModalOpen && (
                <Modal title="Add New Employee" onClose={() => setIsModalOpen(false)}>
                    <form onSubmit={handleAddEmployee} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--secondary)' }}>Full Name</label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="e.g. John Doe"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                required
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--secondary)' }}>Position</label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="e.g. Senior Surveyor"
                                value={newPosition}
                                onChange={(e) => setNewPosition(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem', width: '100%', justifyContent: 'center' }}>
                            Create Employee Profile
                        </button>
                    </form>
                </Modal>
            )}
        </div>
    );
}
