import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { trpc } from '@/utils/trpc';
import { z } from 'zod';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';

const formSchema = z.object({
    title: z.string().min(1, { message: 'Title is required' }),
    content: z.string().min(1, { message: 'Content is required' }),
    image: z.instanceof(File).optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function UpdatePost() {
    const router = useRouter();
    const { id } = router.query;
    const { data: post, isLoading } = trpc.getPostById.useQuery({ id: String(id) });
    const updatePostMutation = trpc.updatePost.useMutation();
    const uploadImageMutation = trpc.uploadImage.useMutation();

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: '',
            content: '',
        },
    });

    useEffect(() => {
        if (post) {
            form.reset({
                title: post.title,
                content: post.content,
            });
        }
    }, [post, form]);

    const handleSubmit: SubmitHandler<FormValues> = async (values) => {
        let imageUrl = post?.imageUrl || '';

        if (values.image) {
            const formData = new FormData();
            formData.append('image', values.image);

            const response = await uploadImageMutation.mutateAsync({ formData });
            const { imageUrl: uploadedImageUrl } = response as { imageUrl: string };
            imageUrl = uploadedImageUrl;
        }

        await updatePostMutation.mutateAsync({
            id: String(id),
            title: values.title,
            content: values.content,
            imageUrl,
        });

        await router.push(`/posts/${id}`);
    };

    if (isLoading) return <div>Loading...</div>;

    return (
        <div className="container p-8">
            <h1 className="text-gray-500 text-3xl mb-4">Update Post</h1>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4" encType="multipart/form-data">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                    <Input placeholder="Title" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Content</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Content" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="image"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Image</FormLabel>
                                <FormControl>
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => field.onChange(e.target.files?.[0])}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {post?.imageUrl && (
                        <div>
                            <p>Current Image:</p>
                            <img src={post.imageUrl} alt={post.title} className="w-64 h-auto rounded-lg mb-4" />
                        </div>
                    )}
                    <Button type="submit">Update Post</Button>
                </form>
            </Form>
        </div>
    );
}
