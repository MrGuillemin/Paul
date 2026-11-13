# Extension Histoire et Français

## Pages

- `Histoire/Lecon-2/index.html` : choix des deux parties d’histoire.
- `Histoire/Lecon-2/Revolution-des-transports/index.html` : 6 nouveaux exercices.
- `francais/F1-Groupe-nominal/index.html` : 6 exercices.
- `francais/F2-Determinants/index.html` : 6 exercices.
- `francais/F3-Nombres-en-lettres/index.html` : 6 exercices.

Chaque nouvelle leçon possède un fichier `questions.json`, contenant six banques de 30 entrées. Le total initial est de 720 entrées (180 en histoire et 540 en français). Les identifiants restent stables ; les champs `prompt`, `context`, `answer`, `options`, `hint`, `explanation` et `aliases` sont destinés à la maintenance pédagogique.

## Composants partagés

- `app.js`, inchangé : mélange Fisher-Yates utilisé également par les anciens exercices.
- `revision/engine.js` : chargement des banques, tirages, interactions et corrections des nouvelles pages.
- `revision/style.css` : compléments au thème ; importe `../style.css` sans modifier les anciennes pages.

Les anciennes leçons gardent leur moteur. Seule la navigation de la page « Machine à vapeur » est enrichie ; ses exercices, sa feuille CSS et son script ne changent pas.

## Interactions

`choice` : QCM, y compris vrai/faux ; `select` : classement ou association contextualisée ; `text` : réponse courte ; `tokens` : choix d’un mot ; `decompose` : fonctions des constituants ; `order` : mots à sélectionner dans l’ordre ; `self` : rédaction avec modèle, critères et autoévaluation.

Dans les associations, chaque situation possède ses propres propositions. Il n’existe pas de liste globale imposant artificiellement une correspondance unique entre des causes dont les effets peuvent être proches.

Une série contient dix identifiants distincts. Les choix et l’ordre des questions sont mélangés. « Nouvelle série » renouvelle le tirage de l’exercice courant, conserve les autres exercices et garantit qu’au moins une entrée change. Les résultats des séries précédentes ne sont pas cumulés.

Une question vaut un seul point, même si elle contient plusieurs champs ou a été vérifiée plusieurs fois. Une modification retire le résultat jusqu’à une nouvelle vérification. Après une première erreur, un indice est donné ; l’erreur suivante affiche une correction expliquée. « Réessayer » permet de recommencer la question. Les rédactions sont autoévaluées et exclues du score automatique.

Pour les nombres en lettres, le mode `strict` conserve les marques d’accord et les traits d’union. Les majuscules et les variantes de tirets sont normalisées, mais « cents » et « cent », « vingts » et « vingt », « mille » et « milles » ne sont pas confondus.

Pour enrichir une banque, ajouter des identifiants uniques et conserver au moins 30 entrées. Mettre à jour les mentions du nombre d’entrées et les tests de comptage lorsqu’un enrichissement au-delà de 30 est volontaire.

## Vérifications

Depuis la racine du dépôt, avec Node.js (sans paquet supplémentaire) :

```sh
node --test tests/revision-banks.test.cjs
```

Ces tests contrôlent les 24 banques, les 720 identifiants, les doublons de données, les réponses, les distracteurs, les variantes de construction, le tirage, le mélange, la distribution du bilan historique, les dates et les règles d’orthographe des nombres. Ils ne remplacent pas une relecture pédagogique des nouvelles entrées ajoutées ultérieurement.

Le graphique des kilomètres utilise une échelle commune : `500 × valeur / 32601` pour la première barre et `500` pour la seconde. Une table fournit également les données exactes.

Les tests navigateur de livraison couvrent les 24 séries, les corrections, les tentatives, les scores, les nouveaux tirages, les bilans, la navigation entre les parties d’histoire et les largeurs 320, 375, 768 et 1440 px. Les tests antérieurs de vapeur et de fractions sont également relancés.
