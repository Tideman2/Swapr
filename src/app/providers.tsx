'use client';

import { ThemeProvider, CssBaseline } from '@mui/material';
import { QueryProvider } from "@/app/react-query"
import { lightTheme } from './theme';

interface ClientProvidersProps {
    children: React.ReactNode;
}

export default function ClientProviders({ children }: ClientProvidersProps) {
    return (
        <QueryProvider>
            <ThemeProvider theme={lightTheme} >
                <CssBaseline />
                {children}
            </ThemeProvider>
        </QueryProvider>
    );
}