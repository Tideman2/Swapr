'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import type { SvgIconComponent } from '@mui/icons-material';

import {
    ListItemButton,
    ListItemText,
    ListItemIcon,
    Tooltip,
} from '@mui/material';

type SideBarItemProps = {
    label: string;
    href: string;
    icon?: SvgIconComponent;
    collapsed?: boolean;
};

export default function SideBarItem({
    label,
    href,
    icon: Icon,
    collapsed = false,
}: SideBarItemProps) {
    const pathname = usePathname();

    const isActive =
        pathname === href ||
        (href !== '/' && pathname.startsWith(href + '/'));

    return (
        <Tooltip
            title={collapsed ? label : ''}
            placement="right"
        >
            <ListItemButton
                component={Link}
                href={href}
                selected={isActive}
                sx={{
                    borderRadius: 2,
                    mb: 0.5,
                    minHeight: 48,
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    px: 2,

                    '&.Mui-selected': {
                        bgcolor: 'primary.main',
                        color: 'common.white', // or common.black

                        '& .MuiListItemIcon-root': {
                            color: 'common.white', // or common.black
                        },

                        '& .MuiSvgIcon-root': {
                            color: 'common.white', // <- overrides the theme
                        },
                    },
                }}
            >
                {Icon && (
                    <ListItemIcon
                        sx={{
                            minWidth: 0,
                            mr: collapsed ? 0 : 2,
                            justifyContent: 'center',
                            color: 'text.secondary',
                        }}
                    >
                        <Icon />
                    </ListItemIcon>
                )}

                <ListItemText
                    primary={label}
                    sx={{
                        opacity: collapsed ? 0 : 1,
                        width: collapsed ? 0 : 'auto',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        transition: 'opacity .2s ease',
                    }}
                />
            </ListItemButton>
        </Tooltip>
    );
}