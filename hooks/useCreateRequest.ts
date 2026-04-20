import { supabase } from '@/lib/supabase'

export const createRequest = async (

caregiverId

)=>{

const user = await supabase.auth.getUser()

await supabase
.from('requests')
.insert({

family_id:user.data.user.id,
caregiver_id:caregiverId,
status:'pending'

})

}