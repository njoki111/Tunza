import { supabase } from '@/lib/supabaseClient'
import { useEffect, useState } from 'react'

export type CaregiverSummary = {
  id: string
  name: string
  avatar: string | null
  location: string | null
  rating: number | null
  reviewCount: number
  hourlyRate: number
  experience: number
  verified: boolean
  specialties: string[]
}

export const useCaregivers = () => {
  const [caregivers, setCaregivers] = useState<CaregiverSummary[]>([])
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
        .select(`
          id,
          avatar,
          location,
          experience_years,
          hourly_rate,
          rating,
          review_count,
          verified,
          users(name),
          caregiver_specialties(
            specialties(name)
          )
        `)
        .eq('verified', true)
        .order('rating', { ascending: false })

      if (error) throw error

      const formatted: CaregiverSummary[] = (data ?? []).map((c: any) => ({
        id: c.id,
        name: c.users?.name ?? 'Unknown',
        avatar: c.avatar,
        location: c.location,
        rating: c.rating,
        reviewCount: c.review_count,
        hourlyRate: c.hourly_rate,
        experience: c.experience_years,
        verified: c.verified,
        specialties: c.caregiver_specialties?.map((s: any) => s.specialties?.name).filter(Boolean) ?? [],
      }))

      setCaregivers(formatted)
    } catch (err) {
      console.error('useCaregivers error:', err)
      setError(err instanceof Error ? err.message : 'Failed to load caregivers')
    } finally {
      setLoading(false)
    }
  }

  return { caregivers, loading, error, refetch: fetchCaregivers }
}