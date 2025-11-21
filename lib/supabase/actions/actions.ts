'use server'

import { createClient } from '@/lib/supabase/server'
import { actionSchema } from '@/lib/validations/life-system'
import { revalidatePath } from 'next/cache'
import { addDays, addWeeks, addMonths, addYears, format } from 'date-fns'

export async function createAction(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Non authentifié' }
  }

  const rawData = {
    objective_id: formData.get('objective_id') as string || null,
    title: formData.get('title') as string,
    date: formData.get('date') as string || null,
    start_time: formData.get('start_time') as string || null,
    duration: formData.get('duration') ? Number(formData.get('duration')) : null,
    recurrence: formData.get('recurrence') as 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly' || 'none',
    key_result_ids: formData.get('key_result_ids') ? JSON.parse(formData.get('key_result_ids') as string) : [],
  }

  const validatedData = actionSchema.parse(rawData)

  const { data: action, error: actionError } = await supabase
    .from('actions')
    .insert({
      user_id: user.id,
      objective_id: validatedData.objective_id,
      title: validatedData.title,
      date: validatedData.date,
      start_time: validatedData.start_time,
      duration: validatedData.duration,
      recurrence: validatedData.recurrence,
    })
    .select()
    .single()

  if (actionError) {
    return { error: actionError.message }
  }

  // Link to Key Results if provided
  if (validatedData.key_result_ids && validatedData.key_result_ids.length > 0) {
    const links = validatedData.key_result_ids.map((krId: string) => ({
      action_id: action.id,
      key_result_id: krId,
    }))

    await supabase.from('action_key_results').insert(links)
  }

  // Generate occurrences for recurring actions
  if (validatedData.recurrence !== 'none' && validatedData.date) {
    const occurrences = generateOccurrences(
      validatedData.date,
      validatedData.recurrence,
      90 // Generate for next 90 days
    )

    const occurrenceData = occurrences.map((date) => ({
      action_id: action.id,
      date: format(date, 'yyyy-MM-dd'),
      status: 'pending' as const,
    }))

    await supabase.from('occurrences').insert(occurrenceData)
  } else if (validatedData.date) {
    // Single occurrence for non-recurring action
    await supabase.from('occurrences').insert({
      action_id: action.id,
      date: validatedData.date,
      status: 'pending' as const,
    })
  }

  revalidatePath('/actions')
  revalidatePath('/agenda')
  if (validatedData.objective_id) {
    revalidatePath(`/objectifs/${validatedData.objective_id}`)
  }
  return { data: action }
}

function generateOccurrences(startDate: string, recurrence: string, days: number): Date[] {
  const start = new Date(startDate)
  const occurrences: Date[] = []
  let current = new Date(start)

  while (occurrences.length < days && current <= new Date(Date.now() + days * 24 * 60 * 60 * 1000)) {
    occurrences.push(new Date(current))

    switch (recurrence) {
      case 'daily':
        current = addDays(current, 1)
        break
      case 'weekly':
        current = addWeeks(current, 1)
        break
      case 'monthly':
        current = addMonths(current, 1)
        break
      case 'yearly':
        current = addYears(current, 1)
        break
    }
  }

  return occurrences
}

export async function updateAction(id: string, formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Non authentifié' }
  }

  const rawData = {
    objective_id: formData.get('objective_id') as string || null,
    title: formData.get('title') as string,
    date: formData.get('date') as string || null,
    start_time: formData.get('start_time') as string || null,
    duration: formData.get('duration') ? Number(formData.get('duration')) : null,
    recurrence: formData.get('recurrence') as 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly' || 'none',
  }

  const validatedData = actionSchema.parse(rawData)

  const { error } = await supabase
    .from('actions')
    .update(validatedData)
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/actions')
  revalidatePath('/agenda')
  return { success: true }
}

export async function deleteAction(id: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Non authentifié' }
  }

  const { error } = await supabase
    .from('actions')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/actions')
  revalidatePath('/agenda')
  return { success: true }
}

export async function updateOccurrenceStatus(occurrenceId: string, status: 'pending' | 'completed') {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Non authentifié' }
  }

  const { error } = await supabase
    .from('occurrences')
    .update({ status })
    .eq('id', occurrenceId)

  if (error) {
    return { error: error.message }
  }

  // The trigger will automatically update Key Results
  revalidatePath('/agenda')
  revalidatePath('/actions')
  return { success: true }
}

