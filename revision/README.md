# Maintenance du site de révisions

Le [catalogue](catalogue.json) recense les 48 pages, leurs intitulés, leurs catégories et leurs parents. Il constitue la référence pour les menus et fils d’Ariane. Les anciens chemins restent accessibles ; ne pas les renommer sans redirection.

Le [rapport d’audit du 20 novembre 2026](audit-2026-11-20.md) décrit les corrections pédagogiques, leurs sources et les limites documentaires.

## Moteurs

- `app.js` : mélange Fisher-Yates, scores proportionnels et sauvegarde facultative des meilleurs résultats.
- `revision/quiz.js` : 19 pages de QCM, 66 exercices et 884 entrées dédoublonnées. Les données de chaque page figurent dans le bloc JSON `quiz-data`. Une série contient au plus 10 questions ; les petites listes ne sont pas artificiellement répétées.
- `revision/engine.js` : 8 leçons à banques JSON, 51 exercices et 1 438 entrées. Une série comprend 10 questions distinctes. Les types pris en charge sont `choice`, `select`, `text`, `tokens`, `decompose`, `order`, `self` et `map`.
- Les activités de vapeur, fractions, nombres anglais, loisirs, vocabulaire et les deux courts exercices d’homophones conservent leurs interactions spécialisées.
- `revision/maps.js` et `revision/maps/` : contours IGN 2026, chargement et interactions cartographiques. Les sources géométriques sont indiquées dans `revision/maps/sources.json`.

Les QCM et les nouvelles banques donnent un indice à la première erreur, puis une correction à la deuxième. Une association à plusieurs champs vaut un point lorsque tous les champs sont corrects ; un retour séparé indique le statut de chaque champ. Les rédactions autoévaluées restent hors du score automatique.

Les tailles minimales des banques fermées sont explicites (`minimumQuestions`, `poolNote`). Ne pas créer de faux doublons pour atteindre un quota. Les corrections doivent être vérifiées avec une référence indépendante, pas seulement avec la réponse enregistrée dans la banque.

## Vérifications

```sh
node --test tests/*.test.cjs
```

Les trois suites contrôlent les banques JSON, les variantes et distracteurs, les cartes compressées, le catalogue, les QCM dédoublonnés, les dates corrigées, les formes anglaises, les calculs et le cas Pays de la Loire/Nantes contre Centre-Val de Loire/Orléans.

Les sources historiques et les précisions utiles sont accessibles dans les leçons concernées. Les valeurs 2 859 km / 32 601 km du graphique restent celles du document fourni : leur périmètre statistique n’est pas certifié. Le contenu de l’activité LearningApps appartient au service externe.
