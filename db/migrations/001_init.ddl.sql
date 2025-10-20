CREATE TABLE IF NOT EXISTS shipments (
    id SERIAL PRIMARY KEY,
    origin TEXT NOT NULL,
    destination TEXT NOT NULL,
    status TEXT NOT NULL,
    estimated_delivery TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS trade_lanes (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    average_duration_days INTEGER,
    common_risks TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[]
);