# 0002. Stack technique — React, Vite, Zustand, Tailwind, Playwright

- **Status:** Accepted
- **Date:** 2026-05-09
- **Deciders:** lordrequiem

## Context

L'ADR 0001 a arrêté le principe d'une application statique hébergée sur GitHub
Pages. Il reste à choisir les outils concrets pour construire et tester cette
application. Les critères de sélection découlent directement de la finalité du
projet : offrir une cible d'entraînement stable, déterministe, et pédagogiquement
cohérente pour des ingénieurs QA et des stagiaires en automatisation de tests.

Les contraintes principales sont :
- Pas de backend, pas de build complexe : le livrable est un dossier `dist/`
  déployable tel quel.
- L'environnement de test doit être reproductible localement et contre le site
  déployé sans modification des tests.
- Les conventions de code doivent être familières à l'audience cible (communauté
  QA/Playwright francophone), qui connaît React mais pas forcément des frameworks
  plus exotiques.

## Decision

### Framework UI : React 19 + Vite 6 + TypeScript 5

Nous utilisons React comme framework UI, bundlé par Vite, avec TypeScript en mode
strict.

- React est le framework le plus répandu dans la communauté QA/frontend visée ;
  les apprenants le reconnaissent sans apprentissage préalable.
- Vite produit un build statique minimal en une commande (`npm run build → dist/`),
  sans configuration d'éjection ni serveur Node en production.
- TypeScript strict garantit que les `data-testid` et les types de données du
  catalogue sont définis explicitement, ce qui réduit les erreurs de frappe
  silencieuses dans les seeds et les sélecteurs.

### Routing : React Router v7 en mode hash

Nous utilisons React Router v7 avec le mode hash (`/#/catalog`, `/#/cart`…).

GitHub Pages sert des fichiers statiques : toute URL qui ne correspond pas à un
fichier existant retourne une 404. Le mode hash contourne ce problème sans
configuration serveur ni page 404 de redirection. C'est un compromis délibéré :
les URLs sont moins propres, mais le déploiement reste trivial et entièrement
reproductible.

### State management : Zustand 5 avec persistance localStorage

Nous utilisons Zustand pour gérer l'état applicatif (panier, session, wishlist,
préférences), persisté via son middleware `persist` dans `localStorage`.

- Zustand est sans boilerplate : un seul fichier par store, pas de providers ni
  d'actions verbeux. Le code reste lisible pour des apprenants qui ne sont pas des
  experts React.
- La persistance `localStorage` donne un état déterministe entre les navigations
  tout en restant réinitialisable en un appel (`localStorage.clear()`), ce qui est
  essentiel pour les tests automatisés.
- Les seeds (produits, comptes) sont des fichiers TypeScript committés, ce qui
  garantit que l'état initial est identique sur toutes les machines et dans la CI.

### Styles : Tailwind CSS 4

Nous utilisons Tailwind CSS v4 avec des tokens CSS pour le thème clair/sombre.

- Tailwind élimine les décisions de nommage de classes CSS, ce qui réduit la
  friction lors des contributions.
- Le système de tokens CSS natif de Tailwind 4 permet de switcher entre thème
  clair et sombre sans JavaScript, uniquement via `prefers-color-scheme` et une
  classe `dark` sur `<html>`.
- Aucune feuille de style personnalisée volumineuse à maintenir : les variantes de
  bugs visuels (`broken-images`, etc.) sont appliquées via des classes utilitaires
  conditionnelles.

### API simulée : plugin Vite middleware

Nous exposons deux endpoints REST (`GET /api/products`, `POST /api/payment`) via
un plugin Vite custom actif uniquement en développement.

En production (GitHub Pages), les endpoints sont absents : l'application se replie
automatiquement sur les données statiques embarquées. Cette dualité permet aux
apprenants de pratiquer l'interception réseau Playwright (`page.route()`) en local
sans infrastructure supplémentaire.

### Tests : Playwright 1.52

Nous utilisons Playwright comme unique framework de test, configuré pour
Chromium, Firefox et WebKit.

- Playwright est l'outil central de la formation ; le projet est lui-même un
  support pédagogique, donc utiliser Playwright pour ses propres tests est
  cohérent et illustratif.
- La configuration `BASE_URL` injectable (`BASE_URL=https://… npm test`) permet
  de cibler indifféremment l'environnement local ou le site déployé sans modifier
  les specs.
- Le système de fixtures et de Page Object Models (dossier `playwright/pages/`)
  sert de référence de style pour les apprenants.

## Consequences

- Positive: stack mainstream, bien documentée, sans dépendances exotiques.
- Positive: build statique en une commande, déploiement sans serveur.
- Positive: état entièrement contrôlable par les tests (localStorage, seeds
  committés, endpoints interceptables).
- Negative / trade-offs: le mode hash rend les URLs moins lisibles et ne reflète
  pas un routing de production standard — acceptable pour une cible d'entraînement.
- Negative / trade-offs: pas de tests unitaires de logique pure pour l'instant ;
  toute la couverture repose sur les tests E2E Playwright.
- Follow-up: si des tests unitaires sont ajoutés (calculs de panier, remises,
  validation), documenter le runner choisi dans un nouvel ADR.

## Alternatives considered

- **Next.js** — rejeté : génère un projet plus complexe (SSR, App Router, config
  d'export statique), et l'audience cible n'a pas besoin de SSR pour une cible de
  test.
- **Vue / Svelte** — rejetés : moins familiers à l'audience QA visée, sans gain
  pédagogique pour ce projet.
- **Redux Toolkit** — rejeté pour la gestion d'état : boilerplate excessif pour
  un état simple ; Zustand suffit et reste plus lisible pour des non-experts React.
- **CSS Modules / styled-components** — rejetés : Tailwind réduit la surface de
  maintenance et convient mieux aux contributions ponctuelles.
- **Cypress** — rejeté pour les tests : Playwright est l'outil enseigné en
  formation ; utiliser Cypress créerait une incohérence pédagogique.
- **Mode history React Router** — rejeté : nécessite une configuration serveur ou
  une astuce 404, incompatible avec un déploiement GitHub Pages sans friction.
