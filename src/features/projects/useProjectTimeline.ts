import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'

export interface TimelineEvent {
    id: string
    project_id: string
    title: string
    description: string
    image_url: string
    video_url: string
    images?: string[]
    videos?: string[]
    display_order: number
}

export const useProjectTimeline = (projectId: string | undefined) => {
    return useQuery({
        queryKey: ['project-timeline', projectId],
        queryFn: async () => {
            if (!projectId) return []
            const { data, error } = await supabase
                .from('project_timeline_events')
                .select('*')
                .eq('project_id', projectId)
                .order('display_order', { ascending: true })

            if (error) throw error
            return data as TimelineEvent[]
        },
        enabled: !!projectId
    })
}

export const useUpdateProjectTimelineOrder = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (updates: { id: string; display_order: number }[]) => {
            const { error } = await supabase
                .from('project_timeline_events')
                .upsert(updates, { onConflict: 'id' })

            if (error) throw error
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['project-timeline'] })
        }
    })
}

export const useCreateProjectTimelineEvent = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (newEvent: Omit<TimelineEvent, 'id' | 'created_at'>) => {
            const { data, error } = await supabase
                .from('project_timeline_events')
                .insert([newEvent])
                .select()
                .single()

            if (error) throw error
            return data
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['project-timeline', data.project_id] })
        }
    })
}

export const useDeleteProjectTimelineEvent = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ id }: { id: string; projectId: string }) => {
            const { error } = await supabase
                .from('project_timeline_events')
                .delete()
                .eq('id', id)

            if (error) throw error
        },
        onSuccess: (_, { projectId }) => {
            queryClient.invalidateQueries({ queryKey: ['project-timeline', projectId] })
        }
    })
}

export const useUpdateProjectTimelineEvent = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ id, ...updates }: Partial<TimelineEvent> & { id: string }) => {
            const { data, error } = await supabase
                .from('project_timeline_events')
                .update(updates)
                .eq('id', id)
                .select()
                .single()

            if (error) throw error
            return data
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['project-timeline', data.project_id] })
        }
    })
}

export const useUploadProjectTimelineMedia = () => {
    return useMutation({
        mutationFn: async ({ file, path }: { file: File, path: string }) => {
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
