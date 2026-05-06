"use client";

import { useEffect } from "react";
import { captureRefFromUrl } from "@/lib/affiliate/ref";

export default function AffiliateRefCapture() {
  useEffect(() => {
    captureRefFromUrl();
  }, []);

  return null;
}
