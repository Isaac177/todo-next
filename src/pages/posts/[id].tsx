import React from 'react';
import { useRouter } from 'next/router';
import { trpc } from '@/utils/trpc';
import Link from 'next/link';
import Image from 'next/image';
import {Pencil, Trash} from 'lucide-react';

export default function BlogPost() {
    const router = useRouter();
    const { id } = router.query;
    const { data: post, isLoading, error } = trpc.getPostById.useQuery({ id: id as string }, {
        enabled: !!id,
    });

    const deletePostMutation = trpc.deletePost.useMutation();


    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-4xl font-bold mb-8 text-center text-red-500">Error</h1>
                <p className="text-center">{error.message}</p>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Post not found</h1>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold text-gray-800">{post.title}</h1>
                <Link href={`/update/${post.id}`}>
                    <span className="flex items-center text-blue-500 hover:underline">
                        <Pencil className="mr-2" size={20} />
                        Update
                    </span>
                </Link>

                <div className="flex items-center text-red-500 hover:underline cursor-pointer"
                     onClick={async () => {
                         if (!window.confirm('Are you sure you want to delete this post?')) {
                             await deletePostMutation.mutateAsync({id: post.id});
                             router.push('/');
                         }
                     }}
                >
                    <Trash className="mr-2" size={20} />
                    Delete
                </div>

            </div>
            <div className="bg-white shadow-md rounded-lg overflow-hidden p-6">
                <p className="text-gray-600 mb-4">{post.content}</p>
                {post.imageUrl && (
                    <div className="relative w-full h-64 mb-4">
                        <Image
                            src={post.imageUrl ? post.imageUrl : 'https://via.placeholder.com/300'}
                            alt={post.title ? post.title : 'Post Image'}
                            layout="fill"
                            objectFit="cover"
                            className="rounded-lg"
                        />
                    </div>
                )}
                <p className="text-sm text-gray-500">Created at: {new Date(post.createdAt).toLocaleString()}</p>
            </div>
            <div className="mt-8 text-center">
                <Link href="/">
                    <span className="text-blue-500 hover:underline">Back to all posts</span>
                </Link>
            </div>
        </div>
    );
}
