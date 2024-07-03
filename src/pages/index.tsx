import React from 'react';
import { trpc } from '@/utils/trpc';
import Link from 'next/link';

export default function Home() {
    const { data: posts, isLoading } = trpc.getAllPosts.useQuery();

    if (isLoading) return (
        <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
        </div>
    );

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Blog Posts</h1>
            {posts && posts.length > 0 ? (
                <ul className="space-y-4">
                    {posts.map((post) => (
                        <li key={post.id} className="bg-white shadow-md rounded-lg overflow-hidden transition duration-300 ease-in-out transform hover:scale-105">
                            <Link href={`/posts/${post.id}`}>
                                <div className="block p-6 hover:bg-gray-50">
                                    <h2 className="text-xl font-semibold text-gray-800 mb-2">{post.title}</h2>
                                    {post.content && (
                                        <p className="text-gray-600">
                                            {post.content.length > 100
                                                ? `${post.content.substring(0, 100)}...`
                                                : post.content}
                                        </p>
                                    )}
                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-center text-gray-600">No posts available.</p>
            )}
        </div>
    );
}
