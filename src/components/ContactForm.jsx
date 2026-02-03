import React, { useState } from 'react';
import { useContacts } from '../context/ContactsContext';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Card, CardContent } from './ui/Card';
import { Plus, X, Pencil, Trash2, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CATEGORIES } from '../utils/logic';
import { TAG_CATEGORIES, getTagById } from '../utils/tags';

export function ContactForm() {
    const { contacts, addContact, updateContact, deleteContact } = useContacts();
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({ name: '', x: 5, y: 5, z: 5, note: '', value_provide: '', value_receive: '', tags: [] });

    const resetForm = () => {
        setFormData({ name: '', x: 5, y: 5, z: 5, note: '', value_provide: '', value_receive: '', tags: [] });
        setEditingId(null);
        setIsEditing(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingId) {
            updateContact(editingId, formData);
        } else {
            addContact(formData);
        }
        resetForm();
    };

    const handleEdit = (contact) => {
        setFormData({
            name: contact.name,
            x: contact.x,
            y: contact.y,
            z: contact.z,
            note: contact.note || '',
            value_provide: contact.value_provide || '',
            value_receive: contact.value_receive || '',
            tags: contact.tags || []
        });
        setEditingId(contact.id);
        setIsEditing(true);
    };

    const toggleTag = (tagId) => {
        setFormData(prev => {
            const tags = prev.tags.includes(tagId)
                ? prev.tags.filter(t => t !== tagId)
                : [...prev.tags, tagId];
            return { ...prev, tags };
        });
    };

    return (
        <div className="h-full flex flex-col md:flex-row gap-6 p-6">
            {/* Contact List */}
            <div className="flex-1 overflow-y-auto pr-2 space-y-3">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold">Contacts ({contacts.length})</h2>
                    <Button onClick={() => setIsEditing(true)} size="sm">
                        <Plus size={16} className="mr-2" /> Add New
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {contacts.map((contact) => (
                        <motion.div
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            key={contact.id}
                        >
                            <Card className="hover:border-zinc-700 transition-colors">
                                <CardContent className="p-4 relative group">
                                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                        <button onClick={() => handleEdit(contact)} className="text-zinc-400 hover:text-white"><Pencil size={14} /></button>
                                        <button onClick={() => deleteContact(contact.id)} className="text-zinc-400 hover:text-red-500"><Trash2 size={14} /></button>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="w-3 h-3 rounded-full"
                                            style={{ backgroundColor: CATEGORIES[contact.category]?.color || '#999' }}
                                        />
                                        <h3 className="font-bold text-lg">{contact.name}</h3>
                                    </div>
                                    <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-zinc-400">
                                        <div className="bg-zinc-800/50 rounded p-1 text-center">X: {contact.x}</div>
                                        <div className="bg-zinc-800/50 rounded p-1 text-center">Y: {contact.y}</div>
                                        <div className="bg-zinc-800/50 rounded p-1 text-center">Z: {contact.z}</div>
                                    </div>

                                    {(contact.value_provide || contact.value_receive) && (
                                        <div className="mt-3 space-y-1 border-t border-zinc-800/50 pt-2">
                                            {contact.value_provide && (
                                                <div className="text-[10px] leading-tight text-zinc-400">
                                                    <span className="text-green-500/80 font-medium">我提供:</span> {contact.value_provide}
                                                </div>
                                            )}
                                            {contact.value_receive && (
                                                <div className="text-[10px] leading-tight text-zinc-400">
                                                    <span className="text-blue-500/80 font-medium">对方提供:</span> {contact.value_receive}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {contact.tags && contact.tags.length > 0 && (
                                        <div className="mt-2 flex flex-wrap gap-1">
                                            {contact.tags.map(tagId => {
                                                const tag = getTagById(tagId);
                                                if (!tag) return null;
                                                return (
                                                    <span 
                                                        key={tagId} 
                                                        className="text-[9px] px-1.5 py-0.5 rounded-full border border-zinc-800 bg-zinc-900/50 text-zinc-500"
                                                        style={{ borderColor: `${tag.color}33`, color: tag.color }}
                                                    >
                                                        {tag.label}
                                                    </span>
                                                );
                                            })}
                                        </div>
                                    )}

                                    {contact.note && <p className="mt-2 text-xs text-zinc-500 truncate">{contact.note}</p>}
                                    <div className="mt-2 text-[10px] uppercase tracking-wider font-semibold text-zinc-500">
                                        {CATEGORIES[contact.category]?.label}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Editor Panel (Slide Over) */}
            <AnimatePresence>
                {isEditing && (
                    <motion.div
                        initial={{ x: 300, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 300, opacity: 0 }}
                        className="w-full md:w-[450px] bg-zinc-900 border-l border-zinc-800 p-6 shadow-2xl absolute right-0 top-0 bottom-0 md:relative z-20 h-full overflow-y-auto"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold">{editingId ? 'Edit Contact' : 'New Contact'}</h3>
                            <Button size="icon" variant="ghost" onClick={resetForm}><X size={20} /></Button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1 text-zinc-400">Name</label>
                                <Input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. John Doe" />
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-zinc-400">Value Relevance (X) - {formData.x}</label>
                                    <input type="range" min="0" max="10" step="0.5" value={formData.x} onChange={e => setFormData({ ...formData, x: e.target.value })} className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-zinc-400">Energy Level (Y) - {formData.y}</label>
                                    <input type="range" min="0" max="10" step="0.5" value={formData.y} onChange={e => setFormData({ ...formData, y: e.target.value })} className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-zinc-400">Accessibility (Z) - {formData.z}</label>
                                    <input type="range" min="0" max="10" step="0.5" value={formData.z} onChange={e => setFormData({ ...formData, z: e.target.value })} className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-zinc-400">What I can provide to them</label>
                                    <Input value={formData.value_provide} onChange={e => setFormData({ ...formData, value_provide: e.target.value })} placeholder="e.g. Technical advice, Networking" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-zinc-400">What they can provide to me</label>
                                    <Input value={formData.value_receive} onChange={e => setFormData({ ...formData, value_receive: e.target.value })} placeholder="e.g. Funding, Mentorship" />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="block text-sm font-medium text-zinc-400">Value Tags</label>
                                {Object.values(TAG_CATEGORIES).map(category => (
                                    <div key={category.id} className="space-y-2">
                                        <h4 className="text-xs font-semibold uppercase tracking-wider" style={{ color: category.color }}>{category.label}</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {category.tags.map(tag => {
                                                const isSelected = formData.tags.includes(tag.id);
                                                return (
                                                    <div key={tag.id} className="relative group">
                                                        <button
                                                            type="button"
                                                            onClick={() => toggleTag(tag.id)}
                                                            className={`text-xs px-2 py-1 rounded-full border transition-colors flex items-center gap-1 ${
                                                                isSelected 
                                                                    ? `bg-opacity-20 border-opacity-50` 
                                                                    : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-500'
                                                            }`}
                                                            style={isSelected ? { 
                                                                backgroundColor: `${category.color}33`, 
                                                                borderColor: category.color, 
                                                                color: 'white' 
                                                            } : {}}
                                                        >
                                                            {isSelected && <Check size={10} />}
                                                            {tag.label}
                                                        </button>
                                                        
                                                        {/* Tooltip - Adjusted to left-aligned to prevent clipping */}
                                                        <div className="absolute bottom-full left-0 mb-2 w-48 p-2 bg-zinc-900 border border-zinc-700 rounded shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                                                            <div className="font-semibold text-white text-xs mb-1">{tag.label}</div>
                                                            <div className="text-[10px] text-zinc-300 mb-1">{tag.desc}</div>
                                                            <div className="text-[10px] text-zinc-500 italic">Ex: {tag.example}</div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1 text-zinc-400">Notes</label>
                                <textarea
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-md p-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                                    rows={4}
                                    value={formData.note}
                                    onChange={e => setFormData({ ...formData, note: e.target.value })}
                                    placeholder="Strategic value, background, etc."
                                />
                            </div>

                            <div className="pt-4 flex gap-2">
                                <Button type="submit" className="flex-1">Save Contact</Button>
                                {editingId && <Button type="button" variant="danger" onClick={() => { deleteContact(editingId); resetForm(); }}>Delete</Button>}
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
