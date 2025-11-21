'use server'

import { createClient } from '@/lib/supabase/server'
import { subscriptionSchema } from '@/lib/validations/blog'
import { revalidatePath } from 'next/cache'

export async function subscribeToNewsletter(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const rawData = {
    email: formData.get('email') as string,
  }

  const validatedData = subscriptionSchema.parse(rawData)

  const { data, error } = await supabase
    .from('subscriptions')
    .upsert({
      email: validatedData.email,
      user_id: user?.id || null,
      active: true,
    }, {
      onConflict: 'email',
    })
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/')
  return { data, success: true }
}

