'use client';

import { ThemeProvider, CssBaseline } from '@mui/material';
import { lightTheme } from './theme';

interface ClientProvidersProps {
    children: React.ReactNode;
}

export default function ClientProviders({ children }: ClientProvidersProps) {
    return (
        <ThemeProvider theme={lightTheme} >
            <CssBaseline />
            {children}
        </ThemeProvider>
    );
}