"use client";

import { useQuery } from "@tanstack/react-query";
import { getUsers } from "@/lib/api";
import Navbar from "@/components/layout/navbar";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { User } from "@/types";
import { Mail, Phone } from "lucide-react";

function UserCard({ user }: { user: User }) {
  return (
    <Card className="h-full shadow-sm hover:shadow-md transition-shadow rounded-xl border border-gray-200">
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-semibold text-xl shadow-sm">
            {user.name.charAt(0)}
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-semibold text-gray-800">{user.name}</h3>
            <p className="text-gray-500 text-sm">@{user.username}</p>
          </div>
        </div>

        <div className="mb-4 space-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-gray-400" />
            <span>{user.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-gray-400" />
            <span>{user.phone}</span>
          </div>
        </div>

        <Link
          href={`/users/${user.id}`}
          className="block w-full text-center bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-medium py-2 px-4 rounded-md transition-colors duration-300"
        >
          View Profile
        </Link>
      </CardContent>
    </Card>
  );
}

export default function UsersPage() {
  const { data: users, isLoading, error } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Users</h1>

        {isLoading && (
          <div className="flex justify-center text-gray-500">Loading users…</div>
        )}

        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-md mb-4">
            Error loading users. Please try again.
          </div>
        )}

        {users && (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {users.map((user) => (
              <UserCard key={user.id} user={user} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
