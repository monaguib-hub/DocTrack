import React from 'react';
import { Employee } from '@/hooks/useEmployees';

interface EmployeeCardProps {
    employee: Employee;
    onAddDocument: (id: string) => void;
    onDelete: (id: string) => void;
}

export function EmployeeCard({ employee, onAddDocument, onDelete }: EmployeeCardProps) {
    const criticalDocs = employee.documents.filter(d => d.status === 'critical');
    const warningDocs = employee.documents.filter(d => d.status === 'warning');

    return (
        <div className="premium-card employee-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--secondary), var(--primary))',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: '700'
                    }}>
                        {employee.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                        <h3 style={{ margin: 0, fontSize: '1.125rem' }}>{employee.name}</h3>
                        <p style={{ margin: 0, fontSize: '0.875rem', color: '#64748b' }}>{employee.position}</p>
                    </div>
                </div>

                {criticalDocs.length > 0 ? (
                    <div className="status-badge status-critical">{criticalDocs.length} Critical</div>
                ) : warningDocs.length > 0 ? (
                    <div className="status-badge status-warning">{warningDocs.length} Warning</div>
                ) : (
                    <div className="status-badge status-safe">All Clear</div>
                )}
            </div>

            <div style={{ marginTop: '1rem', borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                    Documents ({employee.documents.length})
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {employee.documents.map(doc => (
                        <div key={doc.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                            <span>{doc.name}</span>
                            <span style={{
                                color: doc.status === 'critical' ? 'var(--critical)' : doc.status === 'warning' ? 'var(--warning)' : 'var(--safe)',
                                fontWeight: '600'
                            }}>
                                {doc.expiry_date}
                            </span>
                        </div>
                    ))}
                    {employee.documents.length === 0 && (
                        <div style={{ fontSize: '0.875rem', color: '#94a3b8', fontStyle: 'italic' }}>No documents added yet.</div>
                    )}
                </div>
            </div>

            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.5rem' }}>
                <button
                    onClick={() => onAddDocument(employee.id)}
                    style={{
                        flex: 1,
                        padding: '8px',
                        borderRadius: '6px',
                        border: '1px solid #e2e8f0',
                        background: 'white',
                        fontWeight: '600',
                        fontSize: '0.875rem',
                        cursor: 'pointer'
                    }}
                >
                    Add Document
                </button>
                <button
                    onClick={() => onDelete(employee.id)}
                    style={{
                        padding: '8px',
                        borderRadius: '6px',
                        border: 'None',
                        background: 'rgba(218, 31, 51, 0.05)',
                        color: 'var(--critical)',
                        cursor: 'pointer'
                    }}
                    title="Delete Employee"
                >
                    🗑️
                </button>
            </div>
        </div>
    );
}
