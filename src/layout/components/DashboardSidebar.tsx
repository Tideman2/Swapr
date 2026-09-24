'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import {
    Drawer, List, IconButton, Box
} from '@mui/material';

import { NAVIGATION_ITEMS } from "@/constants/navigation";

import { useMediaQuery } from '@/layout/hooks/useMediaQuery';

import SideBarItem from "./SidebarItem";

type props = {
    mobileOpenProp: boolean;
    setMobileOpenProp: (open: boolean) => void;
}

const SIDEBAR_WIDTH = 270;
const SIDEBAR_COLLAPSED_WIDTH = 72;

export default function DashboardSidebar({ mobileOpenProp, setMobileOpenProp }: props) {
    const isMobile = useMediaQuery('upToSm');
    const [collapsed, setCollapsed] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        if (isMobile) {
            setMobileOpenProp(false);
        }
    }, [pathname, isMobile, setMobileOpenProp]);

    if (isMobile) {
        //mobile sidebar
        return (
            <>
                <Drawer
                    open={mobileOpenProp}
                    onClose={() => setMobileOpenProp(false)}
                    variant="temporary"
                    anchor="left"
                    transitionDuration={400}
                    ModalProps={{
                        keepMounted: true,
                    }}
                    slotProps={{
                        backdrop: {
                            sx: {
                                backdropFilter: 'blur(6px)',
                            },
                        },
                    }}
                    sx={{
                        '& .MuiDrawer-paper': {
                            width: 270,
                            boxSizing: 'border-box',
                            backdropFilter: 'blur(12px)',
                            borderRight: '1px solid',
                            borderColor: 'divider',
                        },
                    }}
                >
                    <List sx={{ p: 2 }}>
                        {NAVIGATION_ITEMS.map((item) => {

                            return (
                                <SideBarItem
                                    key={item.id}
                                    label={item.label}
                                    href={item.href!}
                                    icon={item.icon}
                                />
                            );
                        })}
                    </List>
                </Drawer>
            </>
        )
    }

    //desktop sidebar
    return (
        <Drawer
            variant="permanent"
            anchor="left"
            sx={{
                width: collapsed
                    ? SIDEBAR_COLLAPSED_WIDTH
                    : SIDEBAR_WIDTH,

                flexShrink: 0,

                '& .MuiDrawer-paper': {
                    width: collapsed
                        ? SIDEBAR_COLLAPSED_WIDTH
                        : SIDEBAR_WIDTH,

                    overflowX: 'hidden',

                    transition: (theme) =>
                        theme.transitions.create('width', {
                            easing: theme.transitions.easing.sharp,
                            duration: theme.transitions.duration.standard,
                        }),

                    boxSizing: 'border-box',
                    borderRight: '1px solid',
                    borderColor: 'divider',
                },
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: collapsed ? 'center' : 'flex-end',
                    p: 1,
                }}
            >
                <IconButton
                    onClick={() => setCollapsed((prev) => !prev)}
                >
                    {collapsed
                        ? <ChevronRightRoundedIcon />
                        : <ChevronLeftRoundedIcon />}
                </IconButton>
            </Box>
            <List sx={{ px: 1 }}>
                {NAVIGATION_ITEMS.map((item) => {
                    return (
                        <SideBarItem
                            key={item.id}
                            label={item.label}
                            href={item.href!}
                            icon={item.icon}
                            collapsed={collapsed}
                        />
                    );
                })}
            </List>
        </Drawer>
    )
}