import { supabase } from '@/lib/supabase'
import { useEffect, useState } from 'react'

export const useCaregivers = () => {
  const [caregivers, setCaregivers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchCaregivers()
  }, [])

  const fetchCaregivers = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error } = await supabase
        .from('caregivers')
        .select('*')

      if (error) throw error
      
      setCaregivers(data || [])
    } catch (err) {
      console.error('Error fetching caregivers:', err)
      setError(err instanceof Error ? err.message : 'Failed to load caregivers')
    } finally {
      setLoading(false)
    }
  }

  return { caregivers, loading, error }
}