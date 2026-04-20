import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

export const useUser = () =>
  useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const { data: session } = await supabase.auth.getSession()

      const { data } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.session?.user.id)
        .single()

      return data
    }
  })