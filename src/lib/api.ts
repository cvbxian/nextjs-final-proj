import axios from "axios";
import { User, Post, Comment, Stats } from "@/types";

const API_BASE_URL = "https://jsonplaceholder.typicode.com";

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Custom list of 10 users
const customUsers: User[] = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  name: `User ${i + 1}`,
  username: `user${i + 1}`,
  email: `user${i + 1}@example.com`,
  phone: `0917-000-00${i + 1}`,
  website: `www.user${i + 1}.com`,
  address: {
    street: `Street ${i + 1}`,
    suite: `Suite ${i + 1}`,
    city: `City ${i + 1}`,
    zipcode: `100${i + 1}`,
    geo: {
      lat: "0.0000",
      lng: "0.0000",
    },
  },
  company: {
    name: `Company ${i + 1}`,
    catchPhrase: `Catchphrase ${i + 1}`,
    bs: `BS ${i + 1}`,
  },
}));

export const getUsers = async (): Promise<User[]> => {
  return customUsers;
};

export const getUser = async (id: string): Promise<User> => {
  const user = customUsers.find((u) => u.id === parseInt(id));
  if (!user) throw new Error("User not found");
  return user;
};

export const getPosts = async (): Promise<Post[]> => {
  const response = await api.get<Post[]>("/posts");
  return response.data;
};

export const getUserPosts = async (userId: string): Promise<Post[]> => {
  const response = await api.get<Post[]>(`/posts?userId=${userId}`);
  return response.data.slice(0, 3); // Only 3 posts per user
};

export const getPost = async (id: string): Promise<Post> => {
  const response = await api.get<Post>(`/posts/${id}`);
  return response.data;
};

export const getPostComments = async (postId: string): Promise<Comment[]> => {
  const response = await api.get<Comment[]>(`/posts/${postId}/comments`);
  return response.data;
};

export const getComments = async (): Promise<Comment[]> => {
  const response = await api.get<Comment[]>("/comments");
  return response.data;
};

export const getStats = async (): Promise<Stats> => {
  const [users, posts, comments] = await Promise.all([
    getUsers(),
    getPosts(),
    getComments(),
  ]);

  return {
    users: users.length,
    posts: posts.length,
    comments: comments.length,
  };
};
