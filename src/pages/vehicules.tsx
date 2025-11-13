import { FieldDemo } from "@/components/vehiculeSearch";

export default function Vehicules() {
  return (
    <div className="p-0">
      <h1 className="text-2xl font-bold">Vehicules</h1>
      <p className="mt-2 text-muted-foreground">
        This is your dashboard home page. You can put any content here — cards,
        stats, charts, or shortcuts.
      </p>
      <FieldDemo />
    </div>
  );
}
