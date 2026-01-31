import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';

export function Register({ onSwitch }) {
    const { register } = useAuth();
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await register(formData.username, formData.password);
            alert('Registration successful! Please sign in.');
            onSwitch();
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="flex h-screen w-full items-center justify-center bg-black">
            <Card className="w-full max-w-md border-zinc-800 bg-zinc-900">
                <CardHeader>
                    <CardTitle className="text-2xl text-center text-white">Create Account</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Input
                                placeholder="Username"
                                value={formData.username}
                                onChange={e => setFormData({ ...formData, username: e.target.value })}
                            />
                        </div>
                        <div>
                            <Input
                                type="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={e => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        <Button type="submit" className="w-full">Register</Button>
                        <p className="text-center text-sm text-zinc-500 mt-4">
                            Already have an account?{' '}
                            <button type="button" onClick={onSwitch} className="text-blue-500 hover:underline">
                                Sign In
                            </button>
                        </p>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
