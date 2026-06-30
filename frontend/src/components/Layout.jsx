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
        const interval = setInterval(checkToken, 60000);
        return () => clearInterval(interval);
    }, [navigate]);

    return (
        <div className="min-h-dvh" style={{ backgroundColor: '#FBFBFA' }}>
            <Header />
            <main className="max-w-7xl mx-auto px-6 py-8">
                {children}
            </main>
        </div>
    );
}
