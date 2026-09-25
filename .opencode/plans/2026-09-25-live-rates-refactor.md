# LiveRates Refactor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Split the working `LiveRates` feature into a small, readable folder structure (`components/` + `helpers/`) with zero behavior change.

**Architecture:** The main component (`src/views/rates/index.tsx`) keeps all state, React Query fetching, elapsed-time ticking, movement tracking, and stale calculation, and renders small presentational child components. Two pure helper modules hold the rate-direction comparison and the elapsed-time formatting.

**Tech Stack:** React 19, Next.js 16 (Turbopack), TypeScript, MUI v9 (`@mui/material`, `@mui/icons-material`), TanStack React Query v5, `big.js`.

**Spec:** Inline task description, "Refactor the existing LiveRates feature into a simple, readable folder structure" (this conversation). Behavior must be preserved exactly.

## Global Constraints

- Scope is strictly the LiveRates feature under `src/views/rates/`. No other file outside this folder may be created or modified. If the need arises, STOP and explain before touching anything else.
- No new dependencies. No new styling library. No test-framework additions.
- Preserve existing behavior exactly: 5s polling, background pause, refetch on window focus, auto retry, last-successful-data retention, 15s stale threshold, movement comparison of consecutive successful snapshots only, base-switch reset.
- Keep the existing MUI components, theme, spacing, typography, colors, responsive behavior, and accessibility exactly as they are today.
- Keep code at a clear junior level: simple functions, plain `if/else`, explicit props, no generics, no `useMemo`/`useCallback`, no `any`, no nested-ternary gymnastics, no shared "component-system" abstractions.
- Code style (match the current views): 4-space indent, double quotes, no semicolons, `"use client"` only on files that use hooks.
- `RateDirection` is defined exactly once, in `helpers/get-rate-direction.ts`, and imported everywhere it is needed.
- Commits: each task ends with a small, conventional-style commit. (Per the writing-plans convention; every task in this plan includes its commit step.)

## File Map

Files to create (all inside `src/views/rates/`):

| File | Responsibility |
| --- | --- |
| `helpers/get-rate-direction.ts` | Owns the shared `RateDirection` type and the `big.js` comparison used to compute movement. |
| `helpers/format-last-updated.ts` | Formats a timestamp into readable elapsed time (`just now`, `5 seconds ago`). |
| `components/MovementIndicator.tsx` | Displays the up/down/unchanged icon for one currency with tooltip + aria-label. |
| `components/BaseCurrencySelector.tsx` | The MUI base-currency `Select`, controlled via props. |
| `components/RateRow.tsx` | One row: currency + value + `MovementIndicator`. |
| `components/RateStatus.tsx` | The responsive status bar: last-updated, Stale, Updating..., failed-refresh chips. |

File to rewrite (same folder, content replaced):

| File | Responsibility |
| --- | --- |
| `index.tsx` | All state, the React Query fetch, the 1s elapsed-time interval, movement tracking, stale calculation, and layout coordination. Renders children; contains no duplicated UI logic. |

Imports use the project's existing conventions: `@/...` alias for app/module paths, relative imports (`./components/...`, `../helpers/...`) within the feature. No barrel files.

---

### Task 1: Helper functions

Extract the two pure functions currently living inside `index.tsx` into dedicated helper modules.

**Files:**
- Create: `src/views/rates/helpers/get-rate-direction.ts`
- Create: `src/views/rates/helpers/format-last-updated.ts`

**Interfaces:**
- Consumes: `big.js`'s `Big` class (already a dependency).
- Produces:
  - `export type RateDirection = "up" | "down" | "unchanged"`
  - `export function getRateDirection(previous: string, current: string): RateDirection`
  - `export function formatLastUpdated(timestamp: string, now: number): string`

- [ ] **Step 1: Create `src/views/rates/helpers/get-rate-direction.ts`**

```ts
import Big from "big.js";

export type RateDirection = "up" | "down" | "unchanged";

export function getRateDirection(
    previous: string,
    current: string,
): RateDirection {
    const previousRate = new Big(previous);
    const currentRate = new Big(current);

    if (currentRate.gt(previousRate)) {
        return "up";
    }

    if (currentRate.lt(previousRate)) {
        return "down";
    }

    return "unchanged";
}
```

- [ ] **Step 2: Create `src/views/rates/helpers/format-last-updated.ts`**

```ts
export function formatLastUpdated(
    timestamp: string,
    now: number,
): string {
    const elapsed = Math.max(
        0,
        Math.floor((now - new Date(timestamp).getTime()) / 1000),
    );

    if (elapsed < 1) {
        return "just now";
    }

    return `${elapsed} second${elapsed === 1 ? "" : "s"} ago`;
}
```

- [ ] **Step 3: Type-check the new helpers**

Run (from the repo root, Node 22): `export PATH="$HOME/.nvm/versions/node/v22.21.1/bin:$PATH" && node_modules/.bin/tsc --noEmit`

Expected: exit 0, no errors. (Baseline already passes — this confirms the new files introduce no type errors.)

- [ ] **Step 4: Commit**

```bash
git add src/views/rates/helpers/
git commit -m "refactor(rates): extract helper functions"
```

---

### Task 2: `MovementIndicator` and `BaseCurrencySelector`

Move the movement icon UI and the base-currency selection UI out of `index.tsx` into their own presentational components. These are pure props-in/JSX-out components with no hooks, so they do NOT get a `"use client"` directive (the parent is a client component).

**Files:**
- Create: `src/views/rates/components/MovementIndicator.tsx`
- Create: `src/views/rates/components/BaseCurrencySelector.tsx`

**Interfaces:**
- Consumes: `CurrencyCode` from `@/types/wallet`; `RateDirection` from `../helpers/get-rate-direction`.
- Produces:
  - `export default function MovementIndicator(props: { currency: CurrencyCode; direction: RateDirection })`
  - `export default function BaseCurrencySelector(props: { value: CurrencyCode; onChange: (currency: CurrencyCode) => void; isMobile: boolean })`

- [ ] **Step 1: Create `src/views/rates/components/MovementIndicator.tsx`**

Uses plain `if/else` instead of nested ternaries. The `<Tooltip>` needs its direct child to accept a ref, so keep the `<Box component="span">` wrapper exactly as in the current code.

```tsx
import ArrowDownwardRoundedIcon from "@mui/icons-material/ArrowDownwardRounded";
import ArrowUpwardRoundedIcon from "@mui/icons-material/ArrowUpwardRounded";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import { Box, Tooltip } from "@mui/material";
import type { ReactNode } from "react";

import type { CurrencyCode } from "@/types/wallet";
import type { RateDirection } from "../helpers/get-rate-direction";

interface MovementIndicatorProps {
    currency: CurrencyCode;
    direction: RateDirection;
}

export default function MovementIndicator({
    currency,
    direction,
}: MovementIndicatorProps) {
    let label = `${currency} rate unchanged`;

    if (direction === "up") {
        label = `${currency} rate increased`;
    } else if (direction === "down") {
        label = `${currency} rate decreased`;
    }

    let icon: ReactNode;

    if (direction === "up") {
        icon = (
            <ArrowUpwardRoundedIcon
                fontSize="small"
                color="success"
            />
        );
    } else if (direction === "down") {
        icon = (
            <ArrowDownwardRoundedIcon
                fontSize="small"
                color="error"
            />
        );
    } else {
        icon = (
            <RemoveRoundedIcon
                fontSize="small"
                color="disabled"
            />
        );
    }

    return (
        <Tooltip title={label}>
            <Box
                component="span"
                aria-label={label}
                sx={{
                    display: "inline-flex",
                    alignItems: "center",
                }}
            >
                {icon}
            </Box>
        </Tooltip>
    );
}
```

- [ ] **Step 2: Create `src/views/rates/components/BaseCurrencySelector.tsx`**

Mirrors the existing `CurrencySelector` MUI pattern (`FormControl`/`InputLabel`/`Select`/`MenuItem`) and keeps the existing responsive width behavior.

```tsx
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
```

- [ ] **Step 3: Type-check**

Run: `export PATH="$HOME/.nvm/versions/node/v22.21.1/bin:$PATH" && node_modules/.bin/tsc --noEmit`

Expected: exit 0.

- [ ] **Step 4: Commit**

```bash
git add src/views/rates/components/MovementIndicator.tsx src/views/rates/components/BaseCurrencySelector.tsx
git commit -m "refactor(rates): extract movement indicator and base selector components"
```

---

### Task 3: `RateRow` and `RateStatus`

Extract the remaining two chunks of JSX: one rate row and the responsive status bar.

**Files:**
- Create: `src/views/rates/components/RateRow.tsx`
- Create: `src/views/rates/components/RateStatus.tsx`

**Interfaces:**
- Consumes: `RateDirection` from `../helpers/get-rate-direction`; `formatLastUpdated` from `../helpers/format-last-updated`.
- Produces:
  - `export default function RateRow(props: { currency: CurrencyCode; value: string; direction: RateDirection })`
  - `export default function RateStatus(props: { timestamp: string; now: number; isStale: boolean; isFetching: boolean; isError: boolean; isMobile: boolean })`

- [ ] **Step 1: Create `src/views/rates/components/RateRow.tsx`**

`isMobile` handling remains in the parent; `RateRow` statically uses flexbox. This is a props-in/JSX-out component (no hooks, no `"use client"`).

```tsx
import { Box, Typography } from "@mui/material";

import type { CurrencyCode } from "@/types/wallet";
import type { RateDirection } from "../helpers/get-rate-direction";

import MovementIndicator from "./MovementIndicator";

interface RateRowProps {
    currency: CurrencyCode;
    value: string;
    direction: RateDirection;
}

export default function RateRow({
    currency,
    value,
    direction,
}: RateRowProps) {
    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
            }}
        >
            <Typography variant="body2">
                {currency}
            </Typography>

            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                }}
            >
                <Typography variant="body2">
                    {value}
                </Typography>

                <MovementIndicator
                    currency={currency}
                    direction={direction}
                />
            </Box>
        </Box>
    );
}
```

- [ ] **Step 2: Create `src/views/rates/components/RateStatus.tsx`**

Move the responsive status `Stack` verbatim (the `mt`, `mb`, and responsive `alignItems`/`direction` come from the current implementation; `isMobile` is passed in as a prop so the child owns no logic). Keep the exact `{" "}` spacing in the last-updated text.

```tsx
import { Chip, Stack, Typography } from "@mui/material";

import { formatLastUpdated } from "../helpers/format-last-updated";

interface RateStatusProps {
    timestamp: string;
    now: number;
    isStale: boolean;
    isFetching: boolean;
    isError: boolean;
    isMobile: boolean;
}

export default function RateStatus({
    timestamp,
    now,
    isStale,
    isFetching,
    isError,
    isMobile,
}: RateStatusProps) {
    return (
        <Stack
            direction={isMobile ? "column" : "row"}
            spacing={1}
            sx={{
                mt: 2,
                mb: 2,
                alignItems: isMobile
                    ? "flex-start"
                    : "center",
            }}
        >
            <Typography
                variant="body2"
                color="text.secondary"
            >
                Last updated{" "}
                {formatLastUpdated(timestamp, now)}
            </Typography>

            {isStale && (
                <Chip
                    label="Stale"
                    size="small"
                    color="warning"
                />
            )}

            {isFetching && !isError && (
                <Chip
                    label="Updating..."
                    size="small"
                    variant="outlined"
                    color="info"
                />
            )}

            {isError && (
                <Chip
                    label="Update failed, retrying…"
                    size="small"
                    variant="outlined"
                    color="error"
                />
            )}
        </Stack>
    );
}
```

- [ ] **Step 3: Type-check**

Run: `export PATH="$HOME/.nvm/versions/node/v22.21.1/bin:$PATH" && node_modules/.bin/tsc --noEmit`

Expected: exit 0.

- [ ] **Step 4: Commit**

```bash
git add src/views/rates/components/RateRow.tsx src/views/rates/components/RateStatus.tsx
git commit -m "refactor(rates): extract rate row and status components"
```

---

### Task 4: Rewrite `index.tsx` as the coordinator

Replace the current monolithic `index.tsx` with the coordinator version that imports the components and helpers. All behavior stays identical; only the code that was moved out is removed.

**Files:**
- Modify: `src/views/rates/index.tsx` (replace file contents)

**Interfaces:**
- Consumes: everything produced by Tasks 1-3 (`getRateDirection`, `RateDirection`, `formatLastUpdated`, `BaseCurrencySelector`, `RateRow`, `RateStatus`).
- Produces: `export default function LiveRates()` — the page renders it via `@/views/rates` (unchanged import path, so `/live_rates` page keeps working).

- [ ] **Step 1: Replace the contents of `src/views/rates/index.tsx`**

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Stack,
    Typography,
} from "@mui/material";

import { useMediaQuery } from "@/layout/hooks/useMediaQuery";
import type { RatesResponse } from "@/types/rate";
import type { CurrencyCode } from "@/types/wallet";

import BaseCurrencySelector from "./components/BaseCurrencySelector";
import RateRow from "./components/RateRow";
import RateStatus from "./components/RateStatus";
import {
    getRateDirection,
    type RateDirection,
} from "./helpers/get-rate-direction";

const RATES_STALE_THRESHOLD_MS = 15_000;

export default function LiveRates() {
    const [base, setBase] = useState<CurrencyCode>("USD");
    const [now, setNow] = useState(() => Date.now());

    const isMobile = useMediaQuery("upToSm");

    const {
        data,
        isLoading,
        isFetching,
        isError,
        refetch,
    } = useQuery<RatesResponse>({
        queryKey: ["live_rates", base],

        queryFn: async () => {
            const response = await fetch(
                `/api/rates?base=${base}`,
            );

            if (!response.ok) {
                throw new Error("Failed to fetch rates");
            }

            return response.json();
        },

        refetchInterval: 5000,
        refetchIntervalInBackground: false,
        refetchOnWindowFocus: true,
        retry: true,
    });

    useEffect(() => {
        const timer = setInterval(
            () => setNow(Date.now()),
            1000,
        );

        return () => clearInterval(timer);
    }, []);

    const lastSnapshotRef = useRef<{
        base: CurrencyCode;
        rates: Partial<Record<CurrencyCode, string>>;
    } | null>(null);

    const [directions, setDirections] = useState<
        Partial<Record<CurrencyCode, RateDirection>>
    >({});

    useEffect(() => {
        if (!data) {
            return;
        }

        if (lastSnapshotRef.current?.base === data.base) {
            const next: Partial<
                Record<CurrencyCode, RateDirection>
            > = {};

            for (
                const currency
                of Object.keys(data.rates) as CurrencyCode[]
            ) {
                const previousRate =
                    lastSnapshotRef.current.rates[currency];
                const currentRate = data.rates[currency];

                if (previousRate && currentRate) {
                    next[currency] = getRateDirection(
                        previousRate,
                        currentRate,
                    );
                }
            }

            setDirections(next);
        } else {
            setDirections({});
        }

        lastSnapshotRef.current = {
            base: data.base,
            rates: data.rates,
        };
    }, [data]);

    const isStale = data
        ? now - new Date(data.timestamp).getTime() >=
          RATES_STALE_THRESHOLD_MS
        : false;

    const handleBaseChange = (currency: CurrencyCode) => {
        setBase(currency);
    };

    return (
        <Box>
            <Typography
                variant="h1"
                gutterBottom
            >
                Live rates
            </Typography>

            <BaseCurrencySelector
                value={base}
                onChange={handleBaseChange}
                isMobile={isMobile}
            />

            {isLoading && !data && (
                <Box
                    sx={{
                        mt: 3,
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                    }}
                >
                    <CircularProgress size={18} />

                    <Typography variant="body2">
                        Loading rates...
                    </Typography>
                </Box>
            )}

            {isError && !data && (
                <Alert
                    severity="error"
                    action={
                        <Button
                            color="inherit"
                            size="small"
                            onClick={() => refetch()}
                        >
                            Retry
                        </Button>
                    }
                >
                    Unable to load rates.
                </Alert>
            )}

            {data && (
                <>
                    <RateStatus
                        timestamp={data.timestamp}
                        now={now}
                        isStale={isStale}
                        isFetching={isFetching}
                        isError={isError}
                        isMobile={isMobile}
                    />

                    <Stack spacing={1}>
                        {(
                            Object.keys(data.rates) as CurrencyCode[]
                        ).map((currency) => {
                            const value = data.rates[currency];

                            if (!value) {
                                return null;
                            }

                            return (
                                <RateRow
                                    key={currency}
                                    currency={currency}
                                    value={value}
                                    direction={
                                        directions[currency] ??
                                        "unchanged"
                                    }
                                />
                            );
                        })}
                    </Stack>
                </>
            )}
        </Box>
    );
}
```

- [ ] **Step 2: Type-check**

Run: `export PATH="$HOME/.nvm/versions/node/v22.21.1/bin:$PATH" && node_modules/.bin/tsc --noEmit`

Expected: exit 0.

- [ ] **Step 3: Run lint**

Run: `export PATH="$HOME/.nvm/versions/node/v22.21.1/bin:$PATH" && pnpm lint`

Expected: no errors or warnings pointing at `src/views/rates/`. (There is a known pre-existing error in `src/layout/hooks/useMediaQuery.tsx` and unused-import warnings in `src/server/` — these are NOT caused by this refactor and must be left alone.)

- [ ] **Step 4: Run the production build**

Run: `export PATH="$HOME/.nvm/versions/node/v22.21.1/bin:$PATH" && pnpm build`

Expected: compiles successfully; `/live_rates` route still generates.

- [ ] **Step 5: Review the final diff**

Run: `git status` then `git diff HEAD --stat`

Expected: only additions inside `src/views/rates/` plus the rewrite of `src/views/rates/index.tsx`. Nothing outside `src/views/rates/` may appear in this refactor's diff. Also open the diff and confirm the extracted JSX is byte-for-byte equivalent (same MUI props, same text, same icons, same aria-labels, same responsive sx values).

- [ ] **Step 6: Commit**

```bash
git add src/views/rates/
git commit -m "refactor(rates): coordinate feature from index component"
```

---

## Post-Implementation Report (required output)

After all tasks, report back:

- Files created (6) and the one file rewritten.
- One sentence per component explaining its responsibility.
- One sentence per helper explaining its responsibility.
- Confirmation that behavior was preserved (5s polling, background pause, focus refetch, retry, last-successful-data retention, 15s stale, movement of consecutive snapshots only, base-switch reset, 1s elapsed tick with unmount cleanup).
- Validation commands run and their results: `tsc --noEmit` (exit 0), `pnpm lint` (no issues in `src/views/rates/`), `pnpm build` (success, `/live_rates` present).