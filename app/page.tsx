// This file contains the main page of the application.

// The type definition for a shipment.
type Shipment = {
  id: number;
  origin: string;
  destination: string;
  status: string;
  estimated_delivery: string;
};

// The type definition for a trade lane.
type TradeLane = {
  id: number;
  name: string;
  average_duration_days: number;
  common_risks: string[];
};

/**
 * Fetches the shipments from the Fastify API.
 * @returns A promise that resolves to an array of shipments.
 */
const fetchShipments = async (): Promise<Shipment[]> => {
  const baseUrl = process.env.NEXT_PUBLIC_FASTIFY_BASE_URL ?? "http://localhost:3001";
  const res = await fetch(`${baseUrl}/api/shipments`, { cache: "no-store" });

  if (!res.ok) {
    throw new Error(`Fastify API failed: ${res.status}`);
  }

  return res.json();
};

/**
 * Fetches the trade lanes from the Express API.
 * @returns A promise that resolves to an array of trade lanes.
 */
const fetchTradeLanes = async (): Promise<TradeLane[]> => {
  const baseUrl = process.env.NEXT_PUBLIC_EXPRESS_BASE_URL ?? "http://localhost:4000";
  const res = await fetch(`${baseUrl}/api/trade-lanes`, { cache: "no-store" });

  if (!res.ok) {
    throw new Error(`Express API failed: ${res.status}`);
  }

  return res.json();
};

/**
 * The main page of the application.
 * @returns The JSX for the main page.
 */
const Home = async () => {
  // Fetch the shipments and trade lanes in parallel.
  const [shipments, tradeLanes] = await Promise.all([
    fetchShipments(),
    fetchTradeLanes()
  ]);

  return (
    <>
      <section className="card">
        <h2>Ongoing Shipments (Fastify)</h2>
        <ul>
          {/* Map over the shipments and display them in a list. */}
          {shipments.map((shipment) => (
            <li key={shipment.id}>
              <strong>
                {shipment.origin} to {shipment.destination}
              </strong>
              <p>Status: {shipment.status}</p>
              <small>
                Estimated Delivery:{" "}
                {new Date(shipment.estimated_delivery).toLocaleDateString()}
              </small>
            </li>
          ))}
        </ul>
      </section>

      <section className="card">
        <h2>Common Trade Lanes (Express)</h2>
        <ul>
          {/* Map over the trade lanes and display them in a list. */}
          {tradeLanes.map((lane) => (
            <li key={lane.id}>
              <strong>{lane.name}</strong>
              <p>Average Duration: {lane.average_duration_days} days</p>
              <div>
                <strong>Common Risks:</strong>
                {/* Map over the common risks and display them as tags. */}
                {lane.common_risks.map((risk) => (
                  <span className="tag" key={risk}>
                    {risk}
                  </span>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
};

export default Home;