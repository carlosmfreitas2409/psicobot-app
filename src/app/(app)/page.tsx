import { Dashboard } from "@/ui/dashboard";

export default async function DashboardPage({ searchParams }: PageProps<"/">) {
  const filters = (await searchParams) as Record<string, string | undefined>;

  return <Dashboard searchParams={filters} />;
}
