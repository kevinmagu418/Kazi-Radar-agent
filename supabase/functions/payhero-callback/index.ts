import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

    const payload = await req.json()
    console.log('Received PayHero callback:', JSON.stringify(payload))

    // Normalize inconsistent payload formats
    const data = payload.response || payload.Result || payload

    const external_reference = data.external_reference
    const status = data.status // Assuming 'Success' or similar from PayHero
    const amount = data.amount
    const mpesa_receipt = data.mpesa_code || data.MpesaReceiptNumber || data.reference

    if (!external_reference) {
      console.error('Missing external_reference in callback payload')
      return new Response(JSON.stringify({ error: 'Missing external_reference' }), { status: 200 })
    }

    // Step 1: Find payment in payment_transactions table
    const { data: payment, error: findError } = await supabaseClient
      .from('payment_transactions')
      .select('*')
      .eq('provider_transaction_id', external_reference)
      .single()

    if (findError || !payment) {
      console.error('Payment NOT found for reference:', external_reference)
      return new Response(JSON.stringify({ message: 'Payment record not found' }), { status: 200 })
    }

    // Step 3: Idempotency protection
    if (payment.status === 'completed') {
      console.log('STOP: Payment already marked as completed (idempotency):', external_reference)
      return new Response(JSON.stringify({ message: 'Already processed' }), { status: 200 })
    }

    // Step 4: SUCCESS CASE
    const isSuccess = status?.toLowerCase() === 'success' || status?.toLowerCase() === 'completed'

    if (isSuccess) {
      // Update payment status to completed
      const { error: updateError } = await supabaseClient
        .from('payment_transactions')
        .update({ status: 'completed', provider_metadata: { ...payment.provider_metadata, mpesa_receipt } })
        .eq('provider_transaction_id', external_reference)

      if (updateError) {
        console.error('Failed to update payment status:', updateError)
        throw new Error('Database update failed')
      }

      const plan = payment.provider_metadata?.plan || 'flex'
      console.log(`Processing upgrade to tier ${plan} for user ${payment.user_id}`)

      // PROFILE UPGRADE
      const { error: profileError } = await supabaseClient
        .from('profiles')
        .update({ account_tier: plan, onboarding_completed: true })
        .eq('id', payment.user_id)

      if (profileError) {
        console.error('CRITICAL: Failed to update profile tier:', profileError)
      } else {
        console.log('Successfully updated profile tier to', plan)
      }

      // SUBSCRIPTION MANAGEMENT
      let current_period_end = new Date()
      if (plan === 'flex') current_period_end.setDate(current_period_end.getDate() + 5)
      else if (plan === 'monthly') current_period_end.setMonth(current_period_end.getMonth() + 1)
      else if (plan === 'quarterly') current_period_end.setMonth(current_period_end.getMonth() + 3)
      else current_period_end.setFullYear(current_period_end.getFullYear() + 1) // default

      // Check for existing active subscription
      const { data: existingSub } = await supabaseClient
        .from('subscriptions')
        .select('id')
        .eq('user_id', payment.user_id)
        .eq('status', 'active')
        .maybeSingle()

      let subError;
      if (existingSub) {
        // Update existing
        const { error } = await supabaseClient
          .from('subscriptions')
          .update({
            tier: plan,
            current_period_end: current_period_end.toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('id', existingSub.id)
        subError = error
      } else {
        // Create new
        const { error } = await supabaseClient
          .from('subscriptions')
          .insert({
            user_id: payment.user_id,
            tier: plan,
            status: 'active',
            current_period_end: current_period_end.toISOString()
          })
        subError = error
      }
        
      if (subError) {
        console.error('Failed to manage subscription record:', subError)
      } else {
        console.log('Successfully managed subscription record.')
      }

    } else {
      // FAILURE CASE
      console.log('Payment failed or cancelled for reference:', external_reference)
      await supabaseClient
        .from('payment_transactions')
        .update({ 
          status: 'failed',
          provider_metadata: { ...payment.provider_metadata, callback_payload: payload }
        })
        .eq('id', payment.id)
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('Error in payhero-callback:', error.message)
    // Always return 200 to acknowledge receipt of webhook and prevent retries
    return new Response(JSON.stringify({ error: error.message }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
