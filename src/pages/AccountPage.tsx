import { useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import { USERS_MAP } from '@/data/users'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Breadcrumb } from '@/components/ui/Breadcrumb'

// ─── Types ────────────────────────────────────────────────────────────────────

type Tab = 'profile' | 'security' | 'orders' | 'addresses'

interface ProfileForm {
  firstName: string
  lastName: string
  email: string
}

interface ProfileErrors {
  firstName?: string
  lastName?: string
  email?: string
}

interface PasswordForm {
  current: string
  next: string
  confirm: string
}

interface PasswordErrors {
  current?: string
  next?: string
  confirm?: string
}

interface Address {
  street: string
  city: string
  postalCode: string
  country: string
}

interface Order {
  id: string
  date: string
  items: string
  status: 'Livré' | 'En cours' | 'Remboursé'
  total: string
}

// ─── Static data ──────────────────────────────────────────────────────────────

const FAKE_ORDERS: Order[] = [
  {
    id: 'SL-20241201-001',
    date: '01/12/2024',
    items: 'Sauce Labs Backpack, Sauce Labs Bike Light',
    status: 'Livré',
    total: '77,98 €',
  },
  {
    id: 'SL-20250115-002',
    date: '15/01/2025',
    items: 'Sauce Labs Bolt T-Shirt',
    status: 'Livré',
    total: '19,99 €',
  },
  {
    id: 'SL-20250301-003',
    date: '01/03/2025',
    items: 'Noise-Cancelling Headphones, Mechanical Keyboard',
    status: 'En cours',
    total: '399,98 €',
  },
  {
    id: 'SL-20250410-004',
    date: '10/04/2025',
    items: 'Clean Code — Robert C. Martin',
    status: 'Remboursé',
    total: '39,99 €',
  },
]

const STATUS_STYLES: Record<Order['status'], string> = {
  'Livré':     'bg-success/10 text-success border-success/20',
  'En cours':  'bg-amber-500/10 text-amber-400 border-amber-500/20',
  'Remboursé': 'bg-fg-faint/10 text-fg-faint border-fg-faint/20',
}

const DEFAULT_ADDRESS: Address = {
  street:     '12 rue du Test Automatisé',
  city:       'Paris',
  postalCode: '75001',
  country:    'France',
}

function getInitialProfile(username: string | null): ProfileForm {
  switch (username) {
    case 'problem_user':            return { firstName: 'Problem', lastName: 'User',  email: 'problem@lab.qa' }
    case 'performance_glitch_user': return { firstName: 'Glitch',  lastName: 'User',  email: 'glitch@lab.qa' }
    default:                        return { firstName: 'Jane',    lastName: 'Doe',   email: 'jane.doe@lab.qa' }
  }
}

// ─── Profile section ──────────────────────────────────────────────────────────

function ProfileSection({ username }: { username: string | null }) {
  const [form, setForm]       = useState<ProfileForm>(() => getInitialProfile(username))
  const [errors, setErrors]   = useState<ProfileErrors>({})
  const [success, setSuccess] = useState(false)

  function validate(): ProfileErrors {
    const e: ProfileErrors = {}
    if (!form.firstName.trim()) e.firstName = 'Le prénom est requis'
    if (!form.lastName.trim())  e.lastName  = 'Le nom est requis'
    if (!form.email.trim())     e.email     = "L'email est requis"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "L'adresse email n'est pas valide"
    return e
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const fieldErrors = validate()
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors)
      return
    }
    setErrors({})
    setSuccess(true)
    setTimeout(() => setSuccess(false), 3000)
  }

  function updateField(key: keyof ProfileForm, value: string) {
    setForm(f => ({ ...f, [key]: value }))
    if (errors[key]) setErrors(e => ({ ...e, [key]: undefined }))
    if (success) setSuccess(false)
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4 max-w-md">
      <div className="grid grid-cols-2 gap-3">
        <Input
          id="profile-first-name"
          data-testid="profile-first-name"
          label="Prénom"
          autoComplete="given-name"
          value={form.firstName}
          onChange={e => updateField('firstName', e.target.value)}
          error={errors.firstName}
        />
        <Input
          id="profile-last-name"
          data-testid="profile-last-name"
          label="Nom"
          autoComplete="family-name"
          value={form.lastName}
          onChange={e => updateField('lastName', e.target.value)}
          error={errors.lastName}
        />
      </div>
      <Input
        id="profile-email"
        data-testid="profile-email"
        label="Email"
        type="email"
        autoComplete="email"
        value={form.email}
        onChange={e => updateField('email', e.target.value)}
        error={errors.email}
      />
      <div className="flex items-center gap-3">
        <Button type="submit" data-testid="profile-submit">
          Enregistrer
        </Button>
        {success && (
          <p data-testid="profile-success" className="text-sm text-success">
            Profil mis à jour.
          </p>
        )}
      </div>
    </form>
  )
}

// ─── Security section ─────────────────────────────────────────────────────────

function SecuritySection({ username }: { username: string | null }) {
  const [form, setForm]       = useState<PasswordForm>({ current: '', next: '', confirm: '' })
  const [errors, setErrors]   = useState<PasswordErrors>({})
  const [success, setSuccess] = useState(false)

  const knownPassword = username ? (USERS_MAP.get(username)?.password ?? 'Baguette42!') : 'Baguette42!'

  function validate(): PasswordErrors {
    const e: PasswordErrors = {}
    if (!form.current)
      e.current = 'Ce champ est requis'
    else if (form.current !== knownPassword)
      e.current = 'Mot de passe actuel incorrect'

    if (!form.next)
      e.next = 'Ce champ est requis'
    else if (form.next.length < 8)
      e.next = 'Le mot de passe doit contenir au moins 8 caractères'

    if (!form.confirm)
      e.confirm = 'Ce champ est requis'
    else if (form.confirm !== form.next)
      e.confirm = 'Les mots de passe ne correspondent pas'

    return e
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const fieldErrors = validate()
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors)
      return
    }
    setErrors({})
    setForm({ current: '', next: '', confirm: '' })
    setSuccess(true)
    setTimeout(() => setSuccess(false), 3000)
  }

  function updateField(key: keyof PasswordForm, value: string) {
    setForm(f => ({ ...f, [key]: value }))
    if (errors[key]) setErrors(e => ({ ...e, [key]: undefined }))
    if (success) setSuccess(false)
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4 max-w-md">
      <Input
        id="password-current"
        data-testid="password-current"
        label="Mot de passe actuel"
        type="password"
        autoComplete="current-password"
        value={form.current}
        onChange={e => updateField('current', e.target.value)}
        error={errors.current}
      />
      <Input
        id="password-new"
        data-testid="password-new"
        label="Nouveau mot de passe"
        type="password"
        autoComplete="new-password"
        value={form.next}
        onChange={e => updateField('next', e.target.value)}
        error={errors.next}
      />
      <Input
        id="password-confirm"
        data-testid="password-confirm"
        label="Confirmer le nouveau mot de passe"
        type="password"
        autoComplete="new-password"
        value={form.confirm}
        onChange={e => updateField('confirm', e.target.value)}
        error={errors.confirm}
      />
      <div className="flex items-center gap-3">
        <Button type="submit" data-testid="password-submit">
          Modifier le mot de passe
        </Button>
        {success && (
          <p data-testid="password-success" className="text-sm text-success">
            Mot de passe modifié.
          </p>
        )}
      </div>
    </form>
  )
}

// ─── Orders section ───────────────────────────────────────────────────────────

function OrdersSection() {
  return (
    <div className="overflow-x-auto">
      <table data-testid="orders-table" className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b border-border text-left">
            <th className="pb-3 pr-6 font-medium text-fg-muted whitespace-nowrap">N° commande</th>
            <th className="pb-3 pr-6 font-medium text-fg-muted whitespace-nowrap">Date</th>
            <th className="pb-3 pr-6 font-medium text-fg-muted">Articles</th>
            <th className="pb-3 pr-6 font-medium text-fg-muted whitespace-nowrap">Statut</th>
            <th className="pb-3 font-medium text-fg-muted text-right whitespace-nowrap">Total</th>
          </tr>
        </thead>
        <tbody>
          {FAKE_ORDERS.map(order => (
            <tr
              key={order.id}
              data-testid={`order-row-${order.id}`}
              className="border-b border-border-muted hover:bg-overlay transition-colors"
            >
              <td className="py-3 pr-6 font-mono text-xs text-fg-muted whitespace-nowrap">{order.id}</td>
              <td className="py-3 pr-6 text-fg whitespace-nowrap">{order.date}</td>
              <td className="py-3 pr-6 text-fg-muted max-w-xs truncate">{order.items}</td>
              <td className="py-3 pr-6">
                <span className={`text-xs border rounded-full px-2 py-0.5 ${STATUS_STYLES[order.status]}`}>
                  {order.status}
                </span>
              </td>
              <td className="py-3 text-right font-mono font-medium text-fg whitespace-nowrap">{order.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ─── Addresses section ────────────────────────────────────────────────────────

function AddressesSection() {
  const [address, setAddress] = useState<Address>(DEFAULT_ADDRESS)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft]     = useState<Address>(DEFAULT_ADDRESS)
  const [success, setSuccess] = useState(false)

  function handleEdit() {
    setDraft(address)
    setEditing(true)
    setSuccess(false)
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setAddress(draft)
    setEditing(false)
    setSuccess(true)
    setTimeout(() => setSuccess(false), 3000)
  }

  return (
    <div className="max-w-md flex flex-col gap-3">
      {!editing ? (
        <div data-testid="address-card" className="bg-canvas border border-border rounded-lg p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-fg-faint mb-2">
                Adresse principale
              </p>
              <p className="text-sm text-fg">{address.street}</p>
              <p className="text-sm text-fg">{address.postalCode} {address.city}</p>
              <p className="text-sm text-fg-muted">{address.country}</p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              data-testid="address-edit-button"
              onClick={handleEdit}
            >
              Modifier
            </Button>
          </div>
          {success && (
            <p data-testid="address-success" className="text-sm text-success mt-3">
              Adresse mise à jour.
            </p>
          )}
        </div>
      ) : (
        <form
          data-testid="address-form"
          onSubmit={handleSave}
          className="bg-canvas border border-border rounded-lg p-4 flex flex-col gap-3"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-fg-faint">
            Modifier l'adresse
          </p>
          <Input
            id="address-street"
            data-testid="address-street"
            label="Rue"
            value={draft.street}
            onChange={e => setDraft(d => ({ ...d, street: e.target.value }))}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              id="address-postal"
              data-testid="address-postal"
              label="Code postal"
              value={draft.postalCode}
              onChange={e => setDraft(d => ({ ...d, postalCode: e.target.value }))}
            />
            <Input
              id="address-city"
              data-testid="address-city"
              label="Ville"
              value={draft.city}
              onChange={e => setDraft(d => ({ ...d, city: e.target.value }))}
            />
          </div>
          <Input
            id="address-country"
            data-testid="address-country"
            label="Pays"
            value={draft.country}
            onChange={e => setDraft(d => ({ ...d, country: e.target.value }))}
          />
          <div className="flex gap-2">
            <Button type="submit" size="sm" data-testid="address-save">
              Enregistrer
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              data-testid="address-cancel"
              onClick={() => setEditing(false)}
            >
              Annuler
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const TABS: { id: Tab; label: string; testId: string; tabId: string; panelId: string }[] = [
  { id: 'profile',   label: 'Profil',    testId: 'account-tab-profile',   tabId: 'tab-profile',   panelId: 'panel-profile'   },
  { id: 'security',  label: 'Sécurité',  testId: 'account-tab-security',  tabId: 'tab-security',  panelId: 'panel-security'  },
  { id: 'orders',    label: 'Commandes', testId: 'account-tab-orders',    tabId: 'tab-orders',    panelId: 'panel-orders'    },
  { id: 'addresses', label: 'Adresses',  testId: 'account-tab-addresses', tabId: 'tab-addresses', panelId: 'panel-addresses' },
]

export function AccountPage() {
  const username = useAuthStore(s => s.username)
  const [activeTab, setActiveTab] = useState<Tab>('profile')

  return (
    <div className="max-w-3xl py-4">
      <Breadcrumb items={[{ label: 'Mon compte' }]} />

      <div className="flex items-baseline gap-2 mb-6">
        <h1 className="text-2xl font-semibold text-fg">Mon compte</h1>
        <span className="font-mono text-sm text-fg-faint">{username}</span>
      </div>

      {/* Tab bar */}
      <div
        role="tablist"
        aria-label="Sections du compte"
        className="flex border-b border-border mb-6"
      >
        {TABS.map(tab => (
          <button
            key={tab.id}
            role="tab"
            id={tab.tabId}
            aria-selected={activeTab === tab.id}
            aria-controls={tab.panelId}
            data-testid={tab.testId}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm transition-colors cursor-pointer bg-transparent border-none font-sans border-b-2 -mb-px ${
              activeTab === tab.id
                ? 'border-accent text-accent font-medium'
                : 'border-transparent text-fg-muted hover:text-fg'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab panels */}
      {activeTab === 'profile' && (
        <section role="tabpanel" id="panel-profile" aria-labelledby="tab-profile" tabIndex={0}>
          <h2 className="text-base font-medium text-fg mb-4">Informations personnelles</h2>
          <ProfileSection username={username} />
        </section>
      )}
      {activeTab === 'security' && (
        <section role="tabpanel" id="panel-security" aria-labelledby="tab-security" tabIndex={0}>
          <h2 className="text-base font-medium text-fg mb-4">Changer le mot de passe</h2>
          <SecuritySection username={username} />
        </section>
      )}
      {activeTab === 'orders' && (
        <section role="tabpanel" id="panel-orders" aria-labelledby="tab-orders" tabIndex={0}>
          <h2 className="text-base font-medium text-fg mb-4">Historique des commandes</h2>
          <OrdersSection />
        </section>
      )}
      {activeTab === 'addresses' && (
        <section role="tabpanel" id="panel-addresses" aria-labelledby="tab-addresses" tabIndex={0}>
          <h2 className="text-base font-medium text-fg mb-4">Mes adresses</h2>
          <AddressesSection />
        </section>
      )}
    </div>
  )
}
