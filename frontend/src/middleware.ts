// middleware.ts
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";


export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  // const protectedPaths = ["/", "/data-cleaning-interface", "/data-ingestion-interface", "/analytics-portal", "/simulation-results-portal", "/simulate-scenario", "/mpc-dashboard"];
  // const protectedPaths = [];
  // const isPathProtected = protectedPaths?.some((path) => pathname == path);
  const res = NextResponse.next();
  // if (isPathProtected) {
  //   const token = await getToken({ req });
  //   if (!token) {
  //     const url = new URL(`/sign-in`, req.url);
  //     url.searchParams.set("callbackUrl", pathname);
  //     return NextResponse.redirect(url);
  //   }
  // }
  return res;
}
