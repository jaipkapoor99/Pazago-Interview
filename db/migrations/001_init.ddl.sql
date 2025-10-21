-- This file contains the database schema for the project.

-- Create the shipments table.
CREATE TABLE IF NOT EXISTS shipments (
    id SERIAL PRIMARY KEY,
    origin TEXT NOT NULL,
    destination TEXT NOT NULL,
    status TEXT NOT NULL,
    estimated_delivery TIMESTAMPTZ
);

-- Create the trade_lanes table.
CREATE TABLE IF NOT EXISTS trade_lanes (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    average_duration_days INTEGER,
    common_risks TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[]
);
