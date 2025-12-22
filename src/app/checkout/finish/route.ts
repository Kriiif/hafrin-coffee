import { NextResponse } from "next/server";

// Handle client redirect from Midtrans after payment completion
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const params = Object.fromEntries(url.searchParams.entries());
    const order_id = (params as any).order_id || (params as any).orderId || (params as any).id || '';
    const transaction_status = (params as any).transaction_status || (params as any).transactionStatus || (params as any).status || '';

    const origin = url.origin;

    // Try to post the parameters to our server-side callback endpoint to ensure DB is up-to-date as soon as possible.
    try {
      const callbackUrl = `${origin}/api/midtrans/callback`;
      await fetch(callbackUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(url.searchParams.entries()))
      });
    } catch (e) {
      // Don't fail hard on this; the actual Midtrans server notification should still arrive.
      console.warn('Failed to POST internal Midtrans callback', e);
    }

    const successStatuses = ['capture', 'settlement'];

    if (transaction_status && successStatuses.includes(transaction_status)) {
      return NextResponse.redirect(`${origin}/Successpay?order_id=${encodeURIComponent(order_id)}`);
    }

    // Redirect to error page for non-success cases, include status for debugging
    return NextResponse.redirect(`${origin}/Errorpay?order_id=${encodeURIComponent(order_id)}&status=${encodeURIComponent(transaction_status)}`);
  } catch (err) {
    console.error('GET /checkout/finish error', err);
    return NextResponse.redirect('/Errorpay');
  }
}