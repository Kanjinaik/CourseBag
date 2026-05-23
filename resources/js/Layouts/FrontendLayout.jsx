import Header from '../Frontend/components/Header';
import Footer from '../Frontend/components/Footer';
import Meta from '../Frontend/components/Meta';

export default function FrontendLayout({ children }) {
    return (
        <>
            <Meta />
            <div className="min-h-screen bg-white flex flex-col">
                {/* Header */}
                <Header />

                {/* Main content */}
                <main className="flex-1 relative ">
                    {children}
                </main>

                {/* Footer */}
                <Footer />
            </div>
        </>
    );
} 
