import React from 'react';
import { z } from 'zod';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { trpc } from '@/utils/trpc';

const formSchema = z.object({
    title: z.string().min(1, { message: 'Title is required' }),
    content: z.string().min(1, { message: 'Content is required' }),
    image: z.instanceof(File).optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function CreatePost() {
    const createPostMutation = trpc.createPost.useMutation();
    const uploadImageMutation = trpc.uploadImage.useMutation();

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: '',
            content: '',
            image: undefined,
        },
    });

    const handleSubmit: SubmitHandler<FormValues> = async (values) => {
        let imageUrl = '';

        if (values.image) {
            const formData = new FormData();
            formData.append('image', values.image);

            // Fixing the mutateAsync argument
            const response = await uploadImageMutation.mutateAsync({ formData });
            const { imageUrl: uploadedImageUrl } = response as { imageUrl: string };
            imageUrl = uploadedImageUrl;
        }

        await createPostMutation.mutateAsync({
            title: values.title,
            content: values.content,
            imageUrl,
        });

        form.reset();
    };

    return (
        <div className="container p-8">
            <h1 className="text-gray-500 text-3xl mb-4">Create Post</h1>
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
                                    <Input type="file" accept="image/*" onChange={(e) => field.onChange(e.target.files?.[0])} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit">Create Post</Button>
                </form>
            </Form>
        </div>
    );
}
