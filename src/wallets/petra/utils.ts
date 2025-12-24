// Detect "CONSTANT_CASE" (all caps/nums + underscores, with at least 1 underscore)
const CONSTANT_CASE = /^[A-Z0-9]+(?:_[A-Z0-9]+)+$/;

export function humanize(str: string) {
    // If it's already human-readable (not CONSTANT_CASE), return as-is
    if (!CONSTANT_CASE.test(str)) return str;

    // Turn MAX_GAS_UNITS_BELOW_MIN_TRANSACTION_GAS_UNITS
    // -> "Max Gas Units Below Min Transaction Gas Units"
    return str
        .toLowerCase()
        .replace(/_/g, " ")
        .replace(/\b[a-z]/g, (c) => c.toUpperCase());
}
