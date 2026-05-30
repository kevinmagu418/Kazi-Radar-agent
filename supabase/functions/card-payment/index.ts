import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

/**
 * ABSTRACT CARD PAYMENT PROCESSOR
 * This is designed to be swappable with Stripe, Flutterwave, etc.
 */
async function processCardPayment(amount: number, user: any, metadata: any) {
  // LOGIC: Call external provider API here
  console.log(`[Abstract] Processing card payment for User: ${user.id}, Amount: ${amount}`)
  
  // MOCK SUCCESS for prototype/structure validation
  return {
    success: true,
    provider_reference: `CARD-${Date.now()}-${user.id.slice(0,4)}`,
    message: 'Card payment initiated successfully'
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Authenticate user
    const authHeader = req.headers.get('Authorization')
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(
      authHeader?.replace('Bearer ', '') ?? ''
    )

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const { amount, ...restMetadata } = await req.json()
    if (!amount) {
      return new Response(JSON.stringify({ error: 'amount is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Generate reference
    const timestamp = Date.now()
    const externalReference = `CRD-${timestamp}-${user.id.slice(0, 8)}`

    // Insert into payment_transactions
    const { error: dbError } = await supabaseClient
      .from('payment_transactions')
      .insert({
        user_id: user.id,
        amount: amount,
        provider_transaction_id: externalReference,
        status: 'pending',
        payment_method: 'card',
        provider_metadata: restMetadata
      })

    if (dbError) throw dbError

    // Call abstract processor
    const result = await processCardPayment(amount, user, restMetadata)

    if (result.success) {
      return new Response(JSON.stringify({
        success: true,
        reference: externalReference,
        provider_data: result
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    } else {
      return new Response(JSON.stringify({ success: false, error: 'Payment failed' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

  } catch (error) {
    console.error('Error in card-payment:', error.message)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
