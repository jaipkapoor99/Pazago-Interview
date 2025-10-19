import { redirect } from "next/navigation";
import { getServerAuthSession } from "@/auth";

const IntelPage = async () => {
  const session = await getServerAuthSession();

  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/intel");
  }

  return (
    <section className="card">
      <h2>Classified Intel Unlocked</h2>
      <p>
        Agent {session.user?.name ?? "Operative"}, your authorization has been verified.
        Proceed with caution—these insights are for your eyes only.
      </p>
      <ul>
        <li>
          🔥 Market anomaly detected in APAC equities—monitor volatility clusters closely.
        </li>
        <li>
          🛰️ Satellite data indicates emerging supply chain risks in semiconductor fabs.
        </li>
        <li>
          📈 Strategic recommendation: allocate reconnaissance resources to high-yield
          private credit deals this quarter.
        </li>
      </ul>
    </section>
  );
};

export default IntelPage;
