import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="relative min-h-screen text-text-primary">
      <main>
        <Outlet />
      </main>
    </div>
  );
}
