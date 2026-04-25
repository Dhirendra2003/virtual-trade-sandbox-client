import { useState, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

import SearchBar from '../../components/dashboard/SearchBar'
import PhotoUpload from '@/components/photo-upload'
import { setUser, setUserPreferences } from '@/store/slices/authSlice'
import {
  resetPasswordAction,
  updateProfilePictureAction,
  updateDisplayNameAction,
  updatePreferencesAction,
} from '@/pages/auth/actions'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import {
  Bell,
  Palette,
  Lock,
  Camera,
  CandlestickChart,
  TrendingUp,
  X,
  Check,
  ShieldCheck,
  Mail,
  RefreshCw,
  Pencil,
  Loader2,
  Upload,
  SunMedium,
  Moon,
  Activity,
  Clock,
} from 'lucide-react'

// ─── Sub-components ───────────────────────────────────────────────────────────

const ThemeToggle = ({ value, onChange }) => (
  <div className="flex items-center gap-1 bg-div-bg-color rounded-xl p-1 w-fit border-2">
    {['Light', 'Dark'].map(mode => (
      <button
        key={mode}
        onClick={() => onChange(mode.toLowerCase())}
        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex justify-center items-center gap-2  ${
          value === mode.toLowerCase()
            ? 'bg-selected-bg-purple text-title-text-color shadow-sm'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        {mode === 'Dark' ? <Moon /> : <SunMedium />}
        {mode}
      </button>
    ))}
  </div>
)

const ChartTypeToggle = ({ value, onChange }) => (
  <div className="flex items-center gap-1  rounded-xl p-1 w-full bg-div-bg-color border-2">
    {[
      { key: 'candlestick', icon: <CandlestickChart size={20} />, label: 'Candlestick' },
      { key: 'line', icon: <TrendingUp size={20} />, label: 'Line' },
    ].map(({ key, icon, label }) => (
      <button
        key={key}
        onClick={() => onChange(key)}
        className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
          value === key ? 'bg-selected-bg-purple text-title-text-color shadow-sm' : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        {icon}
        {label}
      </button>
    ))}
  </div>
)

const NotificationRow = ({ icon, label, description, checked, onToggle, type = 'toggle' }) => (
  <div className="flex items-center justify-between py-3">
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-xl bg-div-bg-color flex items-center justify-center shrink-0">{icon}</div>
      <div>
        <p className="text-sm font-semibold text-title-text-color">{label}</p>
        {description && <p className="text-xs text-slate-500">{description}</p>}
      </div>
    </div>
    {type === 'toggle' ? (
      <Switch checked={checked} onCheckedChange={onToggle} className="data-[state=checked]:bg-violet-600" />
    ) : (
      <Checkbox
        checked={checked}
        onCheckedChange={onToggle}
        className="data-[state=checked]:bg-violet-600 data-[state=checked]:border-violet-600 rounded"
      />
    )}
  </div>
)

// ─── Change Password Dialog ───────────────────────────────────────────────────
const ChangePasswordDialog = ({ open, onOpenChange }) => {
  const [form, setForm] = useState({ current: '', next: '', repeat: '' })

  const { mutate, isPending } = useMutation({
    mutationFn: resetPasswordAction,
    onSuccess: data => {
      toast.success(data.message)
      onOpenChange(false)
      setForm({ current: '', next: '', repeat: '' })
    },
    onError: err => {
      toast.error(err?.response?.data?.message || 'Password update failed')
    },
  })

  const handleSubmit = () => {
    if (!form.current || !form.next || !form.repeat) {
      toast.error('Please fill all fields')
      return
    }
    if (form.next !== form.repeat) {
      toast.error('Passwords do not match')
      return
    }
    if (form.next.length < 8) {
      toast.error('New password must be at least 8 characters')
      return
    }
    mutate({ oldPassword: form.current, newPassword: form.next })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-2xl glass-card">
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-2">
          {[
            { label: 'Current Password', key: 'current' },
            { label: 'New Password', key: 'next' },
            { label: 'Repeat New Password', key: 'repeat' },
          ].map(({ label, key }) => (
            <div key={key} className="flex flex-col gap-1.5">
              <Label className="text-sm">{label}</Label>
              <Input
                className="bg-white"
                type="password"
                placeholder="••••••••"
                value={form[key]}
                onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
              />
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
            Cancel
          </Button>
          <Button className="primary-gradient text-white" onClick={handleSubmit} disabled={isPending}>
            {isPending ? <Loader2 size={14} className="animate-spin mr-1" /> : <Check size={14} className="mr-1" />}
            {isPending ? 'Saving…' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ─── Editable Name ────────────────────────────────────────────────────────────
const EditableName = ({ initialName }) => {
  const dispatch = useDispatch()
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(initialName || '')

  const { mutate, isPending } = useMutation({
    mutationFn: updateDisplayNameAction,
    onSuccess: data => {
      dispatch(setUser(data.user))
      toast.success(data.message)
      setEditing(false)
    },
    onError: err => {
      toast.error(err?.response?.data?.message || 'Failed to update name')
    },
  })

  const handleSave = () => {
    if (name.trim().length < 2) {
      toast.error('Name must be at least 2 characters')
      return
    }
    mutate(name.trim())
  }

  if (editing) {
    return (
      <div className="flex items-center gap-2 mt-1">
        <Input
          autoFocus
          value={name}
          onChange={e => setName(e.target.value)}
          className="h-8 text-sm text-center font-bold w-40 bg-white"
          onKeyDown={e => {
            if (e.key === 'Enter') handleSave()
            if (e.key === 'Escape') setEditing(false)
          }}
        />
        <button
          onClick={handleSave}
          disabled={isPending}
          className="w-7 h-7 rounded-full bg-violet-600 hover:bg-violet-700 text-white flex items-center justify-center transition-colors"
        >
          {isPending ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
        </button>
        <button
          onClick={() => {
            setName(initialName || '')
            setEditing(false)
          }}
          className="w-7 h-7 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-600 flex items-center justify-center transition-colors"
        >
          <X size={12} />
        </button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 mt-1">
      <h2 className="text-lg font-bold text-title-text-color capitalize">{initialName || 'User Name'}</h2>
      <button
        onClick={() => setEditing(true)}
        className="w-6 h-6 rounded-full hover:bg-gray-100 text-gray-400 hover:text-violet-600 flex items-center justify-center transition-colors"
        title="Edit name"
      >
        <Pencil size={13} />
      </button>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
// Default preferences — used as fallback when Redux has nothing stored yet
const DEFAULT_PREFERENCES = {
  theme: 'light',
  chartType: 'candlestick',
  chartInterval: '5m',
  notifications: { tradeExecuted: true, amoExecuted: true, appUpdates: false },
  emailSummary: { monthlySummary: true, newUpdates: false },
}

const Profile = () => {
  const { user, userPreferences } = useSelector(state => state.auth)
  const dispatch = useDispatch()

  // Resolved starting values — prefer stored Redux prefs, fall back to defaults
  const prefs = { ...DEFAULT_PREFERENCES, ...userPreferences }

  // Profile photo state
  const [pfp, setPfp] = useState(null)
  const [croppedPfp, setCroppedPfp] = useState(null)
  const [cropperOpen, setCropperOpen] = useState(false)
  const pfpInputRef = useRef(null)

  // Change-password dialog
  const [pwDialogOpen, setPwDialogOpen] = useState(false)

  // Appearance settings — initialised from Redux, persisted back on change
  const [theme, setThemeLocal] = useState(prefs.theme)
  const [chartType, setChartTypeLocal] = useState(prefs.chartType)
  const [chartInterval, setChartIntervalLocal] = useState(prefs.chartInterval)

  // Notification toggles — also persisted in Redux
  const [notifications, setNotifications] = useState(prefs.notifications)
  const [emailSummary, setEmailSummary] = useState(prefs.emailSummary)

  // ── Persistence mutation ───────────────────────────────────────────────────
  const { mutate: updatePrefsMutation } = useMutation({
    mutationFn: updatePreferencesAction,
    onSuccess: data => {
      // Sync with user object if needed (handled by setUserPreferences already)
      // dispatch(setUser(data.user))
    },
    onError: err => {
      toast.error('Failed to save preferences to cloud')
    },
  })

  // ── Helpers that update local state AND Redux/API in one call ──────────────
  const persistPrefs = patch => {
    const updatedPrefs = { ...prefs, theme, chartType, chartInterval, notifications, emailSummary, ...patch }
    dispatch(setUserPreferences(updatedPrefs))
    updatePrefsMutation(updatedPrefs)
  }

  const setTheme = val => {
    setThemeLocal(val)
    persistPrefs({ theme: val })
  }
  const setChartType = val => {
    setChartTypeLocal(val)
    persistPrefs({ chartType: val })
  }
  const setChartInterval = val => {
    setChartIntervalLocal(val)
    persistPrefs({ chartInterval: val })
  }

  const toggleNotif = key => {
    const updated = { ...notifications, [key]: !notifications[key] }
    setNotifications(updated)
    persistPrefs({ notifications: updated })
  }
  const toggleEmail = key => {
    const updated = { ...emailSummary, [key]: !emailSummary[key] }
    setEmailSummary(updated)
    persistPrefs({ emailSummary: updated })
  }

  // ── Upload profile picture mutation ────────────────────────────────────────
  const { mutate: uploadPfp, isPending: isUploadingPfp } = useMutation({
    mutationFn: updateProfilePictureAction,
    onSuccess: data => {
      dispatch(setUser(data.user))
      toast.success(data.message)
      // clear local preview
      setPfp(null)
      setCroppedPfp(null)
      if (pfpInputRef.current) pfpInputRef.current.value = ''
    },
    onError: err => {
      toast.error(err?.response?.data?.message || 'Failed to update profile picture')
    },
  })

  const handleConfirmUpload = () => {
    if (croppedPfp?.blob) {
      uploadPfp(croppedPfp.blob)
    }
  }

  const handleDiscardUpload = () => {
    setPfp(null)
    setCroppedPfp(null)
    if (pfpInputRef.current) pfpInputRef.current.value = ''
  }

  // Resolved avatar: new crop preview > existing profile pic > fallback
  const avatarSrc = croppedPfp?.url || user?.profilePicURL || 'https://github.com/shadcn.png'

  return (
    <div className="p-2 space-y-4">
      {/* Sticky Search Bar */}
      <div className="search-bar">
        <SearchBar />
      </div>

      {/* Page heading */}
      <div className="px-1 pt-2">
        <h1 className="text-xl font-bold text-sub-title-text-color">Account Settings</h1>
        <p className="text-xs text-slate-400 mt-0.5">Manage your trading preferences and security profile.</p>
      </div>

      {/* Two-column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-4 items-start">
        {/* ── LEFT COLUMN ─────────────────────────────────────── */}
        <div className="flex flex-col gap-4">
          {/* Profile Card */}
          <Card className="rounded-2xl border border-gray-100 shadow-sm glass-card">
            <CardContent className="flex flex-col items-center gap-3 pt-6 pb-6">
              {/* Avatar */}
              <div className="relative w-28 h-28">
                <img
                  src={avatarSrc}
                  alt="Profile"
                  className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-md"
                />
                {/* Verified badge */}
                <div className="absolute bottom-1 right-1 w-7 h-7 bg-violet-600 rounded-full flex items-center justify-center border-2 border-white">
                  <ShieldCheck size={14} className="text-white" />
                </div>
                {/* Camera hover overlay — only when no pending crop */}
                {!croppedPfp && (
                  <button
                    onClick={() => pfpInputRef.current?.click()}
                    className="absolute inset-0 rounded-full bg-black/30 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center"
                    title="Change photo"
                  >
                    <Camera size={24} className="text-white" />
                  </button>
                )}
                {/* Hidden file input */}
                <input
                  ref={pfpInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={e => {
                    if (e.target.files[0]) {
                      setPfp(e.target.files[0])
                      setCropperOpen(true)
                    }
                  }}
                />
              </div>

              {/* ── Upload confirmation strip (appears after crop) ── */}
              {croppedPfp && (
                <div className="flex items-center gap-2 bg-violet-50 border border-violet-200 rounded-xl px-4 py-2 text-sm">
                  <span className="text-violet-700 font-medium">New photo ready</span>
                  <button
                    onClick={handleConfirmUpload}
                    disabled={isUploadingPfp}
                    className="flex items-center gap-1 bg-violet-600 hover:bg-violet-700 disabled:opacity-60 text-white rounded-lg px-3 py-1 transition-colors text-xs font-semibold"
                  >
                    {isUploadingPfp ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
                    {isUploadingPfp ? 'Uploading…' : 'Upload'}
                  </button>
                  <button
                    onClick={handleDiscardUpload}
                    disabled={isUploadingPfp}
                    className="flex items-center gap-1 text-gray-500 hover:text-red-500 transition-colors text-xs"
                  >
                    <X size={12} /> Discard
                  </button>
                </div>
              )}

              {/* Name (editable) + email */}
              <div className="text-center flex flex-col items-center">
                <EditableName initialName={user?.name} />
                <p className="text-sm text-slate-500">{user?.email || 'user@example.com'}</p>
              </div>

              <Button
                className="w-full primary-gradient text-white rounded-xl py-5 cursor-pointer"
                onClick={() => setPwDialogOpen(true)}
              >
                <Lock size={15} className="mr-2" />
                Change Password
              </Button>
            </CardContent>
          </Card>

          {/* Appearance Card */}
          <Card className="rounded-2xl border border-gray-100 shadow-sm glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <Palette size={18} className="text-violet-600" />
                Appearance
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <div>
                  <p className="text-sm font-semibold text-sub-title-text-color">Theme Mode</p>
                  <p className="text-xs text-slate-500">Switch between light and dark</p>
                </div>
                <ThemeToggle value={theme} onChange={setTheme} />
              </div>

              <Separator />

              <div className="flex flex-col gap-2">
                <p className="text-sm font-semibold text-sub-title-text-color">Default Chart Type</p>
                <ChartTypeToggle value={chartType} onChange={setChartType} />
              </div>

              <Separator />

              <div className="flex flex-col gap-2">
                <p className="text-sm font-semibold text-sub-title-text-color">Default Chart Interval</p>
                <Select value={chartInterval} onValueChange={setChartInterval}>
                  <SelectTrigger className="rounded-xl bg-white border-gray-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {['1m', '5m', '15m', '30m', '1h'].map(i => (
                      <SelectItem key={i} value={i}>
                        {i}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ── RIGHT COLUMN ─────────────────────────────────────── */}
        <Card className="rounded-2xl border border-gray-100 shadow-sm glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Bell size={18} className="text-violet-600" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-1">
            <p className="text-[11px] font-bold tracking-widest text-slate-400 uppercase mb-1">Trading Alerts</p>

            <NotificationRow
              icon={<Activity size={18} className="text-emerald-500" />}
              label="Trade Executed / Failed"
              description="Real-time confirmation of your trades"
              checked={notifications.tradeExecuted}
              onToggle={() => toggleNotif('tradeExecuted')}
            />
            <Separator />

            <NotificationRow
              icon={<Clock size={18} className="text-amber-500" />}
              label="AMO Executed / Intraday Trade Square Off"
              description="Notification when after-market orders / intraday trades are  squared off"
              checked={notifications.amoExecuted}
              onToggle={() => toggleNotif('amoExecuted')}
            />
            <Separator />

            <NotificationRow
              icon={<Bell size={18} className="text-violet-400" />}
              label="App Updates"
              description="New features and maintenance announcements"
              checked={notifications.appUpdates}
              onToggle={() => toggleNotif('appUpdates')}
            />

            <p className="text-[11px] font-bold tracking-widest text-slate-400 uppercase mt-4 mb-1">Email Summary</p>

            <NotificationRow
              icon={<Mail size={16} className="text-slate-500" />}
              label="Monthly summary"
              description=""
              checked={emailSummary.monthlySummary}
              onToggle={() => toggleEmail('monthlySummary')}
              type="checkbox"
            />
            <Separator />

            <NotificationRow
              icon={<RefreshCw size={16} className="text-slate-500" />}
              label="New updates"
              description=""
              checked={emailSummary.newUpdates}
              onToggle={() => toggleEmail('newUpdates')}
              type="checkbox"
            />

            {/* Coming Soon Banner */}
            <div className="relative mt-6 rounded-2xl bg-[#2d2d6b] p-5 overflow-hidden">
              <Bell size={80} className="absolute -right-3 -bottom-4 text-white/10" strokeWidth={1.5} />
              <p className="text-[10px] font-bold tracking-widest text-white/50 uppercase mb-2">Coming Soon</p>
              <h3 className="text-white font-bold text-lg">Price Alerts</h3>
              <p className="text-white/60 text-xs mt-1">Be the first to know when your favorite stocks hit targets.</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Change Password Dialog */}
      <ChangePasswordDialog open={pwDialogOpen} onOpenChange={setPwDialogOpen} />

      {/* Photo Cropper Portal */}
      {pfp &&
        cropperOpen &&
        createPortal(
          <PhotoUpload
            image={URL.createObjectURL(pfp)}
            setCropperOpen={setCropperOpen}
            setCroppedPfp={setCroppedPfp}
          />,
          document.body
        )}
    </div>
  )
}

export default Profile
