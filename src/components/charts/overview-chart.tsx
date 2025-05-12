"use client";

import dynamic from "next/dynamic";
import { Post } from "@/types";
import { ApexOptions } from "apexcharts";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function OverviewChart({ posts }: { posts: Post[] }) {
  const postCounts = posts.reduce<Record<number, number>>((acc, post) => {
    acc[post.userId] = (acc[post.userId] || 0) + 1;
    return acc;
  }, {});

  const categories = Object.keys(postCounts).map((id) => `User ${id}`);
  const values = Object.values(postCounts);

  const options: ApexOptions = {
    chart: {
      type: "bar",
      toolbar: { show: false },
      background: "transparent",
      animations: {
        enabled: true,
        speed: 500,
        animateGradually: {
          enabled: true,
          delay: 100,
        },
      },
      
    },
    plotOptions: {
      bar: {
        borderRadius: 8,
        columnWidth: "50%",
        distributed: true,
      },
    },
    xaxis: {
      categories,
      labels: {
        style: {
          colors: "#6b7280", 
          fontSize: "13px",
          fontWeight: 500,
        },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        style: {
          colors: "#9ca3af",
          fontSize: "13px",
        },
      },
    },
    grid: {
      borderColor: "#e5e7eb",
      strokeDashArray: 4,
      padding: {
        left: 10,
        right: 10,
      },
    },
    colors: ["#6366f1", "#60a5fa", "#38bdf8", "#0ea5e9"], 
    tooltip: {
      theme: "light",
      y: {
        formatter: (val) => `${val} post${val !== 1 ? "s" : ""}`,
      },
    },
    dataLabels: {
      enabled: false,
    },
  };

  const series = [{ name: "Posts", data: values }];

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow p-6 border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Posts per User
      </h2>
      <Chart options={options} series={series} type="bar" height={350} />
    </div>
  );
}
