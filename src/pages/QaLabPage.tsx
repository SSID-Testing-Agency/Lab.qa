import { useBugStore } from '@/store/bugStore'
import type { BugId } from '@/store/bugStore'

interface BugDef {
  id: BugId
  label: string
  zone: string
  activation: ('problem_user' | '?bugs=true')[]
  description: string
  objective: string
  hints: string[]
}

interface ScenarioDef {
  username: string
  label: string
  zone: string
  description: string
  objective: string
  hints: string[]
}

interface PromoDef {
  code: string
  discount: string
  zone: string
  description: string
  objective: string
  hints: string[]
}

const BUGS: BugDef[] = [
  {
    id: 'broken-images',
    label: 'Broken Images',
    zone: 'Catalogue',
    activation: ['problem_user', '?bugs=true'],
    description: 'Les images produit sont remplacées par des URLs invalides — chaque carte affiche une image cassée.',
    objective: 'Vérifier que toutes les images produit se chargent correctement. Tester la présence d\'un attribut src valide et l\'absence d\'état d\'erreur sur les balises <img>.',
    hints: [
      'Utiliser locator("img") pour lister toutes les images du catalogue',
      'Vérifier naturalWidth > 0 pour détecter une image cassée',
      'Tester sur chaque catégorie, pas seulement "Tous les produits"',
    ],
  },
  {
    id: 'reversed-sort',
    label: 'Reversed Sort',
    zone: 'Catalogue',
    activation: ['problem_user', '?bugs=true'],
    description: 'Le tri « Prix croissant » retourne les résultats dans l\'ordre décroissant — l\'article le plus cher apparaît en premier.',
    objective: 'Tester un tri et comparer l\'ordre attendu. Extraire la liste des prix affichés après application d\'un tri et vérifier que la séquence est bien croissante.',
    hints: [
      'Récupérer tous les prix après avoir sélectionné "Prix croissant"',
      'Comparer le tableau obtenu à son propre tri JavaScript',
      'Tester aussi le tri "Prix décroissant" pour couvrir les deux sens',
    ],
  },
  {
    id: 'disappearing-button',
    label: 'Disappearing Button',
    zone: 'Catalogue / Fiche produit',
    activation: ['problem_user', '?bugs=true'],
    description: 'Le bouton « Ajouter au panier » est rendu invisible sur certaines cartes produit — il existe dans le DOM mais ne peut pas être cliqué.',
    objective: 'Détecter une régression UI. Vérifier que le bouton est bien visible (et pas seulement présent) sur chaque carte produit en stock.',
    hints: [
      'Utiliser expect(button).toBeVisible() — toBeAttached() ne suffit pas',
      'Itérer sur toutes les cartes produit, pas seulement la première',
      'Exclure les produits en rupture de stock qui ont légitimement un bouton désactivé',
    ],
  },
  {
    id: 'invalid-form-accepted',
    label: 'Invalid Form Accepted',
    zone: 'Checkout — Livraison',
    activation: ['?bugs=true'],
    description: 'Le formulaire de livraison est soumis même si des champs obligatoires sont vides — aucune validation côté client n\'est déclenchée.',
    objective: 'Tester la validation du formulaire. Soumettre le formulaire avec des champs vides et vérifier que des messages d\'erreur apparaissent et que la navigation vers l\'étape suivante est bloquée.',
    hints: [
      'Cliquer sur "Continuer" sans rien remplir et vérifier les messages d\'erreur par champ',
      'Tester chaque champ individuellement (prénom, nom, email, code postal)',
      'Vérifier que le code postal rejette "1234" (4 chiffres) mais accepte "75001"',
    ],
  },
  {
    id: 'price-off-by-one',
    label: 'Price Off-by-One',
    zone: 'Panier / Checkout',
    activation: ['?bugs=true'],
    description: 'Un centime supplémentaire est ajouté à chaque ligne du total — le grand total affiché est légèrement supérieur à la somme réelle.',
    objective: 'Tester les calculs. Extraire le sous-total, les frais de livraison et la TVA affichés, recalculer le total attendu et le comparer au total affiché.',
    hints: [
      'Ajouter plusieurs articles avec des quantités différentes pour amplifier l\'écart',
      'Tester avec et sans code promo — l\'erreur doit persister',
      'Parser les valeurs texte avec parseFloat après avoir retiré le symbole €',
    ],
  },
]

const SCENARIOS: ScenarioDef[] = [
  {
    username: 'compte_banni',
    label: 'Locked Out User',
    zone: 'Connexion',
    description:
      "La connexion avec ce compte est immédiatement rejetée avec le message « Désolé, ce compte est verrouillé » — aucune redirection ne se produit.",
    objective:
      "Tester le comportement de l'application face à un compte bloqué. Vérifier que le message d'erreur est présent et correct, que l'URL reste sur la page de connexion, et que le formulaire reste utilisable pour une nouvelle tentative.",
    hints: [
      'Vérifier la présence et le contenu exact de [data-testid="login-error"]',
      "S'assurer que l'URL n'a pas changé après la soumission",
      'Confirmer que les champs username et password sont toujours accessibles (non désactivés)',
    ],
  },
  {
    username: 'tortue_du_web',
    label: 'Performance Glitch User',
    zone: 'Connexion',
    description:
      "La connexion avec ce compte introduit un délai artificiel de 3 secondes avant la redirection — le bouton « Se connecter » est désactivé et affiche « Connexion en cours… » pendant l'attente.",
    objective:
      "Tester la résilience de l'UI face aux latences réseau. Vérifier que l'interface bloque toute double-soumission, que l'indicateur de chargement est visible, et que la connexion aboutit malgré le délai.",
    hints: [
      'Utiliser page.waitForURL() avec un timeout supérieur à 5 000 ms',
      'Vérifier que le bouton est disabled pendant le chargement : expect(btn).toBeDisabled()',
      'Mesurer la durée de connexion avec Date.now() pour confirmer le délai de ~3 s',
    ],
  },
]

const PROMOS: PromoDef[] = [
  {
    code: 'TESTQA',
    discount: '−10 %',
    zone: 'Panier',
    description:
      "Applique une réduction de 10 % sur le sous-total du panier. Ce code n'est pas affiché dans l'interface — il est réservé aux scripts de test automatisés.",
    objective:
      "Tester le flux code promo de bout en bout : saisie, validation, affichage de la ligne de réduction et recalcul cohérent du total.",
    hints: [
      'Remplir [data-testid="cart-promo-input"] avec "TESTQA" et soumettre via [data-testid="cart-promo-apply"]',
      'Vérifier que [data-testid="cart-discount"] affiche bien −10 % du sous-total',
      'Supprimer le code via [data-testid="cart-remove-promo"] et confirmer que le total revient à sa valeur initiale',
    ],
  },
]

const ZONE_COLORS: Record<string, string> = {
  'Catalogue': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  'Catalogue / Fiche produit': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  'Checkout — Livraison': 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  'Panier / Checkout': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  'Connexion': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  'Panier': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
}

export function QaLabPage() {
  const hasBug = useBugStore(s => s.hasBug)
  const isBugMode = useBugStore(s => s.isBugMode)

  return (
    <div className="max-w-3xl py-4">
      <h1 className="text-2xl font-semibold text-fg mb-1">
        QA Lab — <span className="text-accent">Bugs intentionnels</span>
      </h1>
      <p className="text-fg-muted text-sm mb-6">
        Cinq bugs activables conçus pour s'entraîner à les détecter avec Playwright.
        Chaque bug a un objectif pédagogique précis et des indices pour écrire vos assertions.
      </p>

      {/* Activation */}
      <div className="bg-surface border border-border rounded-lg p-5 mb-6">
        <h2 className="text-sm font-semibold text-fg mb-3">Comment activer les bugs</h2>
        <div className="flex flex-col gap-3">
          <div className="flex items-start gap-3">
            <code className="font-mono text-xs bg-canvas border border-border rounded px-2 py-1 shrink-0 text-accent">
              ?bugs=true
            </code>
            <p className="text-sm text-fg-muted">
              Ajouter ce paramètre à n'importe quelle URL après connexion — active les <strong className="text-fg">5 bugs</strong> simultanément.
              Ex&nbsp;: <code className="font-mono text-xs text-fg-faint">#/catalog?bugs=true</code>
            </p>
          </div>
          <div className="border-t border-border-muted pt-3 flex items-start gap-3">
            <code className="font-mono text-xs bg-canvas border border-border rounded px-2 py-1 shrink-0 text-accent">
              client_chaos
            </code>
            <p className="text-sm text-fg-muted">
              Se connecter avec ce compte active <strong className="text-fg">3 bugs visuels</strong> (broken-images, reversed-sort, disappearing-button) sans modifier l'URL.
            </p>
          </div>
          <div className="border-t border-border-muted pt-3 flex items-start gap-3">
            <code className="font-mono text-xs bg-canvas border border-border rounded px-2 py-1 shrink-0 text-accent">
              compte_banni
            </code>
            <p className="text-sm text-fg-muted">
              Compte verrouillé — la connexion échoue immédiatement. Scénario pour tester la <strong className="text-fg">gestion d'erreur</strong> au login.
            </p>
          </div>
          <div className="border-t border-border-muted pt-3 flex items-start gap-3">
            <code className="font-mono text-xs bg-canvas border border-border rounded px-2 py-1 shrink-0 text-accent">
              tortue_du_web
            </code>
            <p className="text-sm text-fg-muted">
              Délai artificiel de 3 s à la connexion. Scénario pour tester la <strong className="text-fg">résilience aux latences</strong> et les états de chargement.
            </p>
          </div>
        </div>

        {isBugMode && (
          <div className="mt-4 flex items-center gap-2 text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-md px-3 py-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
            Bug mode actif — certains bugs sont actuellement activés dans votre session.
          </div>
        )}
      </div>

      {/* Bug cards */}
      <h2 className="text-base font-semibold text-fg mb-3">Bugs intentionnels</h2>
      <div className="flex flex-col gap-4">
        {BUGS.map(bug => {
          const active = hasBug(bug.id)
          return (
            <article
              key={bug.id}
              className={`bg-surface border rounded-lg overflow-hidden transition-colors ${
                active ? 'border-accent/40' : 'border-border'
              }`}
            >
              {/* Card header */}
              <div className={`px-5 py-3 flex items-center justify-between gap-3 border-b ${
                active ? 'border-accent/20 bg-accent/5' : 'border-border-muted'
              }`}>
                <div className="flex items-center gap-2.5 min-w-0">
                  <code className="font-mono text-xs text-fg-faint shrink-0">{bug.id}</code>
                  <span className="text-sm font-medium text-fg truncate">{bug.label}</span>
                  <span className={`text-xs border rounded-full px-2 py-0.5 shrink-0 ${ZONE_COLORS[bug.zone] ?? 'bg-overlay text-fg-muted border-border'}`}>
                    {bug.zone}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  {active ? (
                    <span className="flex items-center gap-1 text-xs font-medium text-accent bg-accent/10 border border-accent/20 rounded-full px-2 py-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block" />
                      Actif
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs text-fg-faint bg-canvas border border-border-muted rounded-full px-2 py-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-fg-faint inline-block" />
                      Inactif
                    </span>
                  )}
                </div>
              </div>

              {/* Card body */}
              <div className="px-5 py-4 flex flex-col gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-fg-faint mb-1">Ce que fait le bug</p>
                  <p className="text-sm text-fg-muted leading-relaxed">{bug.description}</p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-fg-faint mb-1">Objectif pédagogique</p>
                  <p className="text-sm text-fg leading-relaxed">{bug.objective}</p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-fg-faint mb-2">Indices pour vos tests</p>
                  <ul className="flex flex-col gap-1.5">
                    {bug.hints.map((hint, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-fg-muted">
                        <span className="text-accent font-mono shrink-0 mt-0.5">›</span>
                        {hint}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center gap-2 pt-1 border-t border-border-muted">
                  <span className="text-xs text-fg-faint">Activation :</span>
                  {bug.activation.map(method => (
                    <code key={method} className="font-mono text-xs bg-canvas border border-border rounded px-1.5 py-0.5 text-accent">
                      {method}
                    </code>
                  ))}
                </div>
              </div>
            </article>
          )
        })}
      </div>

      {/* Scenario cards */}
      <h2 className="text-base font-semibold text-fg mt-8 mb-3">Scénarios comptes</h2>
      <p className="text-fg-muted text-sm mb-4">
        Ces comportements ne sont pas des bugs activables — ils sont permanents sur les comptes concernés.
        Idéaux pour tester la gestion d'erreur et les états transitoires de l'UI.
      </p>
      <div className="flex flex-col gap-4">
        {SCENARIOS.map(scenario => (
          <article
            key={scenario.username}
            className="bg-surface border border-border rounded-lg overflow-hidden"
          >
            <div className="px-5 py-3 flex items-center justify-between gap-3 border-b border-border-muted">
              <div className="flex items-center gap-2.5 min-w-0">
                <code className="font-mono text-xs text-fg-faint shrink-0">{scenario.username}</code>
                <span className="text-sm font-medium text-fg truncate">{scenario.label}</span>
                <span className={`text-xs border rounded-full px-2 py-0.5 shrink-0 ${ZONE_COLORS[scenario.zone] ?? 'bg-overlay text-fg-muted border-border'}`}>
                  {scenario.zone}
                </span>
              </div>
              <span className="flex items-center gap-1 text-xs text-fg-faint bg-canvas border border-border-muted rounded-full px-2 py-0.5 shrink-0">
                compte dédié
              </span>
            </div>

            <div className="px-5 py-4 flex flex-col gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-fg-faint mb-1">Ce que fait ce compte</p>
                <p className="text-sm text-fg-muted leading-relaxed">{scenario.description}</p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-fg-faint mb-1">Objectif pédagogique</p>
                <p className="text-sm text-fg leading-relaxed">{scenario.objective}</p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-fg-faint mb-2">Indices pour vos tests</p>
                <ul className="flex flex-col gap-1.5">
                  {scenario.hints.map((hint, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-fg-muted">
                      <span className="text-accent font-mono shrink-0 mt-0.5">›</span>
                      {hint}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center gap-2 pt-1 border-t border-border-muted">
                <span className="text-xs text-fg-faint">Activation :</span>
                <span className="text-xs text-fg-muted">se connecter avec</span>
                <code className="font-mono text-xs bg-canvas border border-border rounded px-1.5 py-0.5 text-accent">
                  {scenario.username}
                </code>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* API simulée */}
      <h2 className="text-base font-semibold text-fg mt-8 mb-3">API simulée</h2>
      <p className="text-fg-muted text-sm mb-4">
        L'application appelle deux endpoints REST interceptables via <code className="font-mono text-xs text-accent">page.route()</code> dans Playwright.
        En dev, un middleware Vite sert les réponses réelles.
      </p>

      <div className="bg-surface border border-border rounded-lg overflow-hidden mb-6">
        {/* Démarrage */}
        <div className="px-5 py-4 border-b border-border-muted">
          <p className="text-xs font-semibold uppercase tracking-widest text-fg-faint mb-3">Démarrer le serveur de dev</p>
          <p className="text-sm text-fg-muted mb-3">
            Ouvrir <strong className="text-fg">deux terminaux</strong> : l'un fait tourner le serveur, l'autre exécute les commandes.
          </p>
          <div className="bg-canvas border border-border rounded-md px-4 py-3 font-mono text-xs text-fg-muted">
            <span className="text-fg-faint"># Terminal 1</span><br />
            <span className="text-accent">npm run dev</span>
            <br /><br />
            <span className="text-fg-faint"># Terminal 2 — une fois « ready » affiché</span><br />
            <span className="text-accent">curl http://localhost:5173/api/products</span>
          </div>
        </div>

        {/* GET /api/products */}
        <div className="px-5 py-4 border-b border-border-muted">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-mono text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded px-1.5 py-0.5">GET</span>
            <code className="font-mono text-xs text-fg">/api/products</code>
            <span className="text-xs text-fg-faint ml-auto">catalogue complet</span>
          </div>
          <p className="text-sm text-fg-muted mb-3">
            Retourne le tableau JSON de tous les produits. Utilisé au chargement du catalogue.
          </p>
          <div className="bg-canvas border border-border rounded-md px-4 py-3 font-mono text-xs text-fg-muted">
            curl http://localhost:5173/api/products
          </div>
        </div>

        {/* POST /api/payment */}
        <div className="px-5 py-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-mono text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded px-1.5 py-0.5">POST</span>
            <code className="font-mono text-xs text-fg">/api/payment</code>
            <span className="text-xs text-fg-faint ml-auto">paiement — délai 1,5 s</span>
          </div>
          <p className="text-sm text-fg-muted mb-3">
            Accepte <code className="font-mono text-xs text-fg-faint">{'{ "cardNumber": "...", "orderId": "..." }'}</code> et répond selon la carte.
            Attend 1,5 s pour simuler la latence réseau.
          </p>
          <div className="flex flex-col gap-2 mb-3">
            {[
              { card: '4242 4242 4242 4242', label: '200 success',  color: 'text-success' },
              { card: '4000 0000 0000 0002', label: '402 declined', color: 'text-warning' },
              { card: '4000 0000 0000 9995', label: '500 error',    color: 'text-danger'  },
            ].map(({ card, label, color }) => (
              <div key={card} className="flex items-center justify-between gap-4 text-xs font-mono">
                <span className="text-accent">{card}</span>
                <span className={`shrink-0 ${color}`}>{label}</span>
              </div>
            ))}
          </div>
          <div className="bg-canvas border border-border rounded-md px-4 py-3 font-mono text-xs text-fg-muted leading-relaxed">
            {'curl -X POST http://localhost:5173/api/payment \\'}<br />
            {'  -H "Content-Type: application/json" \\'}<br />
            {'  -d \'{"cardNumber":"4242424242424242","orderId":"ORD-1"}\''}
          </div>
        </div>
      </div>

      {/* Playwright */}
      <div className="bg-surface border border-border rounded-lg px-5 py-4 mb-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-fg-faint mb-3">Interception Playwright</p>
        <p className="text-sm text-fg-muted mb-3">
          En test, <code className="font-mono text-xs text-accent">page.route()</code> intercepte les requêtes avant qu'elles partent.
          Pas besoin que le serveur dev soit lancé.
        </p>
        <div className="flex flex-col gap-3">
          {[
            {
              label: 'route.fulfill() — réponse fictive',
              code: "await page.route('**/api/products', r =>\n  r.fulfill({ json: [{ id: 'fake', name: 'Produit test' }] })\n)",
            },
            {
              label: 'route.fulfill() — erreur 500 sur le paiement',
              code: "await page.route('**/api/payment', r =>\n  r.fulfill({ status: 500 })\n)",
            },
            {
              label: 'latence simulée',
              code: "await page.route('**/api/products', async r => {\n  await page.waitForTimeout(3000)\n  await r.continue()\n})",
            },
            {
              label: 'route.continue() — passe-plat + log',
              code: "await page.route('**/api/payment', async r => {\n  console.log(r.postData())\n  await r.continue()\n})",
            },
          ].map(({ label, code }) => (
            <div key={label}>
              <p className="text-xs text-fg-faint mb-1">{label}</p>
              <div className="bg-canvas border border-border rounded-md px-4 py-3 font-mono text-xs text-fg-muted whitespace-pre leading-relaxed">
                {code}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Promo codes */}
      <h2 className="text-base font-semibold text-fg mt-8 mb-3">Codes promo</h2>
      <p className="text-fg-muted text-sm mb-4">
        Codes réservés aux tests automatisés — non affichés dans l'interface utilisateur.
      </p>
      <div className="flex flex-col gap-4">
        {PROMOS.map(promo => (
          <article
            key={promo.code}
            className="bg-surface border border-border rounded-lg overflow-hidden"
          >
            <div className="px-5 py-3 flex items-center justify-between gap-3 border-b border-border-muted">
              <div className="flex items-center gap-2.5 min-w-0">
                <code className="font-mono text-xs text-fg-faint shrink-0">{promo.code}</code>
                <span className="text-sm font-medium text-fg">{promo.discount}</span>
                <span className={`text-xs border rounded-full px-2 py-0.5 shrink-0 ${ZONE_COLORS[promo.zone] ?? 'bg-overlay text-fg-muted border-border'}`}>
                  {promo.zone}
                </span>
              </div>
              <span className="flex items-center gap-1 text-xs text-fg-faint bg-canvas border border-border-muted rounded-full px-2 py-0.5 shrink-0">
                code caché
              </span>
            </div>

            <div className="px-5 py-4 flex flex-col gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-fg-faint mb-1">Ce que fait ce code</p>
                <p className="text-sm text-fg-muted leading-relaxed">{promo.description}</p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-fg-faint mb-1">Objectif pédagogique</p>
                <p className="text-sm text-fg leading-relaxed">{promo.objective}</p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-fg-faint mb-2">Indices pour vos tests</p>
                <ul className="flex flex-col gap-1.5">
                  {promo.hints.map((hint, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-fg-muted">
                      <span className="text-accent font-mono shrink-0 mt-0.5">›</span>
                      {hint}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center gap-2 pt-1 border-t border-border-muted">
                <span className="text-xs text-fg-faint">Code :</span>
                <code className="font-mono text-xs bg-canvas border border-border rounded px-1.5 py-0.5 text-accent">
                  {promo.code}
                </code>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
