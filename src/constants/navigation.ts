import type { SvgIconComponent } from '@mui/icons-material';

import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import CodeRoundedIcon from '@mui/icons-material/CodeRounded';
import SmartToyRoundedIcon from '@mui/icons-material/SmartToyRounded';
import EmojiEventsRoundedIcon from '@mui/icons-material/EmojiEventsRounded';

import { PATHS } from '@/routes/paths';

export interface NavigationItem {
    id: string;
    label: string;
    href?: string;
    icon: SvgIconComponent;
    children?: NavigationItem[];
}

export const NAVIGATION_ITEMS: NavigationItem[] = [
    {
        id: 'overview',
        label: 'Wallet overview',
        href: PATHS.dashboard.wallet_overview,
        icon: HomeRoundedIcon,
    },
    {
        id: 'live_rates',
        label: 'Live rates',
        href: PATHS.dashboard.live_rates,
        icon: CodeRoundedIcon,
    },
    {
        id: 'convert_quote',
        label: 'Convert currencies',
        href: PATHS.dashboard.convert_with_quotes,
        icon: SmartToyRoundedIcon,
    },
    {
        id: 'transactions',
        label: 'Transaction hostory',
        href: PATHS.dashboard.transaction_history,
        icon: EmojiEventsRoundedIcon,
    }
];