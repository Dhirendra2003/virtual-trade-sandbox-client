import { useState } from 'react'
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js'
import { Button } from '@/components/ui/button'
import { ShieldCheck, Loader2 } from 'lucide-react'
import { confirmPaymentAction } from '@/pages/auth/actions'

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '16px',
      color: '#1e293b',
      fontFamily: '"Inter", sans-serif',
      '::placeholder': { color: '#94a3b8' },
    },
    invalid: { color: '#ef4444' },
  },
  hidePostalCode: true,
}

/**
 * PaymentMain – rendered inside PaymentBox after a clientSecret is received.
 * MUST be mounted inside a Stripe <Elements> provider (handled in Router.jsx).
 *
 * Props:
 *  - clientSecret  : string  – from /payment/create-payment-intent
 *  - amount        : number  – in rupees, for display purposes
 *  - onSuccess     : fn()    – called after successful payment confirmation
 *  - onCancel      : fn()    – called when user cancels
 */
const PaymentMain = ({ clientSecret, amount, onSuccess, onCancel }) => {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handlePayment = async (e) => {
    e.preventDefault()
    if (!stripe || !elements) return

    setLoading(true)
    setError(null)

    // Step 1: Confirm card with Stripe
    const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    })

    if (stripeError) {
      setError(stripeError.message)
      setLoading(false)
      return
    }

    if (paymentIntent?.status === 'succeeded') {
      // Step 2: Tell our backend to verify & credit actualFunds
      try {
        await confirmPaymentAction(paymentIntent.id)
        onSuccess?.()
      } catch (err) {
        // Payment went through on Stripe but our backend failed to credit —
        // show a specific message so the user can contact support with the ID
        setError(
          `Payment received (ID: ${paymentIntent.id}) but wallet credit failed. Please contact support.`
        )
      }
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handlePayment} className="space-y-4">
      <div>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Card Details</p>
        <div className="p-4 bg-slate-100 rounded-2xl border-2 border-transparent focus-within:border-indigo-400 transition-all">
          <CardElement options={CARD_ELEMENT_OPTIONS} />
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-500 font-medium px-1">{error}</p>
      )}

      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1 h-12 rounded-xl font-semibold"
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={!stripe || loading}
          className="flex-1 h-12 rounded-xl bg-[#3d1466] hover:bg-[#2d0f4d] text-white font-bold gap-2 transition-all active:scale-[0.98]"
        >
          {loading ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Processing…</>
          ) : (
            <>Pay ₹{Number(amount).toLocaleString()}</>
          )}
        </Button>
      </div>

      <div className="flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
        <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
        Secured by Stripe · 256-bit SSL
      </div>
    </form>
  )
}

export default PaymentMain
