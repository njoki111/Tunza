import { useState } from 'react'
import { View, TextInput, Button } from 'react-native'
import { supabase } from '@/lib/supabase'

export default function Login() {

const [email,setEmail]=useState('')
const [password,setPassword]=useState('')

const signIn=async()=>{

await supabase.auth.signInWithPassword({
email,
password
})

}
const signUp = async () => {

await supabase.auth.signUp({

email,
password

})

}

return(

<View>

<TextInput
placeholder="Email"
onChangeText={setEmail}
/>

<TextInput
placeholder="Password"
secureTextEntry
onChangeText={setPassword}
/>

<Button title="Login" onPress={signIn}/>
<Button title="Sign up" onPress={signUp}/>

</View>

)

}
