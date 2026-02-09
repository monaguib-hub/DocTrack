'use client';

import { useState } from 'react';
import { useEmployees } from '@/hooks/useEmployees';
import { EmployeeCard } from '@/components/EmployeeCard';
import { Modal } from '@/components/Modal';
import { Plus, Search, Filter, ArrowDownAZ, ArrowUpAZ, X } from 'lucide-react';

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

    // Filter and Sort states
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'critical' | 'warning' | 'safe'>('all');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    const filteredEmployees = employees.filter(emp => {
        const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            emp.position.toLowerCase().includes(searchQuery.toLowerCase());

        if (statusFilter === 'all') return matchesSearch;

        const hasStatus = emp.documents.some(d => d.status === statusFilter);
        return matchesSearch && hasStatus;
    }).sort((a, b) => {
        const comparison = a.name.localeCompare(b.name);
        return sortOrder === 'asc' ? comparison : -comparison;
    });

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

            {/* Filter Bar */}
            <div className="premium-card" style={{ padding: '1rem', marginBottom: '2rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
                <div style={{ position: 'relative', flex: 1, minWidth: '250px' }}>
                    <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input
                        type="text"
                        className="form-input"
                        placeholder="Search by name or position..."
                        style={{ paddingLeft: '40px', width: '100%' }}
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                        >
                            <X size={16} />
                        </button>
                    )}
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button
                        onClick={() => setStatusFilter('all')}
                        className={`btn ${statusFilter === 'all' ? 'btn-primary' : ''}`}
                        style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', background: statusFilter === 'all' ? 'var(--secondary)' : 'rgba(0,0,0,0.05)', color: statusFilter === 'all' ? 'white' : 'var(--secondary)' }}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setStatusFilter('critical')}
                        className={`btn ${statusFilter === 'critical' ? 'btn-primary' : ''}`}
                        style={{
                            padding: '0.5rem 1rem',
                            fontSize: '0.875rem',
                            background: statusFilter === 'critical' ? 'var(--critical)' : 'rgba(218, 31, 51, 0.05)',
                            color: statusFilter === 'critical' ? 'white' : 'var(--critical)',
                            border: statusFilter === 'critical' ? 'none' : '1px solid var(--critical)'
                        }}
                    >
                        Critical
                    </button>
                    <button
                        onClick={() => setStatusFilter('warning')}
                        className={`btn ${statusFilter === 'warning' ? 'btn-primary' : ''}`}
                        style={{
                            padding: '0.5rem 1rem',
                            fontSize: '0.875rem',
                            background: statusFilter === 'warning' ? 'var(--warning)' : 'rgba(245, 158, 11, 0.05)',
                            color: statusFilter === 'warning' ? 'white' : 'var(--warning)',
                            border: statusFilter === 'warning' ? 'none' : '1px solid var(--warning)'
                        }}
                    >
                        Warning
                    </button>
                    <button
                        onClick={() => setStatusFilter('safe')}
                        className={`btn ${statusFilter === 'safe' ? 'btn-primary' : ''}`}
                        style={{
                            padding: '0.5rem 1rem',
                            fontSize: '0.875rem',
                            background: statusFilter === 'safe' ? 'var(--safe)' : 'rgba(16, 185, 129, 0.05)',
                            color: statusFilter === 'safe' ? 'white' : 'var(--safe)',
                            border: statusFilter === 'safe' ? 'none' : '1px solid var(--safe)'
                        }}
                    >
                        Safe
                    </button>
                </div>

                <button
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    className="btn"
                    style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(0,0,0,0.05)', color: 'var(--secondary)' }}
                >
                    {sortOrder === 'asc' ? <ArrowDownAZ size={18} /> : <ArrowUpAZ size={18} />}
                    {sortOrder === 'asc' ? 'A-Z' : 'Z-A'}
                </button>
            </div>

            <div className="grid">
                {filteredEmployees.map(employee => (
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
                {filteredEmployees.length === 0 && (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '5rem 2rem', background: 'rgba(255,255,255,0.03)', borderRadius: '2rem', border: '1px dashed rgba(255,255,255,0.1)' }}>
                        <p style={{ color: 'var(--secondary)', opacity: 0.5 }}>
                            {employees.length === 0 ? 'No employees found. Start by adding your first team member!' : 'No employees match your search or filter criteria.'}
                        </p>
                        {employees.length > 0 && (
                            <button
                                onClick={() => { setSearchQuery(''); setStatusFilter('all'); }}
                                style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: '700', cursor: 'pointer', marginTop: '1rem' }}
                            >
                                Clear All Filters
                            </button>
                        )}
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
