import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  // Reduced PII logging - only log essential non-sensitive details
  const safeDetails = details ? {
    ...details,
    // Remove potentially sensitive fields
    email: details.email ? '[REDACTED]' : undefined,
    sessionId: details.sessionId ? details.sessionId.substring(0, 8) + '...' : undefined,
  } : {};
  const detailsStr = Object.keys(safeDetails).length > 0 ? ` - ${JSON.stringify(safeDetails)}` : '';
  console.log(`[VERIFY-PAYMENT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    // SECURITY FIX: Now requires authentication since JWT verification is enabled
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Verify the user is authenticated
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user) throw new Error("User not authenticated");

    logStep("User authenticated", { userId: user.id });

    const { sessionId } = await req.json();
    logStep("Session ID received", { sessionId });

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Retrieve the checkout session
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    logStep("Stripe session retrieved", { 
      paymentStatus: session.payment_status,
      sessionStatus: session.status 
    });

    // Update order status based on payment status
    let orderStatus = "pending";
    if (session.payment_status === "paid") {
      orderStatus = "paid";
    } else if (session.payment_status === "unpaid") {
      orderStatus = "failed";
    }

    const { data: order, error: updateError } = await supabaseClient
      .from("orders")
      .update({ status: orderStatus })
      .eq("stripe_session_id", sessionId)
      .select()
      .single();

    if (updateError) throw updateError;
    logStep("Order status updated", { orderId: order.id, status: orderStatus });

    // If payment successful, clear user's cart
    if (orderStatus === "paid" && order.user_id) {
      const { error: cartError } = await supabaseClient
        .from("cart_items")
        .delete()
        .eq("user_id", order.user_id);

      if (cartError) {
        logStep("Warning: Failed to clear cart", { error: cartError });
      } else {
        logStep("Cart cleared successfully");
      }
    }

    return new Response(JSON.stringify({ 
      success: true,
      order,
      paymentStatus: session.payment_status 
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