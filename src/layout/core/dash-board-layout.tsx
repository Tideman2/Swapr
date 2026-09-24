'use client';

import { ReactNode, useState } from 'react';
import { Box } from '@mui/material';

import DashboardSidebar from "../components/DashboardSidebar";
import DashboardNavbar from "../components/DashboardNavbar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <Box sx={{ display: 'flex' }}>
            {/* Sidebar */}
            <DashboardSidebar mobileOpenProp={mobileOpen} setMobileOpenProp={setMobileOpen} />

            {/* Main Area */}
            <Box sx={{ flex: 1, display: 'flex', minWidth: 0, flexDirection: 'column' }}>
                {/* Navbar */}
                <DashboardNavbar setMobileOpen={setMobileOpen} />

                {/* Page Content */}
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            </Box>
        </Box>
    );
}