type Insight = {
  id: number;
  title: string;
  summary: string;
  created_at: string;
};

type Playbook = {
  id: number;
  name: string;
  description: string;
  tags: string[];
};

async function fetchInsights(): Promise<Insight[]> {
  const baseUrl = process.env.NEXT_PUBLIC_FASTIFY_BASE_URL ?? "http://localhost:3001";
  const res = await fetch(`${baseUrl}/api/insights`, { cache: "no-store" });

  if (!res.ok) {
    throw new Error(`Fastify API failed: ${res.status}`);
  }

  return res.json();
}

async function fetchPlaybooks(): Promise<Playbook[]> {
  const baseUrl = process.env.NEXT_PUBLIC_EXPRESS_BASE_URL ?? "http://localhost:4000";
  const res = await fetch(`${baseUrl}/api/playbooks`, { cache: "no-store" });

  if (!res.ok) {
    throw new Error(`Express API failed: ${res.status}`);
  }

  return res.json();
}

export default async function Home() {
  const [insights, playbooks] = await Promise.all([fetchInsights(), fetchPlaybooks()]);

  return (
    <>
      <section className="card">
        <h2>Latest Market Insights (Fastify)</h2>
        <ul>
          {insights.map((insight) => (
            <li key={insight.id}>
              <strong>{insight.title}</strong>
              <p>{insight.summary}</p>
              <small>{new Date(insight.created_at).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      </section>

      <section className="card">
        <h2>Playbook Recommendations (Express)</h2>
        <ul>
          {playbooks.map((playbook) => (
            <li key={playbook.id}>
              <strong>{playbook.name}</strong>
              <p>{playbook.description}</p>
              <div>
                {playbook.tags.map((tag) => (
                  <span className="tag" key={tag}>
                    {tag}
                  </span>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
