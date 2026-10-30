import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'

export interface Project {
    id: string
    title: string
    slug: string
    description?: string
    service_id?: string
    main_image?: string
    gallery?: string[]
    gallery_project?: string[]
    gallery_process?: string[]
    show_gallery_project?: boolean
    show_gallery_process?: boolean
    cover_position?: string
    location?: string
    completion_date?: string
    is_featured: boolean
    created_at: string
    service?: {
        title: string
    }
}

export const useProjects = () => {
    return useQuery({
        queryKey: ['projects'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('projects')
                .select('*, service:services(title)')
                .order('created_at', { ascending: false })

            if (error) throw error
            return data as (Project & { service: { title: string } })[]
        }
    })
}

export const useProject = (id: string) => {
    return useQuery({
        queryKey: ['projects', id],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('projects')
                .select('*, service:services(title)')
                .eq('id', id)
                .single()

            if (error) throw error
            return data as Project
        },
        enabled: !!id
    })
}

export const useCreateProject = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (newProject: Omit<Project, 'id' | 'created_at'>) => {
            const { data, error } = await supabase
                .from('projects')
                .insert([newProject])
                .select()
                .single()

            if (error) throw error
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] })
        }
    })
}

export const useUpdateProject = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ id, ...updates }: Partial<Project> & { id: string }) => {
            const { data, error } = await supabase
                .from('projects')
                .update(updates)
                .eq('id', id)
                .select()
                .single()

            if (error) throw error
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] })
        }
    })
}

export const useDeleteProject = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase
                .from('projects')
                .delete()
                .eq('id', id)

            if (error) throw error
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] })
        }
    })
}
export const useUploadProjectMedia = () => {
    return useMutation({
        mutationFn: async ({ file, path }: { file: File, path: string }) => {
            // Re-create file with ASCII-safe name to avoid non ISO-8859-1 header errors
            const safeFile = new File([file], path.split('/').pop() || 'file', { type: file.type })
            const { data, error } = await supabase.storage
                .from('projects')
                .upload(path, safeFile, {
                    cacheControl: '3600',
                    upsert: false
                })

            if (error) throw error

            const { data: { publicUrl } } = supabase.storage
                .from('projects')
                .getPublicUrl(data.path)

            return publicUrl
        }
    })
}
