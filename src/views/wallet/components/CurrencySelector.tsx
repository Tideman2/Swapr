"use client";

import {
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    type SelectChangeEvent,
} from "@mui/material";

import type { CurrencyCode } from "@/types/wallet";

interface CurrencySelectorProps {
    value: CurrencyCode;
    currencies: CurrencyCode[];
    onChange: (currency: CurrencyCode) => void;
}

export default function CurrencySelector({
    value,
    currencies,
    onChange,
}: CurrencySelectorProps) {
    const handleChange = (event: SelectChangeEvent) => {
        onChange(event.target.value as CurrencyCode);
    };

    return (
        <FormControl size="small">
            <InputLabel>Currency</InputLabel>

            <Select
                value={value}
                label="Currency"
                onChange={handleChange}
            >
                {currencies.map((currency) => (
                    <MenuItem key={currency} value={currency}>
                        {currency}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}