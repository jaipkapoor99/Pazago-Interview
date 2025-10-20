type Shipment = {
  id: number;
  origin: string;
  destination: string;
  status: string;
  estimated_delivery: string;
};

type TradeLane = {
  id: number;
  name: string;
  average_duration_days: number;
  common_risks: string[];
};

const fetchShipments = async (): Promise<Shipment[]> => {
  const baseUrl = process.env.NEXT_PUBLIC_FASTIFY_BASE_URL ?? "http://localhost:3001";
  const res = await fetch(`${baseUrl}/api/shipments`, { cache: "no-store" });

  if (!res.ok) {
    throw new Error(`Fastify API failed: ${res.status}`);
  }

  return res.json();
};

const fetchTradeLanes = async (): Promise<TradeLane[]> => {
  const baseUrl = process.env.NEXT_PUBLIC_EXPRESS_BASE_URL ?? "http://localhost:4000";
  const res = await fetch(`${baseUrl}/api/trade-lanes`, { cache: "no-store" });

  if (!res.ok) {
    throw new Error(`Express API failed: ${res.status}`);
  }

  return res.json();
};

const Home = async () => {
  const [shipments, tradeLanes] = await Promise.all([
    fetchShipments(),
    fetchTradeLanes()
  ]);

  return (
    <>
      <section className="card">
        <h2>Ongoing Shipments (Fastify)</h2>
        <ul>
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
          {tradeLanes.map((lane) => (
            <li key={lane.id}>
              <strong>{lane.name}</strong>
              <p>Average Duration: {lane.average_duration_days} days</p>
              <div>
                <strong>Common Risks:</strong>
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
