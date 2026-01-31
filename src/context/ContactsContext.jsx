import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { classifyContact } from '../utils/logic';
import { useSettings } from './SettingsContext';
import { useAuth } from './AuthContext';
import { API_BASE_URL } from '../config';

const ContactsContext = createContext();

export function ContactsProvider({ children }) {
    const { thresholds } = useSettings();
    const { token } = useAuth();
    const [contacts, setContacts] = useState([]);

    // Fetch contacts from API
    useEffect(() => {
        if (token) {
            fetch(`${API_BASE_URL}/api/contacts`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            .then(res => res.json())
            .then(data => {
                // Ensure loaded contacts are classified correctly with current thresholds
                const classified = data.map(c => ({
                    ...c,
                    category: classifyContact(Number(c.x), Number(c.y), Number(c.z), thresholds)
                }));
                setContacts(classified);
            })
            .catch(err => console.error('Failed to fetch contacts:', err));
        }
    }, [token]);

    // Re-classify all contacts when thresholds change
    useEffect(() => {
        setContacts(prev => prev.map(c => ({
            ...c,
            category: classifyContact(Number(c.x), Number(c.y), Number(c.z), thresholds)
        })));
    }, [thresholds]);

    const addContact = (data) => {
        const newContact = {
            id: uuidv4(),
            ...data,
            category: classifyContact(Number(data.x), Number(data.y), Number(data.z), thresholds)
        };

        // Optimistic update
        setContacts(prev => [...prev, newContact]);

        // API call
        fetch(`${API_BASE_URL}/api/contacts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(newContact)
        }).catch(err => console.error('Failed to add contact:', err));
    };

    const updateContact = (id, data) => {
        // Optimistic update
        setContacts(prev => prev.map(c => {
            if (c.id === id) {
                const updated = { ...c, ...data };
                return {
                    ...updated,
                    category: classifyContact(
                        Number(updated.x),
                        Number(updated.y),
                        Number(updated.z),
                        thresholds
                    )
                };
            }
            return c;
        }));

        // API call
        const contactToUpdate = contacts.find(c => c.id === id);
        if (contactToUpdate) {
            const updatedData = { ...contactToUpdate, ...data };
            updatedData.category = classifyContact(Number(updatedData.x), Number(updatedData.y), Number(updatedData.z), thresholds);
            
            fetch(`${API_BASE_URL}/api/contacts/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updatedData)
            }).catch(err => console.error('Failed to update contact:', err));
        }
    };

    const deleteContact = (id) => {
        // Optimistic update
        setContacts(prev => prev.filter(c => c.id !== id));

        // API call
        fetch(`${API_BASE_URL}/api/contacts/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        }).catch(err => console.error('Failed to delete contact:', err));
    };

    return (
        <ContactsContext.Provider value={{ contacts, addContact, updateContact, deleteContact }}>
            {children}
        </ContactsContext.Provider>
    );
}

export function useContacts() {
    const context = useContext(ContactsContext);
    if (!context) {
        throw new Error('useContacts must be used within a ContactsProvider');
    }
    return context;
}
