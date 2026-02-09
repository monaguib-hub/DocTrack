import React, { useState } from 'react';
import { Employee, Document } from '@/hooks/useEmployees';
import { Edit2, Trash2, Paperclip, Check, X, FileText, ExternalLink } from 'lucide-react';

interface EmployeeCardProps {
    employee: Employee;
    onAddDocument: (id: string) => void;
    onDelete: (id: string) => void;
    onUpdateEmployee: (id: string, name: string, position: string) => void;
    onUpdateDocument: (docId: string, name: string, expiryDate: string, file?: File | null) => Promise<void>;
    onDeleteDocument: (docId: string, employeeId: string) => void;
}

export function EmployeeCard({
    employee,
    onAddDocument,
    onDelete,
    onUpdateEmployee,
    onUpdateDocument,
    onDeleteDocument
}: EmployeeCardProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState(employee.name);
    const [editPosition, setEditPosition] = useState(employee.position);

    const [editingDocId, setEditingDocId] = useState<string | null>(null);
    const [editDocName, setEditDocName] = useState('');
    const [editDocDate, setEditDocDate] = useState('');
    const [editDocFile, setEditDocFile] = useState<File | null>(null);
    const [isUpdatingDoc, setIsUpdatingDoc] = useState(false);

    const criticalDocs = employee.documents.filter(d => d.status === 'critical');
    const warningDocs = employee.documents.filter(d => d.status === 'warning');

    const handleUpdate = () => {
        onUpdateEmployee(employee.id, editName, editPosition);
        setIsEditing(false);
    };

    const handleUpdateDoc = async (docId: string) => {
        setIsUpdatingDoc(true);
        try {
            await onUpdateDocument(docId, editDocName, editDocDate, editDocFile);
            setEditingDocId(null);
            setEditDocFile(null);
        } finally {
            setIsUpdatingDoc(false);
        }
    };

    const startEditingDoc = (doc: Document) => {
        setEditingDocId(doc.id);
        setEditDocName(doc.name);
        setEditDocDate(doc.expiry_date);
        setEditDocFile(null);
    };

    return (
        <div className="premium-card employee-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flex: 1 }}>
                    <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--secondary), var(--primary))',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: '700',
                        flexShrink: 0
                    }}>
                        {employee.name.split(' ').map(n => n[0] || '').join('').toUpperCase()}
                    </div>

                    {isEditing ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                            <input
                                className="form-input"
                                value={editName}
                                onChange={e => setEditName(e.target.value)}
                                style={{ padding: '4px 8px', fontSize: '1rem' }}
                            />
                            <input
                                className="form-input"
                                value={editPosition}
                                onChange={e => setEditPosition(e.target.value)}
                                style={{ padding: '4px 8px', fontSize: '0.875rem' }}
                            />
                        </div>
                    ) : (
                        <div style={{ flex: 1 }}>
                            <h3 style={{ margin: 0, fontSize: '1.125rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                {employee.name}
                            </h3>
                            <p style={{ margin: 0, fontSize: '0.875rem', color: '#64748b' }}>{employee.position}</p>
                        </div>
                    )}
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    {isEditing ? (
                        <>
                            <button onClick={handleUpdate} className="btn-icon" style={{ color: 'var(--safe)' }}><Check size={18} /></button>
                            <button onClick={() => setIsEditing(false)} className="btn-icon" style={{ color: 'var(--critical)' }}><X size={18} /></button>
                        </>
                    ) : (
                        <button onClick={() => setIsEditing(true)} className="btn-icon" style={{ color: 'var(--secondary)' }}><Edit2 size={16} /></button>
                    )}

                    {!isEditing && (
                        criticalDocs.length > 0 ? (
                            <div className="status-badge status-critical">{criticalDocs.length} Critical</div>
                        ) : warningDocs.length > 0 ? (
                            <div className="status-badge status-warning">{warningDocs.length} Warning</div>
                        ) : (
                            <div className="status-badge status-safe">All Clear</div>
                        )
                    )}
                </div>
            </div>

            <div style={{ marginTop: '1.5rem', borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase' }}>
                        Documents ({employee.documents.length})
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {employee.documents.map(doc => (
                        <div key={doc.id} style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            background: 'rgba(0,0,0,0.02)',
                            padding: '0.5rem 0.75rem',
                            borderRadius: '8px'
                        }}>
                            {editingDocId === doc.id ? (
                                <div style={{ display: 'flex', gap: '0.5rem', flex: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                                    <input
                                        className="form-input"
                                        value={editDocName}
                                        onChange={e => setEditDocName(e.target.value)}
                                        style={{ padding: '2px 4px', fontSize: '0.8125rem', flex: 1, minWidth: '120px' }}
                                    />
                                    <input
                                        type="date"
                                        className="form-input"
                                        value={editDocDate}
                                        onChange={e => setEditDocDate(e.target.value)}
                                        style={{ padding: '2px 4px', fontSize: '0.8125rem', width: '120px' }}
                                    />
                                    <input
                                        type="file"
                                        className="form-input"
                                        onChange={e => setEditDocFile(e.target.files?.[0] || null)}
                                        style={{ padding: '2px 4px', fontSize: '0.75rem', width: '130px' }}
                                    />
                                    <button
                                        onClick={() => handleUpdateDoc(doc.id)}
                                        className="btn-icon"
                                        style={{ color: 'var(--safe)' }}
                                        disabled={isUpdatingDoc}
                                    >
                                        <Check size={14} />
                                    </button>
                                    <button
                                        onClick={() => setEditingDocId(null)}
                                        className="btn-icon"
                                        style={{ color: 'var(--critical)' }}
                                        disabled={isUpdatingDoc}
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <FileText size={16} style={{ color: '#94a3b8' }} />
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>{doc.name}</span>
                                                {doc.file_url && <Paperclip size={12} style={{ color: 'var(--primary)', transform: 'rotate(45deg)' }} />}
                                            </div>
                                            {doc.file_url && (
                                                <a href={doc.file_url} target="_blank" rel="noopener noreferrer" style={{
                                                    fontSize: '0.7rem',
                                                    color: 'var(--primary)',
                                                    textDecoration: 'none',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '2px',
                                                    fontWeight: '600'
                                                }}>
                                                    View File <ExternalLink size={10} />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <span style={{
                                            fontSize: '0.8125rem',
                                            color: doc.status === 'critical' ? 'var(--critical)' : doc.status === 'warning' ? 'var(--warning)' : 'var(--safe)',
                                            fontWeight: '700'
                                        }}>
                                            {doc.expiry_date}
                                        </span>
                                        <div style={{ display: 'flex', gap: '0.25rem' }}>
                                            <button
                                                onClick={() => startEditingDoc(doc)}
                                                className="btn-icon"
                                                style={{ color: 'var(--secondary)' }}
                                            >
                                                <Edit2 size={13} />
                                            </button>
                                            <button
                                                onClick={() => onDeleteDocument(doc.id, employee.id)}
                                                className="btn-icon"
                                                style={{ color: 'var(--secondary)' }}
                                            >
                                                <Trash2 size={13} />
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                    {employee.documents.length === 0 && (
                        <div style={{ fontSize: '0.875rem', color: '#94a3b8', fontStyle: 'italic', padding: '1rem', textAlign: 'center' }}>
                            No documents added yet.
                        </div>
                    )}
                </div>
            </div>

            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.5rem' }}>
                <button
                    onClick={() => onAddDocument(employee.id)}
                    className="btn"
                    style={{
                        flex: 1,
                        padding: '10px',
                        background: 'rgba(0, 42, 78, 0.05)',
                        color: 'var(--secondary)',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        fontSize: '0.875rem'
                    }}
                >
                    <Paperclip size={16} />
                    Add Document
                </button>
                <button
                    onClick={() => onDelete(employee.id)}
                    className="btn-icon"
                    style={{
                        background: 'rgba(218, 31, 51, 0.1)',
                        color: 'var(--critical)',
                        padding: '10px'
                    }}
                    title="Delete Employee"
                >
                    <Trash2 size={18} />
                </button>
            </div>
        </div>
    );
}
