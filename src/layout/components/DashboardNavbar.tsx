'use client';
// import { ConnectWalletBtn } from "@/components/ConnectWalletBtn";

import {
    AppBar,
    Toolbar,
    Stack,
    Button
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';


import { useMediaQuery } from '../hooks/useMediaQuery'

type props = {
    setMobileOpen: (open: boolean) => void;
}

export default function DashboardNavbar({ setMobileOpen }: props) {
    const isMobile = useMediaQuery('upToSm');


    return (
        <AppBar
            position="sticky"
            elevation={0}
            sx={{
                bgcolor: 'background.paper',
                borderBottom: '1px solid',
                borderColor: 'divider',
            }}
        >
            <Toolbar
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: 2,
                }}
            >
                {isMobile && (
                    <Button
                        onClick={() => setMobileOpen(true)}
                    >
                        {<MenuIcon />}
                    </Button>
                )}

                {/* Right side */}
                <Stack direction="row"
                    spacing={2}
                    sx={{
                        ml: 'auto',
                        alignItems: 'center',
                    }}>
                    {/* <ConnectWalletBtn /> */}
                    <Button>Reload overview</Button>
                </Stack>
            </Toolbar>
        </AppBar>
    );
}