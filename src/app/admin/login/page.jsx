import AdminLoginPage from "./AdminLoginPage";

export default function Page({ searchParams }) {
  const nextPath =
    searchParams?.next && searchParams.next.startsWith("/admin")
      ? searchParams.next
      : "/admin";

  return <AdminLoginPage nextPath={nextPath} />;
}