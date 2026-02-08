import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface Document {
    id: string;
    name: string;
    expiry_date: string;
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
    const [loading, setLoading] = useState(true);

    const calculateStatus = (expiryDate: string): 'safe' | 'warning' | 'critical' => {
        const today = new Date();
        const expiry = new Date(expiryDate);
        const diffTime = expiry.getTime() - today.getTime();
        const diffMonths = diffTime / (1000 * 60 * 60 * 24 * 30.44);

        if (diffMonths <= 1) return 'critical';
        if (diffMonths <= 3) return 'warning';
        return 'safe';
    };

    const fetchData = async () => {
        try {
            setLoading(true);

            // Try Supabase first
            const { data: supabaseEmployees, error } = await supabase
                .from('employees')
                .select('*, documents(*)');

            if (!error && supabaseEmployees) {
                const transformedData = supabaseEmployees.map((emp: any) => ({
                    ...emp,
                    documents: emp.documents.map((doc: any) => ({
                        ...doc,
                        status: calculateStatus(doc.expiry_date)
                    }))
                }));
                setEmployees(transformedData);
            } else {
                // Fallback to localStorage if Supabase is not configured or fails
                console.warn('Supabase fetch failed or not configured, using localStorage fallback');
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
        const newEmployee: Employee = {
            id: crypto.randomUUID(),
            name,
            position,
            documents: []
        };

        // Attempt Supabase
        const { data, error } = await supabase.from('employees').insert([{ name, position }]).select().single();

        const updatedEmployees = [...employees, data || newEmployee];
        setEmployees(updatedEmployees);
        localStorage.setItem('doctrack_data', JSON.stringify(updatedEmployees));
    };

    const addDocument = async (employeeId: string, name: string, expiryDate: string) => {
        const newDoc: Document = {
            id: crypto.randomUUID(),
            name,
            expiry_date: expiryDate,
            status: calculateStatus(expiryDate)
        };

        // Attempt Supabase
        await supabase.from('documents').insert([{ employee_id: employeeId, name, expiry_date: expiryDate }]);

        const updatedEmployees = employees.map(emp => {
            if (emp.id === employeeId) {
                return {
                    ...emp,
                    documents: [...emp.documents, newDoc]
                };
            }
            return emp;
        });

        setEmployees(updatedEmployees);
        localStorage.setItem('doctrack_data', JSON.stringify(updatedEmployees));
    };

    const deleteEmployee = async (id: string) => {
        await supabase.from('employees').delete().eq('id', id);
        const updated = employees.filter(emp => emp.id !== id);
        setEmployees(updated);
        localStorage.setItem('doctrack_data', JSON.stringify(updated));
    };

    return {
        employees,
        loading,
        addEmployee,
        addDocument,
        deleteEmployee,
        refresh: fetchData
    };
}
