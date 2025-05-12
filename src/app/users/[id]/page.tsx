"use client";

import { useQuery } from "@tanstack/react-query";
import { getUser, getUserPosts } from "@/lib/api";
import Navbar from "@/components/layout/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function UserProfilePage() {
  const { id } = useParams<{ id: string }>();

  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: ["user", id],
    queryFn: () => getUser(id!),
    enabled: !!id,
  });

  const { data: posts, isLoading: isLoadingPosts } = useQuery({
    queryKey: ["userPosts", id],
    queryFn: () => getUserPosts(id!),
    enabled: !!id,
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        {isLoadingUser ? (
          <p className="text-center text-gray-500">Loading user profile...</p>
        ) : !user ? (
          <div className="bg-red-100 text-red-700 p-4 rounded-md">
            <p>User not found. <Link href="/users" className="underline">Return to users list</Link></p>
          </div>
        ) : (
          <>
            <div className="flex items-center mb-8">
              <Link href="/users" className="text-indigo-600 hover:text-indigo-800 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">User Profile</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Profile Info */}
              <div>
                <Card className="rounded-xl shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg text-gray-800">Profile Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center mb-6">
                      <div className="w-20 h-20 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-2xl font-bold shadow-sm mb-3">
                        {user.name.charAt(0)}
                      </div>
                      <h2 className="text-xl font-semibold text-gray-900">{user.name}</h2>
                      <p className="text-gray-500 text-sm">@{user.username}</p>
                    </div>

                    <div className="space-y-4 text-sm text-gray-700">
                      <div>
                        <p className="font-medium text-gray-500">Email</p>
                        <p>{user.email}</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-500">Phone</p>
                        <p>{user.phone}</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-500">Website</p>
                        <p>{user.website}</p>
                      </div>

                      <Separator />

                      <div>
                        <p className="font-medium text-gray-500">Address</p>
                        <p>{user.address.street}, {user.address.suite}</p>
                        <p>{user.address.city}, {user.address.zipcode}</p>
                      </div>

                      <div className="mt-4">
                        <p className="font-medium text-gray-500 mb-2">Location Map</p>
                        <iframe
                          className="rounded-md border"
                          width="100%"
                          height="200"
                          style={{ border: 0 }}
                          loading="lazy"
                          allowFullScreen
                          src={`https://maps.google.com/maps?q=${encodeURIComponent(
                            `${user.address.street}, ${user.address.city}`
                          )}&z=12&output=embed`}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Posts */}
              <div className="lg:col-span-2">
                <Card className="rounded-xl shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg text-gray-800">
                      Posts by {user.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isLoadingPosts ? (
                      <p className="text-gray-500">Loading posts...</p>
                    ) : !posts || posts.length === 0 ? (
                      <p className="text-gray-500">No posts found for this user.</p>
                    ) : (
                      <div className="space-y-4">
                        {posts.map((post) => (
                          <div
                            key={post.id}
                            className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition"
                          >
                            <h3 className="text-lg font-medium text-gray-900 mb-2">{post.title}</h3>
                            <p className="text-gray-600 mb-3">{post.body}</p>
                            <Link
                              href={`/posts/${post.id}`}
                              className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
                            >
                              View Post
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 ml-1"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </Link>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
