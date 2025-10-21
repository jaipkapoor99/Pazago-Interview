-- This file contains the seed data for the database.

-- Truncate the tables to reset the data.
TRUNCATE TABLE shipments RESTART IDENTITY CASCADE;
TRUNCATE TABLE trade_lanes RESTART IDENTITY CASCADE;

-- Insert data into the shipments table.
INSERT INTO shipments (origin, destination, status, estimated_delivery)
VALUES
  ('Shanghai, China', 'Los Angeles, USA', 'In Transit', NOW() + INTERVAL '10 days'),
  ('Rotterdam, Netherlands', 'New York, USA', 'Customs Clearance', NOW() + INTERVAL '2 days'),
  ('Singapore', 'Dubai, UAE', 'Delivered', NOW() - INTERVAL '3 days');

-- Insert data into the trade_lanes table.
INSERT INTO trade_lanes (name, average_duration_days, common_risks)
VALUES
  ('Asia to North America West Coast', 25, ARRAY['Port Congestion', 'Typhoon Season']),
  ('Europe to North America East Coast', 18, ARRAY['Winter Storms', 'Customs Delays']),
  ('Intra-Asia', 10, ARRAY['Monsoon Season', 'Geopolitical Tensions']);
