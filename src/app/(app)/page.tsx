import { Dashboard } from "@/ui/dashboard";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Record<string, string | undefined>;
}) {
  const filters = searchParams;

  return <Dashboard searchParams={filters} />;
}
