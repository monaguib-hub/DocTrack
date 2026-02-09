'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Trash2, ChevronDown, ChevronRight, Save, X, FolderPlus } from 'lucide-react';
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

    const categories = Array.from(new Set(docTypes.map(d => d.category)));
    if (categories.length === 0) {
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
                // If table doesn't exist yet, we'll use initial hardcoded data as a template
                console.warn('Document types table not found or error. Ensure SQL is run.');
                const mockData: DocType[] = [];
                Object.entries(INITIAL_CATEGORIES).forEach(([cat, names]) => {
                    names.forEach(name => {
                        mockData.push({ id: Math.random().toString(), name, category: cat, parent_id: null });
                    });
                });
                setDocTypes(mockData);
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
            fetchDocTypes();
        } catch (err) {
            console.error('Add error:', err);
            // Fallback for demo
            setDocTypes([...docTypes, { id: Date.now().toString(), name: newDocName, category, parent_id: parentTypeId }]);
        }
    };

    const handleDeleteType = async (id: string) => {
        try {
            const { error } = await supabase.from('document_types').delete().eq('id', id);
            if (error) throw error;
            fetchDocTypes();
        } catch (err) {
            console.error('Delete error:', err);
            setDocTypes(docTypes.filter(d => d.id !== id));
        }
    };

    const renderType = (type: DocType, depth = 0) => {
        const children = docTypes.filter(d => d.parent_id === type.id);

        return (
            <div key={type.id} style={{ marginLeft: `${depth * 2}rem` }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                    background: 'white',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    marginBottom: '0.5rem'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {children.length > 0 ? <ChevronDown size={16} /> : <div style={{ width: 16 }} />}
                        <span style={{ fontWeight: '600' }}>{type.name}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                            onClick={() => {
                                setNewDocName('');
                                setParentTypeId(type.id);
                                setSelectedCategory(type.category);
                                setIsAddingCategory(false);
                            }}
                            className="btn-icon"
                            title="Add Sub-document"
                        >
                            <Plus size={16} />
                        </button>
                        <button onClick={() => handleDeleteType(type.id)} className="btn-icon" style={{ color: 'var(--critical)' }}>
                            <Trash2 size={16} />
                        </button>
                    </div>
                </div>
                {children.map(child => renderType(child, depth + 1))}
            </div>
        );
    };

    return (
        <div className="container" style={{ maxWidth: '800px' }}>
            <header style={{ marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>Document Management</h1>
                <p style={{ color: '#64748b' }}>Configure document types, categories, and hierarchical structures.</p>
            </header>

            <div className="premium-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
                <h3 style={{ marginBottom: '1.5rem' }}>{parentTypeId ? 'Add Sub-document' : 'Add New Document Type'}</h3>
                {parentTypeId && (
                    <div style={{ marginBottom: '1rem', padding: '0.5rem', background: '#f1f5f9', borderRadius: '4px', fontSize: '0.875rem' }}>
                        Nesting under: <strong>{docTypes.find(d => d.id === parentTypeId)?.name}</strong>
                        <button onClick={() => setParentTypeId(null)} style={{ marginLeft: '1rem', border: 'none', background: 'none', color: 'var(--critical)', cursor: 'pointer' }}>Cancel</button>
                    </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Document Name (e.g. Passport, Inspection Report)"
                            value={newDocName}
                            onChange={e => setNewDocName(e.target.value)}
                            style={{ flex: 2 }}
                        />
                        {!parentTypeId && (
                            <>
                                {isAddingCategory ? (
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="New Category Name"
                                        value={newCategory}
                                        onChange={e => setNewCategory(e.target.value)}
                                        style={{ flex: 1 }}
                                    />
                                ) : (
                                    <select
                                        className="form-input"
                                        value={selectedCategory}
                                        onChange={e => setSelectedCategory(e.target.value)}
                                        style={{ flex: 1 }}
                                    >
                                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                    </select>
                                )}
                            </>
                        )}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        {!parentTypeId && (
                            <button
                                onClick={() => setIsAddingCategory(!isAddingCategory)}
                                style={{ background: 'none', border: 'none', color: 'var(--secondary)', fontSize: '0.875rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                            >
                                {isAddingCategory ? <X size={14} /> : <FolderPlus size={14} />}
                                {isAddingCategory ? 'Select Existing Category' : 'Create New Category'}
                            </button>
                        )}
                        <button onClick={handleAddType} className="btn btn-primary" style={{ marginLeft: 'auto' }}>
                            {parentTypeId ? 'Add Sub-doc' : 'Add Document Type'}
                        </button>
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {categories.map(category => (
                    <div key={category}>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: '700', textTransform: 'uppercase', color: '#94a3b8', marginBottom: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
                            {category}
                        </h3>
                        {docTypes
                            .filter(d => d.category === category && !d.parent_id)
                            .map(type => renderType(type))}
                    </div>
                ))}
            </div>
        </div>
    );
}
