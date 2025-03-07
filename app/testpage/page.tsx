// app/admin/page.jsx
import RoleProtected from "@/components/ProtectedRoute";

export default function AdminPage() {
  return (
    <RoleProtected allowedRoles={["ADMIN"]}>
      <div>
        <h1>Admin Dashboard</h1>
        <p>This content is only visible to admins</p>
        {/* Admin-only content goes here */}
      </div>
    </RoleProtected>
  );
}