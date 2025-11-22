import Layout from "@/components/layout/layout";
import { Outlet } from "react-router-dom";

export default function Admin() {
  return (
    <>
      <Layout>
        <Outlet />
      </Layout>
    </>
  );
}
