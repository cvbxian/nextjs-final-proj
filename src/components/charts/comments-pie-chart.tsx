"use client";

import dynamic from "next/dynamic";
import { Comment, Post } from "@/types";
import { useMemo } from "react";
import { ApexOptions } from "apexcharts";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function CommentsPieChart({
  posts,
  comments,
}: {
  posts: Post[];
  comments: Comment[];
}) {
  const chartData = useMemo(() => {
    const data = posts
      .map((post) => ({
        label: post.title.length > 20 ? post.title.slice(0, 20) + "…" : post.title,
        value: comments.filter((c) => c.postId === post.id).length,
      }))
      .filter((p) => p.value > 0);

    return {
      series: data.map((d) => d.value),
      labels: data.map((d) => d.label),
    };
  }, [posts, comments]);

  const options: ApexOptions = {
    chart: {
      type: "donut",
      background: "transparent",
      toolbar: { show: false },
    },
    labels: chartData.labels,
    legend: {
      position: "bottom",
      fontSize: "14px",
      fontWeight: 500,
      labels: {
        colors: "#4b5563", // Tailwind slate-600
      },
      itemMargin: {
        horizontal: 10,
        vertical: 6,
      },
    },
    colors: [
      "#3b82f6", "#10b981", "#f59e0b", "#ef4444",
      "#8b5cf6", "#ec4899", "#22d3ee", "#eab308",
      "#14b8a6", "#6366f1"
    ],
    tooltip: {
      theme: "light",
      y: {
        formatter: (val) => `${val} comments`,
      },
    },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: "13px",
        colors: ["#fff"],
      },
      dropShadow: {
        enabled: true,
        top: 1,
        left: 1,
        blur: 2,
        color: "#000",
        opacity: 0.25,
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: "70%",
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: "14px",
              fontWeight: 600,
              color: "#6b7280", // Tailwind gray-500
              offsetY: 10,
            },
            value: {
              show: true,
              fontSize: "18px",
              fontWeight: 700,
              color: "#1f2937", // Tailwind gray-800
              offsetY: -10,
              formatter: (val) => `${val}`,
            },
            total: {
              show: true,
              label: "Total",
              fontSize: "14px",
              fontWeight: 500,
              color: "#9ca3af", // Tailwind gray-400
              formatter: () =>
                `${chartData.series.reduce((a, b) => a + b, 0)} comments`,
            },
          },
        },
      },
    },
    stroke: {
      show: false,
    },
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Comments by Post</h2>
      <ReactApexChart
        options={options}
        series={chartData.series}
        type="donut"
        height={340}
      />
    </div>
  );
}
