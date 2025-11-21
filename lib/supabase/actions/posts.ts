'use server'

import { createClient } from '@/lib/supabase/server'
import { postSchema } from '@/lib/validations/blog'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export async function createPost(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Non authentifié' }
  }

  const coverUrlValue = formData.get('cover_url') as string
  const rawData = {
    title: formData.get('title') as string,
    excerpt: formData.get('excerpt') as string,
    content: formData.get('content') as string,
    slug: formData.get('slug') as string || generateSlug(formData.get('title') as string),
    cover_url: coverUrlValue && coverUrlValue.trim() !== '' ? coverUrlValue : null,
  }

  const validatedData = postSchema.parse(rawData)

  const { data, error } = await supabase
    .from('posts')
    .insert({
      ...validatedData,
      author_id: user.id,
    })
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  redirect(`/dashboard/${data.id}`)
}

export async function updatePost(id: string, formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Non authentifié' }
  }

  const coverUrlValue = formData.get('cover_url') as string
  const rawData = {
    title: formData.get('title') as string,
    excerpt: formData.get('excerpt') as string,
    content: formData.get('content') as string,
    slug: formData.get('slug') as string,
    cover_url: coverUrlValue && coverUrlValue.trim() !== '' ? coverUrlValue : null,
  }

  const validatedData = postSchema.parse(rawData)

  const { error } = await supabase
    .from('posts')
    .update(validatedData)
    .eq('id', id)
    .eq('author_id', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  revalidatePath(`/post/${validatedData.slug}`)
  return { success: true }
}

export async function publishPost(id: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Non authentifié' }
  }

  const { data: post, error: fetchError } = await supabase
    .from('posts')
    .select('slug')
    .eq('id', id)
    .eq('author_id', user.id)
    .single()

  if (fetchError || !post) {
    return { error: 'Post non trouvé' }
  }

  const { error } = await supabase
    .from('posts')
    .update({ published_at: new Date().toISOString() })
    .eq('id', id)
    .eq('author_id', user.id)

  if (error) {
    return { error: error.message }
  }

  // Trigger newsletter notification (will be handled by Edge Function)
  // For now, we'll call it directly
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/notify-subscribers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY || ''}`,
      },
      body: JSON.stringify({ post_id: id }),
    })

    if (!response.ok) {
      console.error('Failed to notify subscribers')
    }
  } catch (err) {
    console.error('Error notifying subscribers:', err)
  }

  revalidatePath('/dashboard')
  revalidatePath(`/post/${post.slug}`)
  return { success: true }
}

export async function deletePost(id: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Non authentifié' }
  }

  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', id)
    .eq('author_id', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  redirect('/dashboard')
}

