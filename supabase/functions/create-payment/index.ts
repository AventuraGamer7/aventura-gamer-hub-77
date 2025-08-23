import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  type: 'product' | 'service' | 'course';
  quantity: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get the session from the Authorization header
    const {
      data: { user },
    } = await supabaseClient.auth.getUser()

    if (!user) {
      throw new Error('Usuario no autenticado')
    }

    const { items }: { items: CartItem[] } = await req.json()

    if (!items || items.length === 0) {
      throw new Error('No hay items en el carrito')
    }

    const accessToken = Deno.env.get('MERCADO_PAGO_ACCESS_TOKEN')
    if (!accessToken) {
      throw new Error('Token de Mercado Pago no configurado')
    }

    // Crear los items para Mercado Pago
    const mpItems = items.map(item => ({
      title: item.name,
      quantity: item.quantity,
      unit_price: item.price,
      currency_id: 'ARS'
    }))

    // Crear preferencia en Mercado Pago
    const preference = {
      items: mpItems,
      payer: {
        email: user.email
      },
      back_urls: {
        success: `${req.headers.get('origin')}/payment/success`,
        failure: `${req.headers.get('origin')}/payment/failure`,
        pending: `${req.headers.get('origin')}/payment/pending`
      },
      auto_return: 'approved',
      external_reference: user.id, // Para identificar al usuario
      notification_url: `${Deno.env.get('SUPABASE_URL')}/functions/v1/payment-webhook`
    }

    console.log('Creating preference with items:', mpItems)

    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(preference)
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('MercadoPago API error:', errorText)
      throw new Error(`Error de Mercado Pago: ${response.status}`)
    }

    const data = await response.json()
    console.log('MercadoPago preference created:', data.id)

    return new Response(
      JSON.stringify({ 
        preference_id: data.id,
        init_point: data.init_point 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Error creating payment:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})