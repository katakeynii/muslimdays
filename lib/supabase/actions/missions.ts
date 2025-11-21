'use server'

import { createClient } from '@/lib/supabase/server'
import { missionSchema } from '@/lib/validations/life-system'
import { revalidatePath } from 'next/cache'

export async function createMission(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Non authentifié' }
  }

  const rawData = {
    title: formData.get('title') as string,
    description: formData.get('description') as string,
    success_vision: formData.get('success_vision') as string,
    active: formData.get('active') === 'true',
  }

  const validatedData = missionSchema.parse(rawData)

  const { data, error } = await supabase
    .from('missions')
    .insert({
      ...validatedData,
      user_id: user.id,
    })
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/missions')
  return { data }
}

export async function updateMission(id: string, formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Non authentifié' }
  }

  const rawData = {
    title: formData.get('title') as string,
    description: formData.get('description') as string,
    success_vision: formData.get('success_vision') as string,
    active: formData.get('active') === 'true',
  }

  const validatedData = missionSchema.parse(rawData)

  const { error } = await supabase
    .from('missions')
    .update(validatedData)
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/missions')
  revalidatePath(`/missions/${id}`)
  return { success: true }
}

export async function deleteMission(id: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Non authentifié' }
  }

  const { error } = await supabase
    .from('missions')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/missions')
  return { success: true }
}

export async function toggleMissionActive(id: string, active: boolean) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Non authentifié' }
  }

  const { error } = await supabase
    .from('missions')
    .update({ active })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/missions')
  revalidatePath(`/missions/${id}`)
  return { success: true }
}

