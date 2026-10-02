import { OnboardClientWrapper } from "@/components/onboard/onboard-client-wrapper";

export const metadata = {
  title: "Plan Your 2027 Journey — Savana Travel",
  description: "Start your 2027 travel enquiry in three simple steps.",
};

export default function Onboard2027Page() {
  return <OnboardClientWrapper season={2027} />;
}
