import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { classifyContact } from '../utils/logic';
import { useSettings } from './SettingsContext';

const ContactsContext = createContext();

const STORAGE_KEY = 'social-capital-contacts';

export function ContactsProvider({ children }) {
    const { thresholds } = useSettings();
    const [contacts, setContacts] = useState(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
    }, [contacts]);

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
        setContacts(prev => [...prev, newContact]);
    };

    const updateContact = (id, data) => {
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
    };

    const deleteContact = (id) => {
        setContacts(prev => prev.filter(c => c.id !== id));
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
