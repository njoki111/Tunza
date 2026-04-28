import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
export type CaregiverDetail = {
  id: string
  name: string
  avatar: string | null
  location: string | null
  rating: number | null
  reviewCount: number
  hourlyRate: number
  experience: number
  bio: string | null
  verified: boolean
  backgroundChecked: boolean
  certifications: string[]
  languages: string[]
  specialties: string[]
  availability: { day: number; startTime: string; endTime: string }[]
}

export const useCaregiverDetail = (id?: string) => {
  const [caregiver, setCaregiver] = useState<CaregiverDetail | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    loadCaregiver()
  }, [id])

  const loadCaregiver = async () => {
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
          bio,
          verified,
          background_checked,
          users(name),
          certifications(name),
          caregiver_languages(languages(name)),
          availability(day, start_time, end_time),
          caregiver_specialties(specialties(name))
        `)
        .eq('id', id)
        .single()

      if (error) throw error

      setCaregiver({
        id: data.id,
        name: (data.users as any)?.name ?? 'Unknown',
        avatar: data.avatar,
        location: data.location,
        rating: data.rating,
        reviewCount: data.review_count,
        hourlyRate: data.hourly_rate,
        experience: data.experience_years,
        bio: data.bio,
        verified: data.verified,
        backgroundChecked: data.background_checked,
        certifications: (data.certifications as any[])?.map(c => c.name) ?? [],
        languages: (data.caregiver_languages as any[])?.map(cl => cl.languages?.name).filter(Boolean) ?? [],
        specialties: (data.caregiver_specialties as any[])?.map(s => s.specialties?.name).filter(Boolean) ?? [],
        availability: (data.availability as any[])?.map(a => ({
          day: a.day,
          startTime: a.start_time,
          endTime: a.end_time,
        })) ?? [],
      })
    } catch (err) {
      console.error('useCaregiverDetail error:', err)
      setError(err instanceof Error ? err.message : 'Failed to load caregiver')
    } finally {
      setLoading(false)
    }
  }

  return { caregiver, loading, error }
}