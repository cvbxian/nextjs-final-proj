"use client";

import dynamic from "next/dynamic";
import { Post, Comment } from "@/types";
import { ApexOptions } from "apexcharts";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function CommentsChart({
  posts,
  comments,
}: {
  posts: Post[];
  comments: Comment[];
}) {
  const commentCounts = comments.reduce<Record<number, number>>((acc, comment) => {
    acc[comment.postId] = (acc[comment.postId] || 0) + 1;
    return acc;
  }, {});

  const topPosts = posts
    .map((post) => ({
      title: post.title.length > 24 ? post.title.slice(0, 24) + "…" : post.title,
      count: commentCounts[post.id] || 0,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const categories = topPosts.map((p) => p.title);
  const values = topPosts.map((p) => p.count);

  const barColors = [
    "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6",
    "#ec4899", "#22d3ee", "#eab308", "#14b8a6", "#6366f1",
  ];

  const options: ApexOptions = {
    chart: {
      type: "bar",
      toolbar: { show: false },
      background: "transparent",
      animations: {
        enabled: true,
        animateGradually: {
          enabled: true,
          delay: 150,
        },
        dynamicAnimation: {
          enabled: true,
          speed: 500,
        },
      },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 6,
        barHeight: "60%",
        distributed: true,
      },
    },
    xaxis: {
      categories,
      labels: {
        style: {
          colors: "#94a3b8",
          fontSize: "13px",
          fontWeight: 500,
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: "#64748b",
          fontSize: "13px",
          fontWeight: 500,
        },
      },
    },
    fill: {
      opacity: 1,
      colors: barColors,
    },
    tooltip: {
      theme: "light",
      style: {
        fontSize: "14px",
      },
    },
    grid: {
      borderColor: "#e2e8f0",
      strokeDashArray: 4,
      padding: { left: 12 },
    },
    dataLabels: {
      enabled: false,
    },
  };

  const series = [{ name: "Comments", data: values }];

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-md border border-gray-200">
      <Chart options={options} series={series} type="bar" height={480} />
    </div>
  );
}
