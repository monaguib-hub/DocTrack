'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import {
    Plus,
    Trash2,
    ChevronDown,
    ChevronRight,
    Edit2,
    Check,
    X,
    Folder,
    FileText,
    Box,
    Download,
    FolderPlus,
    Briefcase,
    Users,
    Anchor,
    MoreVertical
} from 'lucide-react';
import { DOCUMENT_CATEGORIES as INITIAL_CATEGORIES } from '@/data/documentTypes';

interface DocType {
    id: string;
    name: string;
    category: string;
    parent_id: string | null;
}

export default function ManageDocsPage() {
    const [docTypes, setDocTypes] = useState<DocType[]>([]);
    const [loading, setLoading] = useState(true);
    const [newDocName, setNewDocName] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Office Documents');
    const [newCategory, setNewCategory] = useState('');
    const [isAddingCategory, setIsAddingCategory] = useState(false);
    const [parentTypeId, setParentTypeId] = useState<string | null>(null);

    // Edit state
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingName, setEditingName] = useState('');

    const categories = Array.from(new Set(docTypes.map(d => d.category)));
    if (categories.length === 0 && !loading) {
        categories.push('Office Documents', 'Employee Documents', 'Port Passes');
    }

    const fetchDocTypes = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('document_types')
                .select('*')
                .order('name');

            if (data) {
                setDocTypes(data);
            } else if (error) {
                console.warn('Document types table not found or error. Ensure SQL is run.');
                // Fallback to empty if not found, let the user import
                setDocTypes([]);
            }
        } catch (err) {
            console.error('Fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDocTypes();
    }, []);

    const handleImportTemplates = async () => {
        if (!confirm('This will import all 35+ default document types from the system template. Continue?')) return;

        try {
            setLoading(true);
            const inserts: any[] = [];
            Object.entries(INITIAL_CATEGORIES).forEach(([cat, names]) => {
                names.forEach(name => {
                    inserts.push({ name, category: cat, parent_id: null });
                });
            });

            const { error } = await supabase.from('document_types').insert(inserts);
            if (error) throw error;

            await fetchDocTypes();
            alert('Templates imported successfully!');
        } catch (err) {
            console.error('Import error:', err);
            alert('Failed to import. Ensure the "document_types" table exists.');
        } finally {
            setLoading(false);
        }
    };

    const handleAddType = async () => {
        if (!newDocName) return;
        const category = isAddingCategory ? newCategory : selectedCategory;

        try {
            const { error } = await supabase.from('document_types').insert([{
                name: newDocName,
                category,
                parent_id: parentTypeId
            }]);

            if (error) throw error;

            setNewDocName('');
            setParentTypeId(null);
            setIsAddingCategory(false);
            fetchDocTypes();
        } catch (err) {
            console.error('Add error:', err);
            alert('Failed to add. Make sure the database table exists.');
        }
    };

    const handleUpdateType = async (id: string) => {
        if (!editingName) return;
        try {
            const { error } = await supabase
                .from('document_types')
                .update({ name: editingName })
                .eq('id', id);

            if (error) throw error;
            setEditingId(null);
            fetchDocTypes();
        } catch (err) {
            console.error('Update error:', err);
            alert('Failed to update.');
        }
    };

    const handleDeleteType = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to delete "${name}"? All sub-documents will also be removed.`)) return;
        try {
            const { error } = await supabase.from('document_types').delete().eq('id', id);
            if (error) throw error;
            fetchDocTypes();
        } catch (err) {
            console.error('Delete error:', err);
            alert('Failed to delete.');
        }
    };

    const getCategoryIcon = (cat: string) => {
        if (cat.toLowerCase().includes('office')) return <Briefcase size={18} />;
        if (cat.toLowerCase().includes('employee')) return <Users size={18} />;
        if (cat.toLowerCase().includes('port')) return <Anchor size={18} />;
        return <Folder size={18} />;
    };

    const renderTreeItem = (type: DocType, depth = 0) => {
        const children = docTypes.filter(d => d.parent_id === type.id);
        const isEditing = editingId === type.id;

        return (
            <div key={type.id} style={{ marginLeft: depth > 0 ? '1.5rem' : '0' }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.5rem 1rem',
                    background: isEditing ? 'rgba(218, 31, 51, 0.05)' : 'white',
                    borderRadius: '12px',
                    border: '1px solid',
                    borderColor: isEditing ? 'var(--primary)' : '#e2e8f0',
                    marginBottom: '0.4rem',
                    transition: 'all 0.2s ease',
                    position: 'relative'
                }} className="interactive-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
                        <div style={{ color: depth === 0 ? 'var(--secondary)' : '#64748b' }}>
                            {children.length > 0 ? <ChevronDown size={14} /> : <div style={{ width: 14 }} />}
                        </div>
                        <div style={{ color: depth === 0 ? 'var(--primary)' : 'var(--secondary)', opacity: 0.8 }}>
                            {depth === 0 ? <Folder size={16} /> : <FileText size={16} />}
                        </div>

                        {isEditing ? (
                            <input
                                autoFocus
                                className="form-input"
                                style={{ padding: '2px 8px', height: '28px', fontSize: '0.9rem' }}
                                value={editingName}
                                onChange={e => setEditingName(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleUpdateType(type.id)}
                            />
                        ) : (
                            <span style={{
                                fontWeight: depth === 0 ? '700' : '600',
                                fontSize: depth === 0 ? '1rem' : '0.9rem',
                                color: 'var(--secondary)'
                            }}>
                                {type.name}
                            </span>
                        )}
                    </div>

                    <div style={{ display: 'flex', gap: '0.25rem', opacity: isEditing ? 1 : 0.6 }}>
                        {isEditing ? (
                            <>
                                <button onClick={() => handleUpdateType(type.id)} className="btn-icon" style={{ color: 'var(--safe)' }}>
                                    <Check size={16} />
                                </button>
                                <button onClick={() => setEditingId(null)} className="btn-icon">
                                    <X size={16} />
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={() => {
                                        setNewDocName('');
                                        setParentTypeId(type.id);
                                        setSelectedCategory(type.category);
                                        setIsAddingCategory(false);
                                    }}
                                    className="btn-icon"
                                    title="Add Sub-item"
                                >
                                    <Plus size={16} />
                                </button>
                                <button
                                    onClick={() => {
                                        setEditingId(type.id);
                                        setEditingName(type.name);
                                    }}
                                    className="btn-icon"
                                >
                                    <Edit2 size={14} />
                                </button>
                                <button onClick={() => handleDeleteType(type.id, type.name)} className="btn-icon" style={{ color: 'var(--critical)' }}>
                                    <Trash2 size={14} />
                                </button>
                            </>
                        )}
                    </div>
                </div>
                {children.map(child => renderTreeItem(child, depth + 1))}
            </div>
        );
    };

    return (
        <div className="container" style={{ maxWidth: '900px', paddingBottom: '5rem' }}>
            <header style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem', letterSpacing: '-0.025em' }}>
                        Document <span style={{ color: 'var(--primary)' }}>Manager</span>
                    </h1>
                    <p style={{ color: '#64748b' }}>Configure categories, document types, and hierarchical structures.</p>
                </div>
                {docTypes.length === 0 && !loading && (
                    <button
                        onClick={handleImportTemplates}
                        className="btn btn-primary"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--secondary)' }}
                    >
                        <Download size={18} />
                        Import Default Templates
                    </button>
                )}
            </header>

            <div className="premium-card" style={{ padding: '2rem', marginBottom: '3rem', border: '1px solid var(--primary)', background: 'rgba(218, 31, 51, 0.02)' }}>
                <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Plus size={20} color="var(--primary)" />
                    {parentTypeId ? 'Add Sub-document' : 'Create New Document Type'}
                </h3>

                {parentTypeId && (
                    <div style={{ marginBottom: '1rem', padding: '0.75rem', background: 'white', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.875rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>Nesting under: <strong style={{ color: 'var(--primary)' }}>{docTypes.find(d => d.id === parentTypeId)?.name}</strong></span>
                        <button onClick={() => setParentTypeId(null)} style={{ border: 'none', background: 'none', color: 'var(--critical)', cursor: 'pointer', fontWeight: '700' }}>CANCEL</button>
                    </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        <div style={{ flex: 2, minWidth: '250px' }}>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', marginBottom: '0.5rem', opacity: 0.6 }}>Name</label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="e.g. Health Certificate, Inspection Report"
                                value={newDocName}
                                onChange={e => setNewDocName(e.target.value)}
                                style={{ width: '100%' }}
                            />
                        </div>
                        {!parentTypeId && (
                            <div style={{ flex: 1, minWidth: '200px' }}>
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', marginBottom: '0.5rem', opacity: 0.6 }}>Category</label>
                                {isAddingCategory ? (
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="e.g. Vehicle Documents"
                                        value={newCategory}
                                        onChange={e => setNewCategory(e.target.value)}
                                        style={{ width: '100%' }}
                                    />
                                ) : (
                                    <select
                                        className="form-input"
                                        value={selectedCategory}
                                        onChange={e => setSelectedCategory(e.target.value)}
                                        style={{ width: '100%' }}
                                    >
                                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                    </select>
                                )}
                            </div>
                        )}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        {!parentTypeId && (
                            <button
                                onClick={() => {
                                    setIsAddingCategory(!isAddingCategory);
                                    if (!isAddingCategory) setNewCategory('');
                                }}
                                style={{ background: 'none', border: 'none', color: 'var(--secondary)', fontSize: '0.875rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '600' }}
                            >
                                {isAddingCategory ? <X size={16} /> : <FolderPlus size={16} />}
                                {isAddingCategory ? 'Select Existing' : 'New Category'}
                            </button>
                        )}
                        <button onClick={handleAddType} className="btn btn-primary" style={{ minWidth: '180px', justifyContent: 'center' }}>
                            {parentTypeId ? 'Add Sub-document' : 'Create Entry'}
                        </button>
                    </div>
                </div>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '5rem' }}>
                    <div className="premium-card" style={{ padding: '2rem', display: 'inline-block' }}>Loading Document Hierarchy...</div>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                    {categories.map(category => (
                        <div key={category} style={{ animation: 'fadeIn 0.5s ease-out' }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                marginBottom: '1.25rem',
                                borderBottom: '2px solid rgba(0,0,0,0.05)',
                                paddingBottom: '0.75rem'
                            }}>
                                <div style={{ color: 'var(--primary)' }}>
                                    {getCategoryIcon(category)}
                                </div>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    {category}
                                </h3>
                                <div style={{
                                    background: 'rgba(0,0,0,0.05)',
                                    padding: '2px 10px',
                                    borderRadius: '12px',
                                    fontSize: '0.75rem',
                                    fontWeight: '700',
                                    color: '#64748b'
                                }}>
                                    {docTypes.filter(d => d.category === category).length}
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                {docTypes
                                    .filter(d => d.category === category && !d.parent_id)
                                    .map(type => renderTreeItem(type))}

                                {docTypes.filter(d => d.category === category).length === 0 && (
                                    <div style={{ padding: '2rem', textAlign: 'center', background: 'rgba(0,0,0,0.02)', borderRadius: '12px', border: '1px dashed #e2e8f0', color: '#64748b', fontSize: '0.875rem' }}>
                                        No document types in this category.
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    {categories.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '5rem 2rem', background: 'rgba(0,0,0,0.02)', borderRadius: '2rem', border: '2px dashed #e2e8f0' }}>
                            <Box size={40} color="#cbd5e1" style={{ marginBottom: '1rem' }} />
                            <h3 style={{ color: '#64748b', marginBottom: '0.5rem' }}>No Categories Found</h3>
                            <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Start by importing templates or creating your first category.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
