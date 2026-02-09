'use client';

import { useState } from 'react';
import { useEmployees } from '@/hooks/useEmployees';
import { EmployeeCard } from '@/components/EmployeeCard';
import { Modal } from '@/components/Modal';
import { Plus } from 'lucide-react';

export default function EmployeesPage() {
    const {
        employees,
        docTypes,
        loading,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        addDocument,
        updateDocument,
        deleteDocument,
        uploadFile
    } = useEmployees();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDocModalOpen, setDocModalOpen] = useState(false);
    const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);

    const [newName, setNewName] = useState('');
    const [newPosition, setNewPosition] = useState('');
    const [newDoc, setNewDoc] = useState({ name: '', expiryDate: '', file: null as File | null });
    const [isNoExpiry, setIsNoExpiry] = useState(false);
    const [isCustomType, setIsCustomType] = useState(false);
    const [uploading, setUploading] = useState(false);

    const handleAddEmployee = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newName && newPosition) {
            await addEmployee(newName, newPosition);
            setNewName('');
            setNewPosition('');
            setIsModalOpen(false);
        }
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
            setIsCustomType(false);
            setUploading(false);
            setDocModalOpen(false);
        }
    };

    if (loading) {
        return (
            <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80vh' }}>
                <div className="premium-card" style={{ padding: '2rem' }}>Loading application data...</div>
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
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '5rem 2rem', background: 'rgba(255,255,255,0.03)', borderRadius: '2rem', border: '1px dashed rgba(255,255,255,0.1)' }}>
                        <p style={{ color: 'var(--secondary)', opacity: 0.5 }}>No employees found. Start by adding your first team member!</p>
                    </div>
                )}
            </div>

            {isModalOpen && (
                <Modal
                    isOpen={isModalOpen}
                    title="Add New Employee"
                    onClose={() => setIsModalOpen(false)}
                >
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
                                placeholder="e.g. Operations Manager"
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

            {isDocModalOpen && (
                <Modal
                    isOpen={isDocModalOpen}
                    title="Add Document"
                    onClose={() => { setDocModalOpen(false); setIsNoExpiry(false); setIsCustomType(false); }}
                >
                    <form onSubmit={handleAddDoc} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--secondary)' }}>Document Type</label>
                            <select
                                className="form-input"
                                style={{ width: '100%', marginBottom: isCustomType ? '0.5rem' : '0' }}
                                value={isCustomType ? 'custom' : newDoc.name}
                                onChange={(e) => {
                                    if (e.target.value === 'custom') {
                                        setIsCustomType(true);
                                        setNewDoc({ ...newDoc, name: '' });
                                    } else {
                                        setIsCustomType(false);
                                        setNewDoc({ ...newDoc, name: e.target.value });
                                    }
                                }}
                                required
                            >
                                <option value="" disabled>Select a document type...</option>
                                {Array.from(new Set(docTypes.map(d => d.category))).map(category => (
                                    <optgroup key={category} label={category}>
                                        {docTypes
                                            .filter(d => d.category === category)
                                            .map(type => (
                                                <option key={type.id} value={type.name}>
                                                    {type.parent_id ? `↳ ${type.name}` : type.name}
                                                </option>
                                            ))}
                                    </optgroup>
                                ))}
                                <option value="custom">Other / Custom...</option>
                            </select>
                            {isCustomType && (
                                <input
                                    type="text"
                                    value={newDoc.name}
                                    onChange={e => setNewDoc({ ...newDoc, name: e.target.value })}
                                    required
                                    className="form-input"
                                    style={{ width: '100%' }}
                                    placeholder="Enter custom document name"
                                />
                            )}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <label style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--secondary)' }}>Expiry Date</label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', cursor: 'pointer', opacity: 0.8 }}>
                                    <input
                                        type="checkbox"
                                        checked={isNoExpiry}
                                        onChange={e => setIsNoExpiry(e.target.checked)}
                                    />
                                    No Expiry
                                </label>
                            </div>
                            <input
                                type="date"
                                className="form-input"
                                value={isNoExpiry ? '' : newDoc.expiryDate}
                                onChange={(e) => setNewDoc({ ...newDoc, expiryDate: e.target.value })}
                                required={!isNoExpiry}
                                disabled={isNoExpiry}
                                style={{ opacity: isNoExpiry ? 0.5 : 1 }}
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--secondary)' }}>Attach File (Optional)</label>
                            <input
                                type="file"
                                className="form-input"
                                style={{ fontSize: '0.8125rem' }}
                                onChange={(e) => setNewDoc({ ...newDoc, file: e.target.files?.[0] || null })}
                            />
                        </div>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            style={{ marginTop: '0.5rem', width: '100%', justifyContent: 'center' }}
                            disabled={uploading}
                        >
                            {uploading ? 'Processing File...' : 'Add Document'}
                        </button>
                    </form>
                </Modal>
            )}
        </div>
    );
}
