import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-CHECKOUT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated");

    logStep("User authenticated", { userId: user.id, email: user.email });

    const { items, customerInfo } = await req.json();
    logStep("Request data received", { itemsCount: items.length, customerInfo });

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Check if customer exists
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      logStep("Existing customer found", { customerId });
    } else {
      const customer = await stripe.customers.create({
        email: user.email,
        name: `${customerInfo.firstName} ${customerInfo.lastName}`,
        phone: customerInfo.phone,
        address: {
          line1: customerInfo.address,
          city: customerInfo.city,
          state: customerInfo.state,
          postal_code: customerInfo.zipCode,
          country: 'NG',
        },
      });
      customerId = customer.id;
      logStep("New customer created", { customerId });
    }

    // Calculate total amount in kobo (Nigerian cents)
    const totalAmount = items.reduce((total: number, item: any) => {
      return total + (item.price * item.quantity * 100); // Convert to kobo
    }, 0);

    logStep("Total calculated", { totalAmount, currency: 'NGN' });

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: items.map((item: any) => ({
        price_data: {
          currency: "ngn",
          product_data: {
            name: item.name,
            description: item.description,
          },
          unit_amount: item.price * 100, // Convert to kobo
        },
        quantity: item.quantity,
      })),
      mode: "payment",
      success_url: `${req.headers.get("origin")}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/checkout/cancel`,
      metadata: {
        user_id: user.id,
        customer_info: JSON.stringify(customerInfo),
      },
    });

    logStep("Stripe session created", { sessionId: session.id, url: session.url });

    // Create order in database
    const { data: order, error: orderError } = await supabaseClient
      .from("orders")
      .insert({
        user_id: user.id,
        total_amount: totalAmount / 100, // Convert back to Naira
        status: "pending",
        stripe_session_id: session.id,
      })
      .select()
      .single();

    if (orderError) throw orderError;
    logStep("Order created in database", { orderId: order.id });

    // Create order items
    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      product_id: item.id,
      quantity: item.quantity,
      price: item.price,
    }));

    const { error: itemsError } = await supabaseClient
      .from("order_items")
      .insert(orderItems);

    if (itemsError) throw itemsError;
    logStep("Order items created", { itemsCount: orderItems.length });

    return new Response(JSON.stringify({ 
      url: session.url,
      orderId: order.id 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});