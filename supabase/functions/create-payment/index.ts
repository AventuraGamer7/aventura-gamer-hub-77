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
      currency_id: 'COP'
    }))

    // Preparar datos para Checkout API (Payment Brick)
    const totalAmount = items.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    console.log('Preparing payment data for amount:', totalAmount)

    // Retornar información necesaria para inicializar Payment Brick
    return new Response(
      JSON.stringify({ 
        amount: totalAmount,
        description: `Compra de ${items.length} producto(s) - Aventura Gamer`,
        payer_email: user.email,
        external_reference: user.id,
        items: items
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