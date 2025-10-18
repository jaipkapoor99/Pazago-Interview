TRUNCATE TABLE insights RESTART IDENTITY CASCADE;
TRUNCATE TABLE playbooks RESTART IDENTITY CASCADE;

INSERT INTO insights (title, summary)
VALUES
  ('Q3 Earnings Momentum', 'Tech equities outperformed with 8% QoQ growth driven by AI demand.'),
  ('Supply Chain Pressure', 'Shipping costs rose 12% WoW across APAC lanes, suggesting short-term margin pressure.'),
  ('FX Watchlist', 'INR volatility remains elevated; exporters are shifting to rolling hedges.');

INSERT INTO playbooks (name, description, tags)
VALUES
  ('Hedge Volatile Currencies', 'Recommended actions to maintain profit margins amid fluctuating FX rates.', ARRAY['forex', 'risk']),
  ('Qualify New Buyers', 'Checklist to validate trade partners before onboarding into the pipeline.', ARRAY['due-diligence', 'crm']),
  ('Optimize Logistics Spend', 'Steps to negotiate freight rates and leverage platform analytics for savings.', ARRAY['logistics', 'cost']);
