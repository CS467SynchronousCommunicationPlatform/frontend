import '@/app/ui/globals.css';
import { inter } from '@/app/ui/fonts';
import { AppProvider } from './lib/contexts/AppContext';



export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
        <body>
        <AppProvider>
            {children}
        </AppProvider>
        </body>
        </html>
    );
}