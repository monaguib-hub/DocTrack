'use client';

import React, { useState } from 'react';
import { useEmployees } from '@/hooks/useEmployees';
import { EmployeeCard } from '@/components/EmployeeCard';
import { Modal } from '@/components/Modal';

export default function DashboardPage() {
    const { employees, loading, addEmployee, addDocument, deleteEmployee } = useEmployees();

    // Modal states
    const [isEmployeeModalOpen, setEmployeeModalOpen] = useState(false);
    const [isDocModalOpen, setDocModalOpen] = useState(false);
    const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);

    // Form states
    const [newEmployee, setNewEmployee] = useState({ name: '', position: '' });
    const [newDoc, setNewDoc] = useState({ name: '', expiryDate: '' });

    const stats = [
        { label: 'Total Employees', value: employees.length.toString(), icon: '👥' },
        { label: 'Total Documents', value: employees.reduce((acc, emp) => acc + emp.documents.length, 0).toString(), icon: '📄' },
        {
            label: 'Expiring (3 months)',
            value: employees.reduce((acc, emp) => acc + emp.documents.filter(d => d.status === 'warning').length, 0).toString(),
            icon: '⚠️',
            status: 'warning'
        },
        {
            label: 'Critical (1 month)',
            value: employees.reduce((acc, emp) => acc + emp.documents.filter(d => d.status === 'critical').length, 0).toString(),
            icon: '🚨',
            status: 'critical'
        },
    ];

    const handleAddEmployee = async (e: React.FormEvent) => {
        e.preventDefault();
        await addEmployee(newEmployee.name, newEmployee.position);
        setNewEmployee({ name: '', position: '' });
        setEmployeeModalOpen(false);
    };

    const handleAddDoc = async (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedEmployeeId) {
            await addDocument(selectedEmployeeId, newDoc.name, newDoc.expiryDate);
            setNewDoc({ name: '', expiryDate: '' });
            setDocModalOpen(false);
        }
    };

    if (loading) return <div className="container">Loading...</div>;

    return (
        <div className="container">
            <header style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                        Operations Dashboard
                    </h1>
                    <p style={{ color: '#64748b' }}>Insights and document status across your organization.</p>
                </div>
                <button className="btn-primary" onClick={() => setEmployeeModalOpen(true)}>+ Add New Employee</button>
            </header>

            {/* Stats Grid */}
            <div className="dashboard-grid" style={{ marginBottom: '4rem' }}>
                {stats.map((stat, i) => (
                    <div key={i} className="premium-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <div style={{
                            fontSize: '2rem',
                            background: stat.status === 'warning' ? 'rgba(245, 158, 11, 0.1)' : stat.status === 'critical' ? 'rgba(218, 31, 51, 0.1)' : 'rgba(0, 42, 78, 0.05)',
                            padding: '1rem',
                            borderRadius: '12px',
                            width: '64px',
                            height: '64px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            {stat.icon}
                        </div>
                        <div>
                            <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#64748b' }}>{stat.label}</div>
                            <div style={{
                                fontSize: '1.875rem',
                                fontWeight: '700',
                                color: stat.status === 'warning' ? 'var(--warning)' : stat.status === 'critical' ? 'var(--critical)' : 'var(--secondary)'
                            }}>
                                {stat.value}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem' }}>Employee Directory</h2>
            <div className="dashboard-grid">
                {employees.map(employee => (
                    <EmployeeCard
                        key={employee.id}
                        employee={employee}
                        onAddDocument={(id) => {
                            setSelectedEmployeeId(id);
                            setDocModalOpen(true);
                        }}
                        onDelete={deleteEmployee}
                    />
                ))}
                {employees.length === 0 && (
                    <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b', gridColumn: '1 / -1' }}>
                        No employees found. Click "Add New Employee" to get started.
                    </div>
                )}
            </div>

            {/* Modals */}
            <Modal isOpen={isEmployeeModalOpen} onClose={() => setEmployeeModalOpen(false)} title="Add New Employee">
                <form onSubmit={handleAddEmployee} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>Full Name</label>
                        <input
                            type="text"
                            value={newEmployee.name}
                            onChange={e => setNewEmployee({ ...newEmployee, name: e.target.value })}
                            required
                            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                            placeholder="e.g. John Doe"
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>Position</label>
                        <input
                            type="text"
                            value={newEmployee.position}
                            onChange={e => setNewEmployee({ ...newEmployee, position: e.target.value })}
                            required
                            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                            placeholder="e.g. Operations Manager"
                        />
                    </div>
                    <button type="submit" className="btn-primary" style={{ marginTop: '1rem' }}>Create Employee</button>
                </form>
            </Modal>

            <Modal isOpen={isDocModalOpen} onClose={() => setDocModalOpen(false)} title="Add Document">
                <form onSubmit={handleAddDoc} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>Document Name</label>
                        <input
                            type="text"
                            value={newDoc.name}
                            onChange={e => setNewDoc({ ...newDoc, name: e.target.value })}
                            required
                            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                            placeholder="e.g. Passport"
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>Expiry Date</label>
                        <input
                            type="date"
                            value={newDoc.expiryDate}
                            onChange={e => setNewDoc({ ...newDoc, expiryDate: e.target.value })}
                            required
                            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                        />
                    </div>
                    <button type="submit" className="btn-primary" style={{ marginTop: '1rem' }}>Add Document</button>
                </form>
            </Modal>
        </div>
    );
}
