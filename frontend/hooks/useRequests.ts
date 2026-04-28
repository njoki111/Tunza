import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabaseClient'
export const useRequests = () =>
  useQuery({
    queryKey: ['requests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('requests')
        .select(`
          *,
          caregivers(
            avatar,
            users(name)
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data ?? []
    },
  })