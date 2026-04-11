import Card from "@/components/ui/card";

export default function AdvancedData() {
  return (
    <details>
      <summary className="cursor-pointer list-none">
        <Card size="medium" className="flex items-center justify-between">
          <span className="text-sm text-gray-300">Advanced Data</span>
          <span className="text-xs text-gray-500">Tables • Logs • Rules</span>
        </Card>
      </summary>
      <Card size="large" className="mt-2">
        <div className="space-y-2 text-sm text-gray-300">
          <p>Tables: STL scoring matrices and verification rows</p>
          <p>Logs: recent trust updates and workflow events</p>
          <p>Rules: automation and AI decision constraints</p>
        </div>
      </Card>
    </details>
  );
}

