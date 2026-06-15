//import Navbar from "./navbar/navbar";
import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";

const Navbar = dynamic(() => import("./global/navbar"), { ssr: false });

export default function Layout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  return (
    <>
      {session && <Navbar />}
      <main>{children}</main>
    </>
  );
}
