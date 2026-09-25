import {
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    type SelectChangeEvent,
} from "@mui/material";

import {
    SUPPORTED_CURRENCIES,
    type CurrencyCode,
} from "@/types/wallet";

interface BaseCurrencySelectorProps {
    value: CurrencyCode;
    onChange: (currency: CurrencyCode) => void;
    isMobile: boolean;
}

export default function BaseCurrencySelector({
    value,
    onChange,
    isMobile,
}: BaseCurrencySelectorProps) {
    const handleChange = (event: SelectChangeEvent) => {
        onChange(event.target.value as CurrencyCode);
    };

    return (
        <FormControl
            size="small"
            sx={isMobile
                ? { width: "100%" }
                : { minWidth: 200 }}
        >
            <InputLabel>Base currency</InputLabel>

            <Select
                value={value}
                label="Base currency"
                onChange={handleChange}
            >
                {SUPPORTED_CURRENCIES.map((currency) => (
                    <MenuItem
                        key={currency}
                        value={currency}
                    >
                        {currency}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}