import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { 
      status: 200,
      headers: corsHeaders 
    })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Authenticate user
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'No authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Input validation
    let { phoneNumber, amount, plan } = await req.json()
    if (!phoneNumber || !amount || !plan) {
      return new Response(JSON.stringify({ error: 'phoneNumber, amount, and plan are required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Normalize phone number to 254XXXXXXXXX
    phoneNumber = phoneNumber.toString().replace(/\D/g, '')
    if (phoneNumber.startsWith('0')) {
      phoneNumber = '254' + phoneNumber.slice(1)
    } else if (phoneNumber.startsWith('7') || phoneNumber.startsWith('1')) {
      phoneNumber = '254' + phoneNumber
    } else if (phoneNumber.startsWith('+')) {
      phoneNumber = phoneNumber.slice(1)
    }
    
    if (phoneNumber.length !== 12) {
      return new Response(JSON.stringify({ error: 'Invalid Kenyan phone number format. Use 07... or 254...' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Generate external reference
    const timestamp = Date.now()
    const externalReference = `PAY-${timestamp}-${user.id.slice(0, 8)}`

    // Insert into payment_transactions
    const { data: paymentRecord, error: dbError } = await supabaseClient
      .from('payment_transactions')
      .insert({
        user_id: user.id,
        amount: amount,
        payment_method: 'mpesa',
        provider_transaction_id: externalReference,
        status: 'pending',
        provider_metadata: { phone_number: phoneNumber, plan: plan }
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      throw new Error('Failed to create payment record')
    }

    // PayHero Integration
    const authToken = Deno.env.get('PAYHERO_AUTH_TOKEN')
    const username = Deno.env.get('PAYHERO_API_USERNAME')
    const password = Deno.env.get('PAYHERO_API_PASSWORD')
    const channelId = Deno.env.get('PAYHERO_CHANNEL_ID')
    
    // Use the pre-encoded token if available, otherwise build it
    const payheroAuth = authToken || `Basic ${btoa(`${username}:${password}`)}`
    
    console.log(`Auth Check - Token Available: ${!!authToken}, Channel ID: ${channelId}`)

    if ((!authToken && (!username || !password)) || !channelId) {
      throw new Error('PayHero configuration missing (Auth Token or Credentials, and Channel ID)')
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const callbackUrl = `${supabaseUrl}/functions/v1/payhero-callback`

    const payheroPayload = {
      amount: parseFloat(amount.toString()),
      phone_number: phoneNumber,
      channel_id: parseInt(channelId), 
      provider: "m-pesa",
      external_reference: externalReference,
      callback_url: callbackUrl
    }

    const payheroResponse = await fetch('https://backend.payhero.co.ke/api/v2/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': payheroAuth
      },
      body: JSON.stringify(payheroPayload)
    })

    const payheroData = await payheroResponse.json()

    console.log('PayHero response:', payheroData)

    return new Response(JSON.stringify({
      success: payheroData.success,
      transaction_id: paymentRecord.id,
      reference: externalReference,
      payhero_response: payheroData
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('Error in payhero-stk:', error.message)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
