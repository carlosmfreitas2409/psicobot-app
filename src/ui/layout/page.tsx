export function Page({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 flex-col">
      <div className="w-full px-4 py-4 lg:gap-2 lg:px-6 flex flex-1 flex-col gap-2">
        {children}
      </div>
    </div>
  );
}
