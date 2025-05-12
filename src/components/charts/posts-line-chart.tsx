"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Post } from "@/types";
import { ApexOptions } from "apexcharts";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

// Simulated post creation dates (using index for mock date distribution)
function generatePostDates(posts: Post[]) {
  return posts.map((post, index) => ({
    date: `2024-05-${String((index % 30) + 1).padStart(2, "0")}`,
    count: 1,
  }));
}

export default function PostsLineChart({ posts }: { posts: Post[] }) {
  const [chartData, setChartData] = useState<{
    options: ApexOptions;
    series: { name: string; data: { x: string; y: number }[] }[];
  }>({
    options: {
      chart: {
        type: "line",
        toolbar: { show: false },
        zoom: { enabled: false },
        background: "transparent",
      },
      stroke: {
        curve: "smooth",
        width: 3,
      },
      xaxis: {
        type: "category",
        title: {
          text: "Date",
          style: {
            fontSize: "14px",
            fontWeight: 600,
            color: "#4b1563", // Tailwind slate-600
          },
        },
        labels: {
          rotate: -45,
          style: {
            fontSize: "12px",
            colors: "#6b7280", // Tailwind gray-500
          },
        },
      },
      yaxis: {
        title: {
          text: "Posts",
          style: {
            fontSize: "14px",
            fontWeight: 600,
            color: "#4b5563",
          },
        },
        labels: {
          style: {
            fontSize: "12px",
            colors: "#6b7280",
          },
        },
        min: 0,
      },
      colors: ["#3b82f6"],
      tooltip: {
        theme: "light",
        x: {
          format: "yyyy-MM-dd",
        },
        y: {
          formatter: (val) => `${val} posts`,
        },
      },
      grid: {
        borderColor: "#e5e7eb", // Tailwind gray-200
        strokeDashArray: 4,
      },
      dataLabels: {
        enabled: false,
      },
      markers: {
        size: 5,
        strokeWidth: 2,
        strokeColors: "#3b82f6",
        hover: {
          sizeOffset: 3,
        },
      },
    },
    series: [],
  });

  useEffect(() => {
    const rawData = generatePostDates(posts);
    const grouped = rawData.reduce((acc, post) => {
      const existing = acc.find((item) => item.x === post.date);
      if (existing) existing.y += 1;
      else acc.push({ x: post.date, y: 1 });
      return acc;
    }, [] as { x: string; y: number }[]);

    setChartData((prev) => ({
      ...prev,
      series: [{ name: "Posts", data: grouped }],
    }));
  }, [posts]);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow border border-gray-200">
      <ReactApexChart
        options={chartData.options}
        series={chartData.series}
        type="line"
        height={360}
      />
    </div>
  );
}
