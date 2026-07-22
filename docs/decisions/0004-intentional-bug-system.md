# 0004. Système d'activation des bugs intentionnels — double déclencheur, store non persisté

- **Status:** Accepted
- **Date:** 2026-05-09
- **Deciders:** lordrequiem

## Context

L'un des objectifs pédagogiques du projet est de fournir des bugs intentionnels
que les apprenants doivent détecter et couvrir par des tests. Ces bugs doivent
être :

- activables et désactivables sans modifier le code ;
- documentés et typés pour que les mainteneurs ne les « corrigent » pas par
  accident ;
- reproductibles dans les tests automatisés (déclenchement déterministe) ;
- réinitialisés automatiquement entre les sessions, pour ne pas polluer l'état
  d'une exécution à la suivante.

## Decision

### Double déclencheur indépendant

Les bugs s'activent via deux mécanismes indépendants, gérés dans `useBugMode` :

1. **Paramètre URL** : `?bugs=true` sur n'importe quelle page authentifiée.
   Utilisé principalement par les tests automatisés (`page.goto('/catalog?bugs=true')`).
2. **Rôle utilisateur** : le rôle `problem_user` (compte `client_chaos`) active
   un sous-ensemble des bugs dès la connexion.

Les deux déclencheurs peuvent être actifs simultanément sans conflit.

### BugId typés en union TypeScript

Les identifiants de bugs sont définis comme une union TypeScript (`BugId`) dans
`src/store/bugStore.ts`. Cela rend exhaustif tout `switch` ou condition sur les
bugs et empêche l'introduction silencieuse de chaînes arbitraires.

### Store Zustand non persisté

Le `bugStore` est intentionnellement **non persisté** (pas de middleware `persist`,
contrairement à `authStore` et `cartStore`). Les bugs actifs sont recalculés à
chaque navigation depuis le contexte courant (URL + rôle). Cela garantit qu'un
rechargement de page ou une nouvelle navigation repart d'un état propre, ce qui
est essentiel pour l'isolation des tests.

### Recréation de `hasBug` à chaque mise à jour

La fonction `hasBug` est recréée dans le `set()` à chaque appel de
`initFromContext`. C'est un contournement délibéré d'un comportement de Zustand :
les composants qui s'abonnent via `s => s.hasBug` ne re-rendent que si la
référence change. Stocker `hasBug` comme une nouvelle fonction à chaque activation
force correctement le re-render des composants concernés.

### Banner de signalisation

Un composant `BugBanner` (`data-testid="bug-mode-banner"`) s'affiche dès qu'au
moins un bug est actif. Il sert de signal visuel pour les apprenants et de point
d'ancrage pour les assertions de tests (`expect(banner).toBeVisible()`).

## Consequences

- Positive: les tests automatisés activent les bugs de façon déterministe via
  l'URL, sans dépendre d'un état persisté ou d'un compte particulier.
- Positive: les bugs sont exhaustivement typés — toute référence à un `BugId`
  inexistant est une erreur TypeScript.
- Positive: la non-persistance garantit l'isolation entre les tests sans nécessiter
  de `localStorage.clear()` entre chaque spec.
- Negative / trade-offs: le double déclencheur ajoute une légère complexité
  cognitive pour les nouveaux contributeurs — le README et le CONTRIBUTING
  documentent explicitement ce comportement.
- Negative / trade-offs: ajouter un nouveau bug nécessite de modifier l'union
  `BugId`, `initFromContext`, et la documentation (README + `docs/test-ids.md`).
  C'est voulu : un bug non documenté ne doit pas exister.

## Alternatives considered

- **Bugs activés uniquement par rôle utilisateur** — rejeté : oblige les tests
  automatisés à passer par le flux de connexion pour activer les bugs, ce qui
  ralentit les specs et crée une dépendance inutile.
- **Bugs activés uniquement par URL** — rejeté : ne permet pas de tester le
  scénario « l'utilisateur se connecte avec un compte dégradé », qui est un
  exercice formateur à part entière.
- **Feature flags persistés (localStorage)** — rejeté : un bug persisté entre
  deux runs de tests crée du flakiness. La non-persistance est une contrainte de
  qualité, pas une limitation.
- **Bugs injectés via `page.route()` Playwright uniquement** — rejeté : cela
  limiterait les bugs à la couche réseau et ne permettrait pas les bugs purement
  UI (bouton qui disparaît, tri inversé).
