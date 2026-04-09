"use client";

import { useEffect, useState } from "react";

export default function CountUp({ value }: { value: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let i = 0;
    const step = Math.max(1, Math.floor(value / 30));
    const interval = window.setInterval(() => {
      i += step;
      if (i >= value) {
        i = value;
        window.clearInterval(interval);
      }
      setCount(i);
    }, 20);

    return () => window.clearInterval(interval);
  }, [value]);

  return <span>{count}</span>;
}

