import { CancellationReasonManager } from "@/components/admin/CancellationReasonManager";
import { PageHeader } from "@/components/admin/PageHeader";
import { listCancellationReasons } from "@/lib/config";

// CONFIG-01 (PH-06): template alasan penolakan pembatalan (PRD 5.5).
export const instant = false;

export default async function AdminCancellationReasonsPage() {
  const reasons = await listCancellationReasons();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Template Alasan"
        description="Alasan penolakan pembatalan yang bisa dipilih Store Admin."
      />
      <CancellationReasonManager
        reasons={reasons.map((reason) => ({
          id: reason.id,
          text: reason.text,
          isActive: reason.isActive,
          sortOrder: reason.sortOrder,
        }))}
      />
    </div>
  );
}
