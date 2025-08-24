import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    const body = await req.json()
    console.log('Webhook received:', body)

    // Verificar si es una notificación de pago
    if (body.type === 'payment') {
      const paymentId = body.data.id
      const accessToken = Deno.env.get('MERCADO_PAGO_ACCESS_TOKEN')

      if (!accessToken) {
        throw new Error('Token de Mercado Pago no configurado')
      }

      // Obtener información del pago desde Mercado Pago
      const paymentResponse = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      })

      if (!paymentResponse.ok) {
        throw new Error('Error al obtener información del pago')
      }

      const payment = await paymentResponse.json()
      console.log('Payment info:', payment)

      // Si el pago fue aprobado, crear la orden en la base de datos
      if (payment.status === 'approved') {
        const userId = payment.external_reference

        // Crear registro de orden - usando crypto.randomUUID() para generar UUID válido
        const { error: orderError } = await supabaseClient
          .from('orders')
          .insert({
            user_id: userId,
            item_id: crypto.randomUUID(), // Generamos un UUID válido
            item_type: 'payment', // Indicamos que es un pago de Mercado Pago
            quantity: 1,
            total_price: payment.transaction_amount
          })

        if (orderError) {
          console.error('Error creating order:', orderError)
          throw orderError
        }

        console.log('Order created successfully for user:', userId)
      }
    }

    return new Response(
      JSON.stringify({ success: true }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Webhook error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})