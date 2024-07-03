import { trpc } from '../utils/trpc';
import React, { useState } from 'react';

export default function Home() {
    const { data: posts, isLoading } = trpc.getAllPosts.useQuery();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const createPostMutation = trpc.createPost.useMutation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await createPostMutation.mutateAsync({ title, content });
        setTitle('');
        setContent('');
    };

    if (isLoading) return <div>Loading...</div>;

    return (
        <div>
            <h1>Blog Posts</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Title"
                />
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Content"
                ></textarea>
                <button type="submit">Create Post</button>
            </form>
            <ul>
                {posts?.map((post) => (
                    <li key={post.id}>{post.title}</li>
                ))}
            </ul>
        </div>
    );
}
