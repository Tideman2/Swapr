export const MEDIA_QUERY_BREAKPOINTS = {
    xs: "(max-width: 639px)", // Mobile small
    sm: "(min-width: 640px)", // Mobile large
    md: "(min-width: 768px)", // Tablet
    lg: "(min-width: 1024px)", // Desktop
    xl: "(min-width: 1280px)", // Desktop large
    "2xl": "(min-width: 1536px)", // Desktop extra large

    // Range queries
    smOnly: "(min-width: 640px) and (max-width: 767px)",
    mdOnly: "(min-width: 768px) and (max-width: 1023px)",
    lgOnly: "(min-width: 1024px) and (max-width: 1279px)",
    xlOnly: "(min-width: 1280px) and (max-width: 1535px)",

    // Mobile-first (up to)
    upToSm: "(max-width: 639px)",
    upToMd: "(max-width: 767px)",
    upToLg: "(max-width: 1023px)",
    upToXl: "(max-width: 1279px)",

    // Desktop-first (from)
    fromMd: "(min-width: 768px)",
    fromLg: "(min-width: 1024px)",
    fromXl: "(min-width: 1280px)",
    from2xl: "(min-width: 1536px)",
} as const;