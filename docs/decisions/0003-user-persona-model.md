# 0003. Modèle de personas utilisateurs — 4 comptes fixes, mot de passe commun

- **Status:** Accepted
- **Date:** 2026-05-09
- **Deciders:** lordrequiem

## Context

L'application doit permettre aux apprenants de tester des comportements variés
(parcours nominal, compte bloqué, interface dégradée, latence réseau) sans avoir
à configurer quoi que ce soit. Ces scénarios doivent être stables, nommés, et
reproductibles d'une session à l'autre.

La question est : comment modéliser les utilisateurs de façon à couvrir ces
scénarios tout en restant simple à utiliser en formation ?

## Decision

Nous définissons 4 comptes fixes dans `src/data/users.ts`, chacun associé à un
rôle TypeScript (`UserRole`). Tous partagent le même mot de passe (`Baguette42!`).
Le rôle est persisté dans le `authStore` (localStorage) après connexion et pilote
directement les comportements de l'application.

| Compte | Rôle | Comportement |
|---|---|---|
| `jean_dupont` | `standard_user` | Parcours nominal |
| `compte_banni` | `locked_out_user` | Erreur immédiate à la connexion |
| `client_chaos` | `problem_user` | Active les bugs visuels et de tri |
| `tortue_du_web` | `performance_glitch_user` | Login avec délai (~3 s) |

Le mot de passe commun est un choix délibéré : en formation, les apprenants doivent
se concentrer sur les usernames et les comportements associés, pas sur la gestion
de credentials multiples.

Ce modèle est directement inspiré de SauceDemo, qui fait référence dans la
communauté QA, ce qui réduit la courbe d'apprentissage pour les formateurs et
les apprenants qui le connaissent déjà.

## Consequences

- Positive: les scénarios de test sont nommés et stables — un test qui écrit
  `jean_dupont` a toujours le même comportement, sur toutes les machines et dans
  la CI.
- Positive: aucune interface d'administration, aucune base de données utilisateurs
  à maintenir.
- Positive: la familiarité avec SauceDemo réduit le temps d'onboarding en
  formation.
- Negative / trade-offs: les comptes sont hardcodés — ajouter un nouveau persona
  nécessite une modification du code et un déploiement. Acceptable pour un projet
  de formation à évolution lente.
- Negative / trade-offs: le mot de passe commun ne modélise pas la gestion réelle
  de credentials. À signaler explicitement en formation si cet aspect est au
  programme.
- Follow-up: si un futur usage nécessite la création de comptes dynamiques (ex :
  exercice de test d'inscription), traiter dans un nouvel ADR.

## Alternatives considered

- **Comptes configurables via un fichier JSON éditable** — rejeté : ajoute de la
  complexité (validation, UI d'admin ou édition manuelle) sans gain pédagogique
  pour les scénarios visés.
- **Authentification réelle (JWT, session serveur)** — rejeté : incompatible avec
  le principe d'application statique (ADR 0001) et hors périmètre pédagogique.
- **Un seul compte, comportements switchés par URL** — rejeté : ne permet pas de
  tester le flux de connexion avec des credentials différents, qui est un exercice
  courant en formation.
