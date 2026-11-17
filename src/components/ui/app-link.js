"use client";

import Link from "next/link";
import { staticRoute } from "@/lib/paths";

export default function AppLink({ href, ...props }) {
  return <Link href={staticRoute(href)} {...props} />;
}
