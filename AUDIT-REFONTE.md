# Audit et refonte graphique de Révision Quest

Date : 6 novembre 2026. Dépôt : MrGuillemin/Paul.
Référence graphique : Histoire/Lecon-2/Machine-a-vapeur/ (Histoire, leçon 2).

## Périmètre et méthode

Audit du code des 37 documents HTML, de leurs liens, des feuilles de style et des scripts. Tests fonctionnels automatisés avec un DOM simulé. La vérification structurelle des banques ne constitue pas une validation pédagogique exhaustive.

L’environnement ne fournit pas l’outil de navigateur nécessaire à une inspection visuelle. Aucun test visuel sur téléphone, tablette ou ordinateur n’est donc revendiqué. Les règles responsive, les liens, les structures HTML et les parcours d’exercices ont été contrôlés dans le code.

## Constats et corrections

| Constat initial | Effet | Correction apportée |
| --- | --- | --- |
| Ancien thème bleu/violet sur dégradé, distinct de la leçon 2 | Rupture visuelle entre les parties du site | Fond crème #f5f3eb, texte vert profond #203c3b, actions vertes #145e57 et titres Georgia, comme la leçon modèle |
| Accueil limité à cinq liens, descriptions mentionnant des chapitres futurs déjà disponibles | Offre de révision peu mise en valeur | Nouvel accueil, descriptions actualisées, cartes de matières et accès direct à la leçon 2 |
| Leçon sur la vapeur absente des menus | Page accessible seulement par son URL | Liens depuis l’accueil et le menu Histoire-Géographie |
| Navigation entre les matières absente des pages anciennes | Retours successifs à l’accueil pour changer de matière | En-tête commun avec cinq matières et repérage de la matière courante |
| Titres, boutons et questions aux tailles et couleurs hétérogènes | Lecture irrégulière ; longues questions très volumineuses | Hiérarchie typographique commune, questions plus contenues, boutons et champs harmonisés |
| Deux pages ajoutent des styles locaux divergents | Présentation difficile à maintenir | Styles regroupés dans style.css, notamment pour My Hobbies et le vocabulaire Wayang Kulit |
| Retours visuels correct/wrong non définis dans le thème commun | Réponses désactivées peu explicites sur certaines leçons | États vert/rouge pour les options, en complément des messages textuels |
| Absence de lien d’évitement sur les anciennes pages et de focus explicite | Navigation clavier moins aisée | Lien « Aller au contenu », cible focalisable et contour de focus contrasté |
| Messages de correction généralement sans annonce assistive | Retours moins accessibles | Régions aria-live polies sur les zones de correction existantes |
| Grilles minimales et longues réponses à surveiller sur petits écrans | Risque de débordement ou de boutons serrés | Colonnes adaptatives puis uniques, retours à la ligne, champs à largeur maximale et cibles d’au moins 46 px |

Les animations sont neutralisées lorsque l’utilisateur demande une réduction des mouvements. Le thème utilise uniquement les ressources locales et les polices système.

## Préservation des exercices

- Les 24 anciennes pages d’exercices conservent leurs scripts, fonctions, identifiants et banques de questions à l’identique.
- app.js reste inchangé, y compris les règles de score et de mémorisation.
- Les trois fichiers de la leçon sur la machine à vapeur restent inchangés ; ils constituent la référence.
- Les adresses des chapitres et la redirection historique d’orthographe sont conservées.
- Les exercices déjà présents n’ont pas été convertis au moteur de la leçon 2 : cette refonte porte sur leur présentation et leur navigation.

## Résultats des contrôles

- 37 documents HTML contrôlés ; pas d’identifiant dupliqué.
- 451 références internes de liens ou ressources contrôlées ; aucune cible de fichier manquante.
- 36 pages de contenu atteignables depuis l’accueil. La seule autre page est une ancienne redirection, conservée pour la compatibilité des liens.
- 24 anciennes pages interactives chargées sans erreur de script dans le DOM de test.
- 78 niveaux ou modes parcourus jusqu’aux résultats, avec vérification des scores et des retours aux menus.
- 771 réponses traitées lors de cette exécution (le tirage des exercices est aléatoire).
- Pour les banques structurées disponibles : bonne réponse présente parmi les choix et absence de choix identiques contrôlées.
- Comparaison des blocs script avant/après : aucun changement.
- Tests de la leçon 2 : corrections 26/26, réponses erronées, nouvelles tentatives, recalcul des scores après modification, déplacement des étapes, variantes de XIXe, deux ordres humaine/animale, navigation et autoévaluation validés.

Ces contrôles fonctionnels ne mesurent pas le rendu CSS dans un véritable navigateur ni la restitution par un lecteur d’écran.

## Points restant à traiter

1. **Relecture pédagogique ciblée.** Dans anglais/introduce-yourself.html, la question « Lucy’s name is Lucy. ___ name is Lucy. » possède actuellement « His » comme réponse, alors que « Her » est attendu. La banque d’origine est conservée dans cette refonte graphique ; cette incohérence est signalée pour correction pédagogique.
2. **Champs créés à la volée.** Certains exercices anciens, notamment les nombres anglais, utilisent un champ sans libellé explicite dans leur HTML généré. Leur moteur doit être ajusté lors d’une passe d’accessibilité fonctionnelle.
3. **Stockage des meilleurs scores.** app.js suppose que localStorage est disponible et contient un JSON valide. Un stockage bloqué ou corrompu peut interrompre certains parcours. Une protection par try/catch est à envisager.
4. **Recette visuelle.** Vérifier dans de vrais navigateurs à 375 px, 768 px et 1440 px, ainsi qu’au zoom 200 %, puis parcourir les exercices au clavier. Cette vérification reste nécessaire avant de conclure à une conformité d’accessibilité.

## Maintenance

La présentation des anciennes pages se règle désormais dans style.css. Les éléments d’en-tête sont présents dans le HTML, sans dépendance JavaScript supplémentaire. Lors de l’ajout d’une nouvelle matière, mettre à jour les en-têtes communs et l’accueil. La leçon 2 garde sa feuille de style indépendante.
