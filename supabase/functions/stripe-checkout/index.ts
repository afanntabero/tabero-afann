// @ts-nocheck
import Stripe from "https://esm.sh/stripe@16.12.0";
import { createClient as supabaseClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface CheckoutItem {
  product_id: string;
  product_title: string;
  quantity: number;
  unit_price: number;
  selected_variant: string;
  category: string;
  file_url: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 200, headers: corsHeaders });

  try {
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
      apiVersion: "2024-06-20",
    });

    const supabase = supabaseClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const body = await req.json();
    const items: CheckoutItem[] = body.items;
    const customerEmail: string = body.customer_email;
    const fullName: string = body.full_name || "";
    const shipping = body.shipping;
    const orderType: string = body.order_type;
    const currency: string = body.currency || "EUR";

    const origin = req.headers.get("origin") || "https://bolt.new";

    let customerId: string | null = null;
    const { data: existingCustomer } = await supabase
      .from("customers")
      .select("id")
      .eq("email", customerEmail)
      .maybeSingle();

    if (existingCustomer) {
      customerId = existingCustomer.id;
    } else {
      const { data: newCustomer } = await supabase
        .from("customers")
        .insert({ 
          email: customerEmail, 
          full_name: fullName, 
          address: shipping?.address || "", 
          city: shipping?.city || "", 
          country: shipping?.country || "", 
          postal_code: shipping?.postal_code || "" 
        })
        .select()
        .single();
      if (newCustomer) customerId = newCustomer.id;
    }

    const totalAmount = items.reduce((sum, i) => sum + i.unit_price * i.quantity, 0);
    const deliveryStatus = orderType === "digital" ? "not_applicable" : "pending";

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        customer_id: customerId,
        customer_email: customerEmail,
        total_amount: totalAmount,
        currency,
        payment_status: "pending",
        delivery_status: deliveryStatus,
        order_type: orderType,
        stripe_session_id: "",
        shipping_full_name: shipping?.full_name || "",
        shipping_address: shipping?.address || "",
        shipping_city: shipping?.city || "",
        shipping_country: shipping?.country || "",
        shipping_postal_code: shipping?.postal_code || "",
      })
      .select()
      .single();

    if (orderError) throw new Error(orderError.message);

    const orderItems = items.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      product_title: item.product_title,
      quantity: item.quantity,
      unit_price: item.unit_price,
      selected_variant: item.selected_variant,
      has_download_access: item.category === "digital",
      download_url: item.category === "digital" ? item.file_url : "",
    }));

    await supabase.from("order_items").insert(orderItems);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: customerEmail,
      line_items: items.map((item) => ({
        price_data: {
          currency: currency.toLowerCase(),
          product_data: { name: item.product_title + (item.selected_variant ? ` (${item.selected_variant})` : "") },
          unit_amount: Math.round(item.unit_price * 100),
        },
        quantity: item.quantity,
      })),
      success_url: `${origin}/store?status=success&session_id={CHECKOUT_SESSION_ID}&order=${order.id}`,
      cancel_url: `${origin}/store?status=cancelled`,
      metadata: { order_id: order.id, customer_email: customerEmail },
    });

    await supabase.from("orders").update({ stripe_session_id: session.id }).eq("id", order.id);

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});