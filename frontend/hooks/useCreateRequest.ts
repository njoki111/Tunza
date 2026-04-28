import { supabase } from '@/lib/supabaseClient'
type CreateRequestParams = {
  caregiverId: string
  careType: string
  startDatetime: string   // ISO string e.g. "2025-06-01T09:00:00Z"
  endDatetime: string
  agreedRate: number
  notes?: string
}

export const useCreateRequest = () => {
  const createRequest = async (params: CreateRequestParams) => {
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('requests')
      .insert({
        family_id:      user.id,
        caregiver_id:   params.caregiverId,
        care_type:      params.careType,
        start_datetime: params.startDatetime,
        end_datetime:   params.endDatetime,
        agreed_rate:    params.agreedRate,
        notes:          params.notes ?? null,
        status:         'pending',
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  return { createRequest }
}