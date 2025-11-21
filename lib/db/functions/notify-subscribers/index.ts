// Edge Function alternative (optionnel)
// Peut être utilisé à la place de l'API route Next.js

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const RESEND_FROM_EMAIL = Deno.env.get('RESEND_FROM_EMAIL') || 'noreply@youinc.com'

serve(async (req) => {
  try {
    // Verify authorization
    const authHeader = req.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const { post_id } = await req.json()

    if (!post_id) {
      return new Response(JSON.stringify({ error: 'post_id is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Get post details
    const { data: post, error: postError } = await supabase
      .from('posts')
      .select('*, profiles(full_name)')
      .eq('id', post_id)
      .single()

    if (postError || !post) {
      return new Response(JSON.stringify({ error: 'Post not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Get active subscribers
    const { data: subscribers, error: subscribersError } = await supabase
      .from('subscriptions')
      .select('email')
      .eq('active', true)

    if (subscribersError) {
      return new Response(
        JSON.stringify({ error: 'Failed to fetch subscribers' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    if (!subscribers || subscribers.length === 0) {
      return new Response(JSON.stringify({ message: 'No subscribers' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Send emails via Resend
    const siteUrl = Deno.env.get('SITE_URL') || 'http://localhost:3000'
    const postUrl = `${siteUrl}/post/${post.slug}`

    const emailPromises = subscribers.map((sub) =>
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: RESEND_FROM_EMAIL,
          to: sub.email,
          subject: `Nouvel article : ${post.title}`,
          html: `
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
              </head>
              <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h1 style="color: #2563eb;">${post.title}</h1>
                ${post.excerpt ? `<p style="font-size: 1.1em; color: #666;">${post.excerpt}</p>` : ''}
                <p>Par ${post.profiles?.full_name || 'Auteur'}</p>
                <a href="${postUrl}" style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin-top: 20px;">
                  Lire l'article →
                </a>
                <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
                <p style="font-size: 0.9em; color: #999;">
                  Vous recevez cet email car vous êtes abonné à la newsletter de YouInc.
                </p>
              </body>
            </html>
          `,
        }),
      })
    )

    await Promise.all(emailPromises)

    return new Response(
      JSON.stringify({
        message: `Emails sent to ${subscribers.length} subscribers`,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Error sending newsletter:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to send newsletter' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
})

