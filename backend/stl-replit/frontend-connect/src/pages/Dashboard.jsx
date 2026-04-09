import { useEffect, useState } from "react";
import { getSTL } from "../services/api";

import STLCard from "../components/STLCard";
import AIExplanation from "../components/AIExplanation";
import UpgradeBox from "../components/UpgradeBox";
import Earnings from "../components/Earnings";
import Growth from "../components/Growth";
import TaskList from "../components/TaskList";
import VoiceInput from "../components/VoiceInput";
import EcosystemPanels from "../components/EcosystemPanels";

export default function Dashboard({ userId }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userId) return;
    getSTL(userId)
      .then((res) => setData(res.data))
      .catch((err) => setError(err?.response?.data?.msg ?? "Failed to load STL"));
  }, [userId]);

  if (error) return <h2 style={{ padding: 20 }}>{error}</h2>;
  if (!data) return <h2 style={{ padding: 20 }}>Loading...</h2>;

  return (
    <div style={{ padding: 20 }}>
      <h1>EHB STL Dashboard</h1>

      <STLCard score={data.stlScore} level={data.stlLevel} />
      <AIExplanation reasons={data.reasons} />
      <UpgradeBox score={data.stlScore} />
      <Earnings earnings={data.user?.earnings} />
      <Growth growth={data.user?.growth} />
      <EcosystemPanels data={data} />
      <TaskList userId={userId} />
      <VoiceInput userId={userId} />
    </div>
  );
}

