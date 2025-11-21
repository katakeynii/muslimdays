'use server'

import { createClient } from '@/lib/supabase/server'
import { keyResultSchema } from '@/lib/validations/life-system'
import { revalidatePath } from 'next/cache'

export async function createKeyResult(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Non authentifié' }
  }

  const rawData = {
    objective_id: formData.get('objective_id') as string,
    title: formData.get('title') as string,
    description: formData.get('description') as string,
    target_value: Number(formData.get('target_value')),
    start_date: formData.get('start_date') as string,
    end_date: formData.get('end_date') as string,
    kr_type: formData.get('kr_type') as 'completion_rate' | 'streak',
  }

  const validatedData = keyResultSchema.parse(rawData)

  // Check max 4 KR per objective
  const { count } = await supabase
    .from('key_results')
    .select('*', { count: 'exact', head: true })
    .eq('objective_id', validatedData.objective_id)

  if (count && count >= 4) {
    return { error: 'Maximum 4 Key Results par objectif' }
  }

  const { data, error } = await supabase
    .from('key_results')
    .insert({
      ...validatedData,
      current_value: 0,
    })
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath(`/objectifs/${validatedData.objective_id}`)
  return { data }
}

export async function updateKeyResult(id: string, formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Non authentifié' }
  }

  const rawData = {
    objective_id: formData.get('objective_id') as string,
    title: formData.get('title') as string,
    description: formData.get('description') as string,
    target_value: Number(formData.get('target_value')),
    start_date: formData.get('start_date') as string,
    end_date: formData.get('end_date') as string,
    kr_type: formData.get('kr_type') as 'completion_rate' | 'streak',
  }

  const validatedData = keyResultSchema.parse(rawData)

  const { error } = await supabase
    .from('key_results')
    .update(validatedData)
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath(`/objectifs/${validatedData.objective_id}`)
  return { success: true }
}

export async function deleteKeyResult(id: string, objectiveId: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Non authentifié' }
  }

  const { error } = await supabase
    .from('key_results')
    .delete()
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath(`/objectifs/${objectiveId}`)
  return { success: true }
}

