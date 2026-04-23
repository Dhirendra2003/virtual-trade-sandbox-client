import React, { useState } from 'react'
import { cn } from '@/lib/utils'
import { getUserStartingFunds, createPaymentIntentAction } from '@/pages/auth/actions'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { IndianRupee, Plus, Smartphone, CreditCard, Landmark, ShieldCheck, CheckCircle2, Loader2 } from 'lucide-react'
import PaymentMain from './PaymentMain'

const FormattedAmount = ({ amount, decimalClassName }) => {
  const safeAmount = amount || 0
  const [whole, decimal] = safeAmount.toLocaleString().split('.')

  return (
    <>
      ₹ {whole}
      <span className={cn('text-lg font-thin text-neutral-400', decimalClassName)}>.{decimal || '00'}</span>
    </>
  )
}

const PaymentBox = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['userStartingFunds'],
    queryFn: getUserStartingFunds,
    enabled: true,
  })
  const queryClient = useQueryClient()
  const [amount, setAmount] = useState(0)
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [clientSecret, setClientSecret] = useState(null)
  const [paymentLoading, setPaymentLoading] = useState(false)
  const [paymentError, setPaymentError] = useState(null)
  const [paymentSuccess, setPaymentSuccess] = useState(false)

  const quickAmounts = [1000000, 2000000, 3000000]

  const handleAddFunds = async () => {
    if (!amount || Number(amount) <= 0) return
    setPaymentLoading(true)
    setPaymentError(null)
    try {
      const data = await createPaymentIntentAction(Number(amount))
      setClientSecret(data.clientSecret)
    } catch (err) {
      setPaymentError(err?.response?.data?.error || 'Failed to initiate payment. Please try again.')
    } finally {
      setPaymentLoading(false)
    }
  }

  const handleSuccess = () => {
    setPaymentSuccess(true)
    setClientSecret(null)
    queryClient.invalidateQueries({ queryKey: ['userStartingFunds'] })
  }

  const handleCancel = () => {
    setClientSecret(null)
    setPaymentError(null)
  }

  // ── Success screen ──────────────────────────────────────────────────────────
  if (paymentSuccess) {
    return (
      <div className="glass-card p-6 rounded-2xl max-w-2xl mx-auto shadow-xl flex flex-col items-center justify-center gap-4 py-16">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle2 className="w-12 h-12 text-green-600" />
        </div>
        <h2 className="text-2xl font-black text-title-text-color">Funds Added!</h2>
        <p className="text-slate-500 text-sm">₹{Number(amount).toLocaleString()} has been added to your wallet.</p>
        <Button
          onClick={() => {
            setPaymentSuccess(false)
            setAmount(0)
          }}
          className="mt-4 rounded-xl bg-[#3d1466] hover:bg-[#2d0f4d] text-white font-bold px-8"
        >
          Add More Funds
        </Button>
      </div>
    )
  }

  return (
    <div className="glass-card p-6 space-y-6 rounded-2xl max-w-2xl mx-auto shadow-xl">
      <div className="flex justify-between items-center bg-slate-50/50 p-4 rounded-xl">
        <div>
          <h2 className="text-xl font-bold text-title-text-color">Add Funds to Wallet</h2>
          <p className="text-xs text-slate-400 mt-0.5 font-medium">Instant transfer to your trading account</p>
        </div>
        <div className="text-right">
          <p className="text-neutral-500 uppercase tracking-widest text-[10px] font-bold">Current Funds</p>
          <p className="text-2xl font-black text-green-700 tracking-tight">
            <FormattedAmount amount={data?.user?.actualFunds} decimalClassName="ml-[2px]" />
          </p>
        </div>
      </div>

      {/* ── If clientSecret received → show Stripe card form ── */}
      {clientSecret ? (
        <PaymentMain clientSecret={clientSecret} amount={amount} onSuccess={handleSuccess} onCancel={handleCancel} />
      ) : (
        <>
          <div className="space-y-4">
            {/* Quick Amounts */}
            <div className="flex w-fit gap-4">
              {quickAmounts.map(amt => (
                <button
                  key={amt}
                  onClick={() => setAmount(prev => Number(prev) + amt)}
                  className="flex-1 py-3 px-4 border-2 border-green-200 rounded-full text-green-600 font-bold bg-green-100/50 cursor-pointer transition-all text-center whitespace-nowrap hover:scale-105 hover:bg-green-200/50 active:scale-95 active:bg-green-300/50"
                >
                  + ₹ {amt.toLocaleString()}
                </button>
              ))}
            </div>

            {/* Input Field */}
            <div className="space-y-1.5">
              <label htmlFor="quantity" className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                Amount to be added
              </label>
              <div className="flex items-center bg-slate-100 p-2 rounded-2xl border-2 border-transparent focus-within:border-indigo-400 transition-all shadow-inner">
                <div className="p-2 bg-white rounded-xl shadow-sm">
                  <IndianRupee className="w-5 h-5 text-indigo-600" />
                </div>
                <Input
                  type="text"
                  inputMode="numeric"
                  value={amount}
                  onChange={e => {
                    const value = e.target.value
                    if (/^\d*$/.test(value)) {
                      setAmount(value)
                    }
                  }}
                  className="text-3xl font-bold bg-transparent border-none shadow-none outline-none focus-visible:ring-0 h-auto py-2 px-4"
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[2px]">
              Select Payment Method
            </label>

            <div className="grid grid-cols-2 gap-4">
              {/* UPI Method – coming soon */}
              <div
                className="relative flex items-center p-4 rounded-2xl border-2 cursor-not-allowed transition-all gap-3 border-slate-100 bg-slate-50/50 grayscale opacity-50"
                title="Coming soon"
              >
                <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center shadow-inner">
                  <Smartphone className="w-6 h-6 text-indigo-600" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-title-text-color leading-tight">UPI / GPay / PhonePe</h4>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Coming Soon</p>
                </div>
                <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center border-slate-300" />
              </div>

              {/* Cards Method */}
              <div
                onClick={() => setPaymentMethod('card')}
                className={cn(
                  'relative flex items-center p-4 rounded-2xl border-2 cursor-pointer transition-all gap-3',
                  paymentMethod === 'card'
                    ? 'border-indigo-500 bg-white'
                    : 'border-slate-100 bg-slate-50/50 grayscale opacity-70'
                )}
              >
                <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center shadow-inner">
                  <CreditCard className="w-6 h-6 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-title-text-color leading-tight">Credit / Debit Card</h4>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">VISA, Mastercard</p>
                </div>
                <div
                  className={cn(
                    'w-5 h-5 rounded-full border-2 flex items-center justify-center',
                    paymentMethod === 'card' ? 'border-indigo-500' : 'border-slate-300'
                  )}
                >
                  {paymentMethod === 'card' && <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full" />}
                </div>
              </div>
            </div>

            {/* Gateways info bar */}
            <div className="flex items-center justify-between px-6 py-4 bg-white border border-slate-100 rounded-xl shadow-sm">
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[2px]">Gateways</span>
                <div className="flex gap-3 items-center opacity-60">
                  <span className="text-sm font-black italic text-indigo-800">Razorpay</span>
                  <span className="text-sm font-bold text-slate-600">stripe</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 cursor-pointer transition-colors">
                <Landmark className="w-4 h-4" />
                <span className="text-xs font-bold">Net Banking</span>
              </div>
            </div>
          </div>

          <div className="pt-4 space-y-4">
            {paymentError && <p className="text-sm text-red-500 font-medium text-center">{paymentError}</p>}
            <Button
              onClick={handleAddFunds}
              disabled={paymentLoading || !amount || Number(amount) <= 0}
              className="w-full h-16 rounded-2xl shadow-xl shadow-indigo-200 bg-[#3d1466] hover:bg-[#2d0f4d] text-white font-bold text-xl gap-2 transition-all active:scale-[0.98] disabled:opacity-60"
            >
              {paymentLoading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" /> Preparing…
                </>
              ) : (
                <>
                  <Plus className="w-6 h-6" /> Add Funds
                </>
              )}
            </Button>

            <div className="flex items-center justify-center gap-6 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              <div className="flex items-center gap-1.5 bg-green-50 text-green-600 px-3 py-1.5 rounded-full">
                <ShieldCheck className="w-3.5 h-3.5" />
                Safe and Secure
              </div>
              <div className="flex items-center gap-2">256-Bit SSL Encryption</div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default PaymentBox
