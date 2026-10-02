import { notFound } from "next/navigation";
import { isSeason } from "@/lib/season";

export default async function SeasonLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ season: string }>;
}) {
  const { season } = await params;
  if (!isSeason(season)) notFound();
  return children;
}
