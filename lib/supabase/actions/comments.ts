'use server'

import { createClient } from '@/lib/supabase/server'
import { commentSchema } from '@/lib/validations/blog'
import { revalidatePath } from 'next/cache'

export async function createComment(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Non authentifié' }
  }

  const rawData = {
    post_id: formData.get('post_id') as string,
    content: formData.get('content') as string,
  }

  const validatedData = commentSchema.parse(rawData)

  const { data, error } = await supabase
    .from('comments')
    .insert({
      ...validatedData,
      author_id: user.id,
    })
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath(`/post/${formData.get('post_slug')}`)
  return { data }
}

export async function deleteComment(id: string, postSlug: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Non authentifié' }
  }

  const { error } = await supabase
    .from('comments')
    .delete()
    .eq('id', id)
    .eq('author_id', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath(`/post/${postSlug}`)
  return { success: true }
}

export async function toggleCommentLike(commentId: string, postSlug: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Non authentifié' }
  }

  // Check if already liked
  const { data: existingLike } = await supabase
    .from('comment_likes')
    .select('id')
    .eq('comment_id', commentId)
    .eq('user_id', user.id)
    .single()

  if (existingLike) {
    // Unlike
    const { error } = await supabase
      .from('comment_likes')
      .delete()
      .eq('id', existingLike.id)

    if (error) {
      return { error: error.message }
    }
  } else {
    // Like
    const { error } = await supabase
      .from('comment_likes')
      .insert({
        comment_id: commentId,
        user_id: user.id,
      })

    if (error) {
      return { error: error.message }
    }
  }

  revalidatePath(`/post/${postSlug}`)
  return { success: true }
}

