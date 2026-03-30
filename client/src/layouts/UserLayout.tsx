import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function UserLayout() {
  return (
    <>
      <Header />

      <main style={{ minHeight: "70vh" }}>
        <Outlet />
      </main>

      <Footer />
    </>
  );
}