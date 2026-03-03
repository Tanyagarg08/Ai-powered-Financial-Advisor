import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import type { Transaction } from "../App";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
);

type Props = {
  transactions: Transaction[];
};

const Charts: React.FC<Props> = ({ transactions }) => {
  if (!transactions.length) {
    return (
      <div className="card">
        <h3>Cash‑flow chart</h3>
        <p className="muted">
          Add some income and expense transactions to see a simple cash‑flow
          chart over time.
        </p>
      </div>
    );
  }

  const sorted = [...transactions].sort((a, b) => a.date.localeCompare(b.date));
  const labels = sorted.map((t) => t.date);
  const cumulative = sorted.reduce<number[]>((acc, t, index) => {
    const prev = index === 0 ? 0 : acc[index - 1];
    acc.push(prev + t.amount);
    return acc;
  }, []);

  const data = {
    labels,
    datasets: [
      {
        label: "Cumulative balance (₹)",
        data: cumulative,
        borderColor: "#0f766e",
        backgroundColor: "rgba(34, 197, 94, 0.15)",
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        ticks: {
          callback: (value: string | number) =>
            `₹${Number(value).toLocaleString(undefined, {
              maximumFractionDigits: 0,
            })}`,
        },
      },
    },
  } as const;

  return (
    <div className="card">
      <h3>Cash‑flow over time</h3>
      <Line data={data} options={options} />
    </div>
  );
};

export default Charts;

