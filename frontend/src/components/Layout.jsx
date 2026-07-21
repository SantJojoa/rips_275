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
        <div className="min-h-dvh flex flex-col" style={{ backgroundColor: '#FBFBFA' }}>
            <Header />
            <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
                {children}
            </main>
            <footer style={{ borderTop: '1px solid #EAEAEA', backgroundColor: '#F9F9F8', padding: '12px 24px', textAlign: 'center' }}>
                <p style={{ fontSize: 12, color: '#787774' }}>
                    ¿Encontraste un error o necesitas soporte?{' '}
                    <a href="mailto:auditoriacuentas@idsn.gov.co" style={{ color: '#462882', fontWeight: 600, textDecoration: 'none' }}>
                        auditoriacuentas@idsn.gov.co
                    </a>
                </p>
            </footer>
        </div>
    );
}
