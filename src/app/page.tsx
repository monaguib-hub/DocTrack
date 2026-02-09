'use client';

import React, { useState } from 'react';
import { useEmployees } from '@/hooks/useEmployees';
import { EmployeeCard } from '@/components/EmployeeCard';
import { Modal } from '@/components/Modal';

export default function DashboardPage() {
    const {
        employees,
        loading,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        addDocument,
        updateDocument,
        deleteDocument,
        uploadFile
    } = useEmployees();

    // Modal states
    const [isEmployeeModalOpen, setEmployeeModalOpen] = useState(false);
    const [isDocModalOpen, setDocModalOpen] = useState(false);
    const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);

    // Form states
    const [newEmployee, setNewEmployee] = useState({ name: '', position: '' });
    const [newDoc, setNewDoc] = useState({ name: '', expiryDate: '', file: null as File | null });
    const [isNoExpiry, setIsNoExpiry] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Filter states
    const [viewingStatus, setViewingStatus] = useState<'warning' | 'critical' | null>(null);

    const allDocuments = employees.flatMap(emp =>
        emp.documents.map(doc => ({ ...doc, employeeName: emp.name }))
    );

    const filteredDocs = viewingStatus ?
        allDocuments.filter(d => d.status === viewingStatus) :
        [];

    const stats = [
        { label: 'Total Employees', value: employees.length.toString(), icon: '👥' },
        { label: 'Total Documents', value: allDocuments.length.toString(), icon: '📄' },
        {
            label: 'Expiring (3 months)',
            value: allDocuments.filter(d => d.status === 'warning').length.toString(),
            icon: '⚠️',
            status: 'warning',
            clickable: true
        },
        {
            label: 'Critical (1 month)',
            value: allDocuments.filter(d => d.status === 'critical').length.toString(),
            icon: '🚨',
            status: 'critical',
            clickable: true
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
            setUploading(true);
            let fileUrl = '';
            if (newDoc.file) {
                fileUrl = await uploadFile(newDoc.file) || '';
            }
            await addDocument(selectedEmployeeId, newDoc.name, isNoExpiry ? null : newDoc.expiryDate, fileUrl);
            setNewDoc({ name: '', expiryDate: '', file: null });
            setIsNoExpiry(false);
            setUploading(false);
            setDocModalOpen(false);
        }
    };

    if (loading) return <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80vh' }}>
        <div className="premium-card" style={{ padding: '2rem' }}>Loading application data...</div>
    </div>;

    return (
        <div className="container">
            <header style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
                        Operations Dashboard
                    </h1>
                    <p style={{ color: '#64748b' }}>Insights and document status across your organization.</p>
                </div>
                <button className="btn-primary" onClick={() => setEmployeeModalOpen(true)}>+ Add New Employee</button>
            </header>

            {/* Stats Grid */}
            <div className="dashboard-grid" style={{ marginBottom: '4rem' }}>
                {stats.map((stat, i) => (
                    <div
                        key={i}
                        className={`premium-card animation-fade-in ${stat.clickable ? 'interactive-card' : ''}`}
                        onClick={() => stat.clickable && setViewingStatus(stat.status as any)}
                        style={{
                            padding: '1.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1.5rem',
                            animationDelay: `${i * 0.1}s`,
                            cursor: stat.clickable ? 'pointer' : 'default'
                        }}
                    >
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
                        onUpdateEmployee={updateEmployee}
                        onUpdateDocument={async (docId, name, date, file) => {
                            let fileUrl = '';
                            if (file) {
                                fileUrl = await uploadFile(file) || '';
                            }
                            await updateDocument(docId, name, date, fileUrl);
                        }}
                        onDeleteDocument={deleteDocument}
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

            <Modal isOpen={isDocModalOpen} onClose={() => { setDocModalOpen(false); setIsNoExpiry(false); }} title="Add Document">
                <form onSubmit={handleAddDoc} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>Document Name</label>
                        <input
                            type="text"
                            value={newDoc.name}
                            onChange={e => setNewDoc({ ...newDoc, name: e.target.value })}
                            required
                            className="form-input"
                            style={{ width: '100%' }}
                            placeholder="e.g. Passport"
                        />
                    </div>
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                            <label style={{ fontSize: '0.875rem', fontWeight: '600' }}>Expiry Date</label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    checked={isNoExpiry}
                                    onChange={e => setIsNoExpiry(e.target.checked)}
                                />
                                No Expiry Date
                            </label>
                        </div>
                        <input
                            type="date"
                            value={isNoExpiry ? '' : newDoc.expiryDate}
                            onChange={e => setNewDoc({ ...newDoc, expiryDate: e.target.value })}
                            required={!isNoExpiry}
                            disabled={isNoExpiry}
                            className="form-input"
                            style={{ width: '100%', opacity: isNoExpiry ? 0.5 : 1 }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>Attach File (Optional)</label>
                        <input
                            type="file"
                            onChange={e => setNewDoc({ ...newDoc, file: e.target.files?.[0] || null })}
                            className="form-input"
                            style={{ width: '100%', fontSize: '0.8125rem' }}
                        />
                    </div>
                    <button
                        type="submit"
                        className="btn-primary"
                        style={{ marginTop: '1rem' }}
                        disabled={uploading}
                    >
                        {uploading ? 'Processing...' : 'Add Document'}
                    </button>
                </form>
            </Modal>

            {/* Filtered Documents Modal */}
            <Modal
                isOpen={!!viewingStatus}
                onClose={() => setViewingStatus(null)}
                title={viewingStatus === 'critical' ? 'Critical Documents (Expiring soon)' : 'Expiring Documents (3 Months)'}
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '60vh', overflowY: 'auto', paddingRight: '0.5rem' }}>
                    {filteredDocs.length > 0 ? (
                        filteredDocs.map((doc, i) => (
                            <div key={i} style={{
                                padding: '1rem',
                                background: 'rgba(0,0,0,0.02)',
                                borderRadius: '12px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <div>
                                    <div style={{ fontWeight: '700', fontSize: '1rem' }}>{doc.name}</div>
                                    <div style={{ fontSize: '0.8125rem', color: '#64748b' }}>Employee: {doc.employeeName}</div>
                                    {doc.file_url && (
                                        <a href={doc.file_url} target="_blank" rel="noopener noreferrer" style={{
                                            fontSize: '0.75rem',
                                            color: 'var(--primary)',
                                            textDecoration: 'none',
                                            marginTop: '4px',
                                            display: 'block',
                                            fontWeight: '600'
                                        }}>
                                            View Attached File
                                        </a>
                                    )}
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{
                                        fontSize: '0.875rem',
                                        fontWeight: '700',
                                        color: doc.expiry_date ? (doc.status === 'critical' ? 'var(--critical)' : 'var(--warning)') : 'var(--safe)'
                                    }}>
                                        {doc.expiry_date || 'Permanent'}
                                    </div>
                                    <div className={`status-badge status-${doc.status}`} style={{ marginTop: '4px', display: 'inline-block' }}>
                                        {doc.status}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                            No documents found in this category.
                        </div>
                    )}
                </div>
            </Modal>
        </div>
    );
}
