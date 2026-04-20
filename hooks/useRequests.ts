export const useRequests = () =>
  useQuery({
    queryKey: ['requests'],
    queryFn: async () => {
      const { data } = await supabase
        .from('requests')
        .select(`
          *,
          caregivers(
            users(name, avatar_url)
          )
        `)

      return data
    }
  })