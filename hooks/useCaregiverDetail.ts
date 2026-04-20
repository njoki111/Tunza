import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export const useCaregiverDetail = (id?: string) => {

const [caregiver,setCaregiver] = useState<any>(null);

useEffect(()=>{

if(!id) return;

loadCaregiver();

},[id]);

const loadCaregiver = async()=>{

const { data, error } = await supabase
.from("caregivers")
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
languages(name),
availability(day,start_time,end_time),

caregiver_specialties(
specialties(name)
)
`)
.eq("id", id)
.single();

if(error){

console.log(error);
return;

}

setCaregiver(formatCaregiver(data));

};

return caregiver;

};

const formatCaregiver = (data:any)=>{

return {

id: data.id,
name: data.users?.name,
avatar: data.avatar,
location: data.location,
rating: data.rating,
reviewCount: data.review_count,
hourlyRate: data.hourly_rate,
experience: data.experience_years,
bio: data.bio,

verified: data.verified,
backgroundChecked: data.background_checked,

certifications:
data.certifications?.map(c=>c.name) ?? [],

languages:
data.languages?.map(l=>l.name) ?? [],

specialties:
data.caregiver_specialties?.map(
s=>s.specialties.name
) ?? [],

availability:
data.availability?.map(a=>({

day:a.day,
startTime:a.start_time,
endTime:a.end_time

})) ?? []

};

};