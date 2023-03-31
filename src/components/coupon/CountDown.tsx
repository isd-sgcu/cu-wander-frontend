import { useEffect, useState } from "react";

const OpeningTime = +new Date(2023, 3, 1, 9, 0, 0, 0);

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

const calculateTimeLeft: (time: number) => TimeLeft | null = (time) => {
  const difference = time - +new Date();

  if (difference > 0) {
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      total: difference,
    };
  } else {
    return null;
  }
};

export default function CountDown({ until = OpeningTime }: { until?: number }) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(
    calculateTimeLeft(until)
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(until));
    }, 1000);

    return function cleanup() {
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="relative z-50 flex flex-col items-center gap-8 py-3 font-display text-xl text-white md:items-start">
      <div className="flex gap-2 text-center text-xl sm:text-3xl">
        <div className="flex-col gap-2">
          <p className="rounded-xl rounded-bl-xl bg-gray-500 bg-opacity-25 px-6 py-6 text-white backdrop-blur-sm">
            {timeLeft?.days ?? 0}
          </p>
          <p className="mt-2 text-sm">
            {timeLeft?.days && timeLeft?.days > 1 ? "days" : "day"}
          </p>
        </div>
        <div className="flex-col gap-2">
          <p className="rounded-xl bg-gray-500 bg-opacity-25 px-4 py-6 text-white backdrop-blur-sm">
            {String(timeLeft?.hours ?? 0).padStart(2, "0)")}
          </p>
          <p className="mt-2 text-sm">hours</p>
        </div>
        <div className="flex-col gap-2">
          <p className="rounded-xl bg-gray-500 bg-opacity-25 px-4 py-6 text-white backdrop-blur-sm">
            {String(timeLeft?.minutes ?? 0).padStart(2, "0")}
          </p>
          <p className="mt-2 text-sm">minutes</p>
        </div>
        <div className="flex-col gap-2">
          <p className="rounded-xl rounded-br-xl bg-gray-500 bg-opacity-25 px-4 py-6 text-white backdrop-blur-sm">
            {String(timeLeft?.seconds ?? 0).padStart(2, "0")}
          </p>
          <p className="mt-2 text-sm">seconds</p>
        </div>
      </div>
    </div>
  );
}
