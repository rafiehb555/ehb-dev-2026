import InviteCard from "@/components/growth/InviteCard";
import LeaderboardCard from "@/components/growth/LeaderboardCard";
import ProgressTrackerCard from "@/components/growth/ProgressTrackerCard";
import ReferralEarningsCard from "@/components/growth/ReferralEarningsCard";
import RewardsCard from "@/components/growth/RewardsCard";

export default function GrowthSection() {
  return (
    <section className="space-y-4">
      <InviteCard />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ReferralEarningsCard />
        <ProgressTrackerCard />
      </div>
      <RewardsCard />
      <LeaderboardCard />
    </section>
  );
}

