import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
const secret = process.env.SECRET;
import { jwtVerify, type JWTPayload } from "jose";

export default async function middleware(req: NextRequest) {
  const jwt = req.cookies.get("authJWT")?.value;

  const url = req.url;

  if (url.includes("/user")) {
    if (jwt === undefined) {
      const url = req.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.rewrite(url);
    }

    try {
      await jwtVerify(jwt, new TextEncoder().encode(secret));

      return NextResponse.next();
    } catch (error) {
      const url = req.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.rewrite(url);
    }
  }

  return NextResponse.next();
}
