"use client";

import { useEffect } from "react";
import { captureRefFromUrl } from "@/lib/affiliate/ref";

export default function RefCapture() {
  useEffect(() => {
    captureRefFromUrl();
  }, []);

  return null;
}
