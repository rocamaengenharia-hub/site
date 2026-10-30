import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'

export interface Post {
    id: string
    title: string
    slug: string
    excerpt?: string
    content?: string
    main_image?: string
    author_name: string
    category_id?: string
    published_at: string
    is_published: boolean
    seo_title?: string
    seo_description?: string
    created_at: string
    updated_at: string
    category?: {
        title: string
    }
}

export const usePosts = (options?: { is_published?: boolean, category_id?: string }) => {
    return useQuery({
        queryKey: ['posts', options],
        queryFn: async () => {
            let query = supabase
                .from('posts')
                .select('*, category:services(title)')
                .order('published_at', { ascending: false })

            if (options?.is_published !== undefined) {
                query = query.eq('is_published', options.is_published)
            }

            if (options?.category_id) {
                query = query.eq('category_id', options.category_id)
            }

            const { data, error } = await query

            if (error) throw error
            return data as (Post & { category: { title: string } })[]
        }
    })
}

export const usePost = (idOrSlug: string) => {
    return useQuery({
        queryKey: ['posts', idOrSlug],
        queryFn: async () => {
            // Try to find by UUID first if it looks like one, otherwise fallback to slug
            const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);

            let query = supabase
                .from('posts')
                .select('*, category:services(title)');

            if (isUuid) {
                query = query.eq('id', idOrSlug);
            } else {
                query = query.eq('slug', idOrSlug);
            }

            const { data, error } = await query.maybeSingle();

            if (error) throw error;
            return data as Post;
        },
        enabled: !!idOrSlug
    })
}

export const useCreatePost = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (newPost: Omit<Post, 'id' | 'created_at' | 'updated_at'>) => {
            const { data, error } = await supabase
                .from('posts')
                .insert([newPost])
                .select()
                .single()

            if (error) throw error
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['posts'] })
        }
    })
}

export const useUpdatePost = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ id, ...updates }: Partial<Post> & { id: string }) => {
            const { data, error } = await supabase
                .from('posts')
                .update({ ...updates, updated_at: new Date().toISOString() })
                .eq('id', id)
                .select()
                .single()

            if (error) throw error
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['posts'] })
        }
    })
}

export const useDeletePost = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase
                .from('posts')
                .delete()
                .eq('id', id)

            if (error) throw error
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['posts'] })
        }
    })
}

export const useUploadPostMedia = () => {
    return useMutation({
        mutationFn: async ({ file, path }: { file: File, path: string }) => {
            const safeFile = new File([file], path.split('/').pop() || 'file', { type: file.type })
            const { data, error } = await supabase.storage
                .from('blog')
                .upload(path, safeFile, {
                    cacheControl: '3600',
                    upsert: false
                })

            if (error) throw error

            const { data: { publicUrl } } = supabase.storage
                .from('blog')
                .getPublicUrl(data.path)

            return publicUrl
        }
    })
}
