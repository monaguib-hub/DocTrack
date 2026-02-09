import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { DOCUMENT_CATEGORIES as INITIAL_CATEGORIES } from '@/data/documentTypes';

export interface DocType {
    id: string;
    name: string;
    category: string;
    parent_id: string | null;
}

export interface Document {
    id: string;
    name: string;
    expiry_date: string | null;
    file_url?: string;
    status?: 'safe' | 'warning' | 'critical';
}

export interface Employee {
    id: string;
    name: string;
    position: string;
    documents: Document[];
}

export function useEmployees() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [docTypes, setDocTypes] = useState<DocType[]>([]);
    const [loading, setLoading] = useState(true);

    const calculateStatus = (expiryDate: string | null): 'safe' | 'warning' | 'critical' => {
        if (!expiryDate) return 'safe';
        const today = new Date();
        const expiry = new Date(expiryDate);
        const diffTime = expiry.getTime() - today.getTime();
        const diffMonths = diffTime / (1000 * 60 * 60 * 24 * 30.44);

        if (diffMonths <= 1) return 'critical';
        if (diffMonths <= 3) return 'warning';
        return 'safe';
    };

    const fetchDocTypes = async () => {
        try {
            const { data, error } = await supabase
                .from('document_types')
                .select('*')
                .order('name');

            if (!error && data && data.length > 0) {
                setDocTypes(data);
            } else {
                // Return fallback even if empty
                const fallback: DocType[] = [];
                Object.entries(INITIAL_CATEGORIES).forEach(([cat, names]) => {
                    names.forEach(name => {
                        fallback.push({ id: name, name, category: cat, parent_id: null });
                    });
                });
                setDocTypes(fallback);
            }
        } catch (err) {
            console.error('Error fetching doc types:', err);
        }
    };

    const fetchData = async () => {
        try {
            setLoading(true);
            await fetchDocTypes();

            // Try Supabase first
            const { data: supabaseEmployees, error } = await supabase
                .from('employees')
                .select('*, documents(*)');

            if (!error && supabaseEmployees) {
                const transformedData = supabaseEmployees.map((emp: any) => ({
                    ...emp,
                    documents: (emp.documents || []).map((doc: any) => ({
                        ...doc,
                        status: calculateStatus(doc.expiry_date)
                    }))
                })).sort((a: any, b: any) => {
                    if (a.name === 'ABS Mideast Ltd') return -1;
                    if (b.name === 'ABS Mideast Ltd') return 1;
                    return a.name.localeCompare(b.name);
                });
                setEmployees(transformedData);
                localStorage.setItem('doctrack_data', JSON.stringify(transformedData));
            } else {
                if (error) console.error('Supabase fetch error:', error);
                // Fallback to localStorage
                const localData = localStorage.getItem('doctrack_data');
                if (localData) {
                    setEmployees(JSON.parse(localData));
                }
            }
        } catch (err) {
            console.error('Error fetching data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const addEmployee = async (name: string, position: string) => {
        const newId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 11);
        const newEmployee: Employee = {
            id: newId,
            name,
            position,
            documents: []
        };

        try {
            const { data, error } = await supabase.from('employees').insert([{ name, position }]).select().single();
            if (error) throw error;
            const dbEmployee = data ? { ...data, documents: [] } : newEmployee;
            setEmployees(prev => [...prev, dbEmployee]);
            localStorage.setItem('doctrack_data', JSON.stringify([...employees, dbEmployee]));
        } catch (err) {
            console.error('Supabase add error:', err);
            const updated = [...employees, newEmployee];
            setEmployees(updated);
            localStorage.setItem('doctrack_data', JSON.stringify(updated));
        }
    };

    const updateEmployee = async (id: string, name: string, position: string) => {
        try {
            const { error } = await supabase.from('employees').update({ name, position }).eq('id', id);
            if (error) throw error;
            setEmployees(prev => prev.map(emp => emp.id === id ? { ...emp, name, position } : emp));
        } catch (err) {
            console.error('Supabase update error:', err);
            setEmployees(prev => prev.map(emp => emp.id === id ? { ...emp, name, position } : emp));
        }
    };

    const deleteEmployee = async (id: string) => {
        try {
            await supabase.from('employees').delete().eq('id', id);
            setEmployees(prev => prev.filter(emp => emp.id !== id));
        } catch (err) {
            console.error('Supabase delete error:', err);
            setEmployees(prev => prev.filter(emp => emp.id !== id));
        }
    };

    const addDocument = async (employeeId: string, name: string, expiryDate: string | null, fileUrl?: string) => {
        const newId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 11);
        const newDoc: Document = {
            id: newId,
            name,
            expiry_date: expiryDate,
            file_url: fileUrl,
            status: calculateStatus(expiryDate)
        };

        try {
            const { error } = await supabase.from('documents').insert([{
                employee_id: employeeId,
                name,
                expiry_date: expiryDate,
                file_url: fileUrl
            }]);
            if (error) throw error;

            setEmployees(prev => prev.map(emp => {
                if (emp.id === employeeId) {
                    return { ...emp, documents: [...(emp.documents || []), newDoc] };
                }
                return emp;
            }));
        } catch (err) {
            console.error('Supabase doc add error:', err);
        }
    };

    const deleteDocument = async (docId: string, employeeId: string) => {
        try {
            await supabase.from('documents').delete().eq('id', docId);
            setEmployees(prev => prev.map(emp => {
                if (emp.id === employeeId) {
                    return { ...emp, documents: emp.documents.filter(d => d.id !== docId) };
                }
                return emp;
            }));
        } catch (err) {
            console.error('Supabase doc delete error:', err);
        }
    };

    const uploadFile = async (file: File) => {
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `documents/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('doctrack_files')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data } = supabase.storage
                .from('doctrack_files')
                .getPublicUrl(filePath);

            return data.publicUrl;
        } catch (err) {
            console.error('File upload error:', err);
            return null;
        }
    };

    const updateDocument = async (docId: string, name: string, expiryDate: string | null, fileUrl?: string) => {
        try {
            const updateData: any = { name, expiry_date: expiryDate };
            if (fileUrl) updateData.file_url = fileUrl;

            const { error } = await supabase.from('documents').update(updateData).eq('id', docId);
            if (error) throw error;
            setEmployees(prev => prev.map(emp => ({
                ...emp,
                documents: emp.documents.map(d => d.id === docId ? {
                    ...d,
                    name,
                    expiry_date: expiryDate,
                    file_url: fileUrl || d.file_url,
                    status: calculateStatus(expiryDate)
                } : d)
            })));
        } catch (err) {
            console.error('Supabase doc update error:', err);
        }
    };

    return {
        employees,
        docTypes,
        loading,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        addDocument,
        updateDocument,
        deleteDocument,
        uploadFile,
        refresh: fetchData
    };
}
