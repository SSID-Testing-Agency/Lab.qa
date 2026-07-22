# Contribuer à Lab.QA

Merci de l'intérêt que vous portez à ce projet. Lab est une
boutique e-commerce **fictive**, conçue comme cible d'entraînement et de
démonstration pour l'automatisation de tests et la pédagogie en assurance
qualité (QA). Les contributions de la communauté sont les bienvenues.

Avant de contribuer, merci de lire ce document : il décrit ce qui est attendu
et la façon la plus efficace de proposer vos changements.

## Code de conduite

Soyez respectueux, précis et bienveillant dans les échanges. Toute interaction
(issue, pull request, discussion) doit rester professionnelle et constructive.

## Garder à l'esprit la nature du projet

Ce projet a une finalité particulière qui doit guider chaque contribution :

- C'est une **cible de test déterministe**. La stabilité et la reproductibilité
  priment sur le réalisme ou la richesse fonctionnelle.
- Les **bugs intentionnels** documentés dans le `README` ne sont pas des erreurs.
  Ne les « corrigez » pas sans en discuter au préalable dans une issue.
- C'est une application **statique, sans backend**, hébergée sur GitHub Pages.
  Les propositions nécessitant un serveur ou une base de données réelle sortent
  du périmètre, sauf décision actée par un nouvel ADR.

## Avant de commencer

1. Vérifiez qu'une issue existe déjà pour ce que vous souhaitez faire. Sinon,
   ouvrez-en une pour en discuter avant d'écrire du code.
2. Pour les changements non triviaux, attendez un retour d'un mainteneur avant
   de vous lancer, afin d'éviter un travail inutile.

## Stabilité des sélecteurs de test (point essentiel)

C'est ce qui fait la valeur de ce projet pour la communauté QA. Toute
contribution touchant à l'interface DOIT respecter les conventions suivantes :

- Chaque élément interactif expose un attribut `data-testid` stable.
- Les `data-testid` suivent la convention `[zone]-[element]-[identifiant]`.
- N'introduisez jamais de dépendance à une classe CSS auto-générée ni à la
  position d'un élément dans le DOM.
- Utilisez du HTML sémantique et des rôles ARIA, afin que les sélecteurs par
  rôle (`getByRole`) fonctionnent nativement.
- Toute modification, ajout ou suppression d'un `data-testid` doit être reflété
  dans [`docs/test-ids.md`](./docs/test-ids.md) au sein du même changement.

## Tests

- Ajoutez ou mettez à jour les tests end-to-end (Playwright) pour tout parcours
  utilisateur modifié.
- Lancez l'ensemble des tests localement avant de soumettre :

  ```bash
  npm test
  ```

## Décisions d'architecture (ADR)

Si votre contribution modifie une décision structurante (hébergement, modèle de
données, stratégie de sélecteurs, politique de bugs intentionnels, licence),
ajoutez un nouvel ADR dans `docs/decisions/` à partir du modèle
[`0000-template.md`](./docs/decisions/0000-template.md). Ne réécrivez jamais un ADR accepté : créez-en un nouveau qui
marque l'ancien comme `Superseded by`.

## Processus de pull request

1. **Forkez** le dépôt et créez une branche dédiée à partir de `main`.
   Nommez-la de façon explicite, par exemple `fix/total-panier-quantite-zero`.
2. Faites des commits clairs et atomiques. Un message de commit décrit le
   *pourquoi*, pas seulement le *quoi*.
3. Vérifiez en local : le linter passe, les tests passent, le build réussit.
4. Ouvrez la pull request vers `main` et reliez-la à l'issue concernée.
5. Décrivez votre changement, son intention, et la façon de le vérifier.
6. Un mainteneur relira votre proposition. Des allers-retours sont normaux et
   visent la qualité, pas la critique personnelle.

## Licence et marque de vos contributions

En soumettant une contribution, vous acceptez qu'elle soit distribuée sous la
licence du projet (**Apache License 2.0**, voir le fichier `LICENSE`).

Le nom et le logo Lab.qa sont des marques protégées et ne sont pas
couverts par cette licence (voir le fichier `NOTICE`). N'ajoutez pas de noms, de
logos ou de marques de tiers dans vos contributions sans autorisation.

## Données fictives uniquement

N'introduisez jamais de données réelles : pas de vraies adresses e-mail, pas de
vraies identités, pas de vraies coordonnées bancaires, même à titre d'exemple.
Toutes les données doivent être manifestement synthétiques.

## Une question ?

Ouvrez une issue avec le label `question`, ou contactez un mainteneur listé dans
le `README`.

Merci pour votre contribution.
