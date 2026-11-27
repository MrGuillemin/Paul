# Extensions M4 et groupe nominal — 27 novembre 2026

## Intégration

Les nouveautés sont intégrées dans les **deux pages existantes**, avec leurs intitulés et leurs chemins conservés :

- `Mathematiques/M4-Fractions/index.html` : six exercices de départ conservés ; parties 2 à 5 ajoutées, avec 14 activités.
- `francais/F1-Groupe-nominal/index.html` : six exercices de départ conservés ; quatre sous-parties ajoutées, avec 13 activités.

Le menu « La suite de la leçon » ouvre une nouvelle activité dans la même page. Un seul bloc d’exercices est affiché à la fois. « Reprendre les six exercices déjà présents » restaure le bloc initial et ses réponses. Les nouvelles sessions gardent aussi leur état lors du changement d’activité. Les boutons et les champs restent utilisables au clavier et au toucher.

Les liens directs sont les ancres des boutons d’activités : `#m4-m1` à `#m4-m14` et `#gn-f1` à `#gn-f13`. Les sous-parties de M4 sont également accessibles par `#m4-partie-2` à `#m4-partie-5` ; celles du groupe nominal par `#gn-determinants`, `#gn-adjectifs`, `#gn-ordinaux` et `#gn-bilan`.

## Activités et banques

Les banques préparées contiennent **1 195 entrées : 683 en mathématiques, 512 en français**. Aucune banque additionnelle ne contient moins de 30 situations. Le générateur M11 renouvelle en outre sa banque de 60 divisions à chaque nouveau tirage, en conservant des exemples du cours.

| Activité M4 | Banque préparée | Série |
| --- | ---: | ---: |
| M1 Décomposer une fraction | 42 | 10 |
| M2 Retrouver toutes les écritures équivalentes | 31 | 10 |
| M3 Reconstituer une fraction | 38 | 10 |
| M4 Compléter les équivalences | 35 | 10 |
| M5 Fractions en images et coloriage | 36 | 10 |
| M6 Comparer grâce aux équivalences | 36 | 10 |
| M7 Comparer une fraction à 1 | 90 | 10 |
| M8 Classer par rapport à 1 | 90 | 10 |
| M9 Compléter une fraction sous condition | 30 | 10 |
| M10 Reste partageable ou non | 32 | 10 |
| M11 Quotient et reste | 56 + générateur de 60 | 10 |
| M12 Entier et fraction du reste | 34 | 10 |
| M13 Problèmes de partage | 32 | 10 |
| M14 Bilan cumulatif | 101 | 20 |

| Activité du groupe nominal | Banque | Série |
| --- | ---: | ---: |
| F1 Identifier le déterminant | 32 | 10 |
| F2 Catégories des déterminants | 34 | 10 |
| F3 Choisir le déterminant | 30 | 10 |
| F4 Accorder quel/quelle/quels/quelles | 32 | 10 |
| F5 Repérer l’adjectif | 36 | 10 |
| F6 Déterminant, nom, adjectif | 36 | 10 |
| F7 Accorder l’adjectif | 36 | 10 |
| F8 Transformer le groupe nominal | 32 | 10 |
| F9 Corriger les accords | 39 | 10 |
| F10 Quantité ou rang | 30 | 10 |
| F11 Écrire les ordinaux | 33 | 10 |
| F12 Identifier une position | 36 | 10 |
| F13 Bilan cumulatif | 106 | 20 |

## Règles pédagogiques

### Mathématiques

Les fractions sont affichées verticalement, avec une barre, y compris dans les propositions et corrections. Les grilles possèdent des cellules de mêmes dimensions. Leur nombre de colonnes est fixé à 2 pour les quarts, 10 pour les dixièmes et les centièmes. Les fractions représentées et les surfaces sont cohérentes.

Les écritures multiples doivent toutes être sélectionnées, sans proposition fausse. Les réponses sous forme de fractions sont comparées par calcul exact sur les entiers (`BigInt`), et les dénominateurs nuls sont refusés. La comparaison grâce aux équivalences est expliquée en centièmes, sans enseigner de produit en croix.

M9 accepte tous les entiers positifs qui respectent la condition, sans imposer une valeur canonique. Pour les décompositions en entier et fraction, le reste fractionnaire doit être inférieur à 1 ; les fractions équivalentes du reste sont acceptées. Pour les divisions euclidiennes, on vérifie l’égalité dividende = diviseur × quotient + reste et 0 ≤ reste < diviseur.

Les contextes de partage disent explicitement si les objets peuvent être découpés ou doivent rester entiers. Les problèmes alternent les deux situations. Le générateur de divisions utilise des diviseurs de 2 à 12 et des quotients entiers, sans notion de multiplication ou division générale de fractions.

M7 et M8 tirent 4/3/3 questions parmi les trois relations, la catégorie recevant la quatrième question changeant aléatoirement. Le bilan M14 réserve 3 questions aux éléments de la fraction, 3 aux images, 3 aux écritures, 3 aux équivalences, puis 2 à chacune des comparaisons à 1, comparaisons par équivalences, divisions et situations de partage. Chaque compétence figure donc dans chaque session.

Les grilles proposent les cases cliquables, un zoom défilable sur téléphone et une saisie du nombre de cases à colorier. Les trois commandes modifient le même état, et le score est invalidé lorsque la réponse change.

### Français

Les phrases précisent le contexte de chaque déterminant. « Des » indéfini est distingué de « des » contracté ; le contexte différencie l’interrogation et l’exclamation. Les exemples avec « autre » et « mêmes » ciblent explicitement l’article qui les accompagne, sans classement mécanique de ces mots.

Les transformations précisent le genre, le nombre et le nom à employer, notamment garçon/fille et chat/chatte. Les corrections d’erreurs précisent le nom et le sens attendu pour éviter des réponses concurrentes. Les accents, marques de féminin et marques du pluriel sont conservés lors de la validation des réponses écrites. Les majuscules et variantes typographiques d’apostrophes restent normalisées.

Pour les transformations prévues dans la fiche avec « des » devant un adjectif pluriel, la forme avec « de » est aussi acceptée lorsqu’elle convient : « de petits chiens » et « des petits chiens ». La forme requise de l’adjectif et du nom reste contrôlée.

Le bilan F13 contient les douze compétences demandées : noms, genre/nombre, articles, possessifs, démonstratifs, cardinaux, indéfinis, interrogatifs/exclamatifs, identification des adjectifs, accords, ordinaux et constituants du groupe nominal. Huit compétences reçoivent deux questions et quatre en reçoivent une, soit 20 questions à chaque session.

Conformément à la mission, les formes lequel/laquelle/lesquels/lesquelles/auquel/duquel ne font pas l’objet d’exercices qui les classeraient systématiquement comme des déterminants relatifs. Le rappel signale cette réserve.

## Architecture et conservation

Fichiers créés :

- `Mathematiques/M4-Fractions/extensions.json` et `francais/F1-Groupe-nominal/extensions.json` : banques additionnelles et sous-parties.
- `revision/extensions-types.js` : rendu des nouvelles réponses, calcul exact et générateur de divisions.
- `revision/extensions.js` : navigation dans la même page et commandes spécifiques de grilles/sélections/rangs.
- `revision/extensions.css` : compléments visuels limités aux nouveaux blocs.
- `tests/extensions-2026-11-27.test.cjs` : contrôles de données, calculs, accords, tirages et générateur.
- Ce compte rendu.

Fichiers modifiés : les deux pages HTML existantes, `revision/engine.js` et `revision/README.md`.

Le moteur partagé sait maintenant monter une seconde instance avec un préfixe d’identifiants, des types enregistrés, des séries de longueur variable et des plans de tirage. Les interactions et contrôles communs sont réutilisés. La première erreur fournit un indice ; la deuxième affiche la correction. Modifier une réponse retire son résultat jusqu’à nouvelle vérification. Une question compte un point, quel que soit le nombre de champs ou de tentatives.

Les identifiants DOM et les événements des nouvelles instances sont isolés. Les anciens scripts de fractions et de vapeur, les anciennes banques de questions et les fichiers des autres matières restent inchangés. Le catalogue des 48 pages et les chemins ne changent pas.

## Tests réalisés

- **33 tests automatisés** dans quatre suites, dont les 22 contrôles précédents. Les onze nouveaux tests vérifient les 1 195 entrées, les réponses et variantes, les écritures mathématiques recalculées, les réponses ouvertes, les divisions, les figures, les rangs, les accords avec un référentiel indépendant, les contextes grammaticaux et le générateur.
- Soixante tirages par nouvelle activité : longueur, absence de doublon, renouvellement et respect exact des plans des bilans.
- Trente générations de 60 divisions : situations distinctes, exemples conservés et corrections exactes.
- Parcours des **27 nouvelles activités**, avec deux séries par activité, réponses, scores, nouvelles séries et bilans. Contrôles aux largeurs 320, 375, 768 et 1280 pixels, sans débordement de page détecté.
- Vérification spécifique du générateur dans le navigateur, des fractions équivalentes du reste, des réponses ouvertes, de la touche Entrée et de l’indice avant correction.
- Vérification des grilles au clavier et au toucher, des positions au toucher et des liens directs vers les activités. Les cellules ont des dimensions égales ; la rangée ordinale et le zoom défilent dans leur propre cadre sur téléphone.
- Retour aux anciens exercices sans perte de leurs réponses ; ancien coloriage de trois demis et ancien QCM vapeur opérationnels.
- Parcours des **24 exercices existants** des transports et de F1/F2/F3, avec autoévaluations guidées, scores et bilans, sans erreur JavaScript détectée.
- **48 pages et 662 références locales** contrôlées : aucun fichier ni fragment manquant.

Commande des tests :

```sh
node --test tests/*.test.cjs
```
