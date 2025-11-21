'use server'

import { createClient } from '@/lib/supabase/server'
import { objectiveSchema } from '@/lib/validations/life-system'
import { revalidatePath } from 'next/cache'

export async function createObjective(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Non authentifié' }
  }

  const deadlineValue = formData.get('deadline') as string
  const rawData = {
    mission_id: formData.get('mission_id') as string,
    title: formData.get('title') as string,
    description: formData.get('description') as string,
    term_type: formData.get('term_type') as 'court' | 'moyen' | 'long',
    deadline: deadlineValue && deadlineValue.trim() !== '' ? deadlineValue : null,
    success_criteria: formData.get('success_criteria') ? JSON.parse(formData.get('success_criteria') as string) : null,
    active: formData.get('active') === 'true',
  }

  const validatedData = objectiveSchema.parse(rawData)

  const { data, error } = await supabase
    .from('objectives')
    .insert(validatedData)
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/missions')
  revalidatePath(`/missions/${validatedData.mission_id}`)
  revalidatePath(`/objectifs/${data.id}`)
  return { data }
}

export async function updateObjective(id: string, formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Non authentifié' }
  }

  const deadlineValue = formData.get('deadline') as string
  const rawData = {
    mission_id: formData.get('mission_id') as string,
    title: formData.get('title') as string,
    description: formData.get('description') as string,
    term_type: formData.get('term_type') as 'court' | 'moyen' | 'long',
    deadline: deadlineValue && deadlineValue.trim() !== '' ? deadlineValue : null,
    success_criteria: formData.get('success_criteria') ? JSON.parse(formData.get('success_criteria') as string) : null,
    active: formData.get('active') === 'true',
  }

  const validatedData = objectiveSchema.parse(rawData)

  const { error } = await supabase
    .from('objectives')
    .update(validatedData)
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/missions')
  revalidatePath(`/objectifs/${id}`)
  return { success: true }
}

export async function deleteObjective(id: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Non authentifié' }
  }

  const { error } = await supabase
    .from('objectives')
    .delete()
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/missions')
  return { success: true }
}

export async function toggleObjectiveActive(id: string, active: boolean) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Non authentifié' }
  }

  const { error } = await supabase
    .from('objectives')
    .update({ active })
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/missions')
  revalidatePath(`/objectifs/${id}`)
  return { success: true }
}

