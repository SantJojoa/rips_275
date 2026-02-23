import Header from './Header';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getToken, isTokenExpired, clearToken } from '../lib/auth';

export default function Layout({ children }) {
    const navigate = useNavigate();

    useEffect(() => {
        const checkToken = () => {
            const token = getToken();
            if (token && isTokenExpired(token)) {
                clearToken();
                navigate('/login');
            }
        };

        checkToken();
        const interval = setInterval(checkToken, 60000); // Check every minute
        return () => clearInterval(interval);
    }, [navigate]);

    return (
        <div className="min-h-dvh bg-gradient-to-br from-slate-50 to-slate-100">
            <Header />
            <main className="mx-auto max-w-5xl p-8">
                {children}
            </main>
        </div>
    );
}
