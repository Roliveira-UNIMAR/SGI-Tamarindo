"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const token = async () =>
    await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/sanctum/csrf-cookie`, {
      credentials: 'include'
    });

export default function Home() {
  const router = useRouter();

  useEffect(() => {
      router.push("/login");
  }, [router]);
}
