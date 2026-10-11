import { PageHeader } from "@/components/admin/PageHeader";
import { StoreAdminManager } from "@/components/platform/StoreAdminManager";
import { listStoreAdmins } from "@/lib/platform";

// SITE-04 (PH-08): kelola akun Store Admin.
export const instant = false;

export default async function SiteAdminUsersPage() {
  const users = await listStoreAdmins();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Store Admin"
        description="Buat, nonaktifkan, dan reset password akun Store Admin."
      />
      <StoreAdminManager
        initial={users.map((user) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          deactivatedAt: user.deactivatedAt?.toISOString() ?? null,
          createdAt: user.createdAt.toISOString(),
        }))}
      />
    </div>
  );
}
