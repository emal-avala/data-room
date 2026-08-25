import { AXIS, COMPETITORS } from "@/data/competition";

const MARK: Record<"yes" | "partial" | "no", string> = {
  yes: "Yes",
  partial: "Partial",
  no: "—",
};

export function CompetitiveMatrix() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[40rem] text-sm">
        <thead>
          <tr>
            <th className="text-left"> </th>
            {AXIS.map((axis) => (
              <th key={axis.key}>{axis.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {COMPETITORS.map((row) => (
            <tr key={row.name}>
              <td>
                <div className="font-semibold">{row.name}</div>
                <div className="text-xs text-muted-foreground">{row.thesis}</div>
              </td>
              {AXIS.map((axis) => (
                <td key={axis.key}>{MARK[row[axis.key]]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
