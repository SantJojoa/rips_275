import Header from './Header';

export default function Layout({ children }) {
    return (
        <div className="min-h-dvh bg-gradient-to-br from-slate-50 to-slate-100">
            <Header />
            <main className="mx-auto max-w-5xl p-8">
                {children}
            </main>
        </div>
    );
}
