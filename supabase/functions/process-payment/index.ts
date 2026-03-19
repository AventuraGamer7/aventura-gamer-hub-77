import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

interface CartItem {
  id: string
  name: string
  price: number
  image?: string
  type: 'product' | 'service' | 'course'
  quantity: number
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Crear cliente de Supabase
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Verificar autenticación
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
    
    if (authError || !user) {
      throw new Error('Usuario no autenticado')
    }

    // Obtener datos del request
    const requestData = await req.json()
    const { 
      token, 
      payment_method_id, 
      transaction_amount, 
      description, 
      external_reference,
      items,
      payer 
    } = requestData

    console.log('Processing payment for user:', user.email, 'Amount:', transaction_amount)

    // Obtener token de acceso de Mercado Pago
    const accessToken = Deno.env.get('MERCADO_PAGO_ACCESS_TOKEN')
    if (!accessToken) {
      throw new Error('Token de acceso de Mercado Pago no configurado')
    }

    // Preparar datos del pago para Mercado Pago
    const paymentData = {
      transaction_amount: parseFloat(transaction_amount),
      token: token,
      description: description,
      installments: 1,
      payment_method_id: payment_method_id,
      payer: {
        email: payer?.email || user.email,
        first_name: payer?.first_name || '',
        last_name: payer?.last_name || '',
        identification: payer?.identification || {}
      },
      external_reference: external_reference,
      notification_url: `${Deno.env.get('SUPABASE_URL')}/functions/v1/payment-webhook`,
      metadata: {
        user_id: user.id,
        items: JSON.stringify(items)
      }
    }

    console.log('Sending payment to Mercado Pago:', { 
      amount: paymentData.transaction_amount,
      payment_method: payment_method_id 
    })

    // Procesar pago con Mercado Pago
    const response = await fetch('https://api.mercadopago.com/v1/payments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'X-Idempotency-Key': `${user.id}-${Date.now()}` // Para evitar pagos duplicados
      },
      body: JSON.stringify(paymentData)
    })

    const paymentResult = await response.json()

    if (!response.ok) {
      console.error('Mercado Pago error:', paymentResult)
      throw new Error(paymentResult.message || 'Error procesando el pago')
    }

    console.log('Payment result:', {
      id: paymentResult.id,
      status: paymentResult.status,
      status_detail: paymentResult.status_detail
    })

    // Retornar resultado
    return new Response(
      JSON.stringify({
        id: paymentResult.id,
        status: paymentResult.status,
        status_detail: paymentResult.status_detail,
        amount: paymentResult.transaction_amount,
        payment_method: paymentResult.payment_method_id,
        external_reference: paymentResult.external_reference
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )

  } catch (error) {
    console.error('Error processing payment:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        status: 'error'
      }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})