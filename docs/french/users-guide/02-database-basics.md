## Un court aperçu de la notion de bases de données

Avant de commencer à travailler avec Metabase, il est utile de connaître quelques termes clefs.

#### Tables

Fondamentalement, des bases de données sont des _collections de tables_. Les tables contiennent une ou plusieurs _colonnes_ et une ou plusieurs _lignes_ (ou _enregistrements_). Une ligne est constituée de _cellules_, et chaque cellule a une _valeur_ qui correspond à la colonne sous laquelle elle apparaît.

Voici un exemple de table:

| Nom  | Age |
| ----- | --- |
| John  | 25  |
| Jenny | 31  |

Ici, les colonnes sont `Nom` et `Age`. La première ligne contient deux cellules, une avec `John` et l'autre avec `25`, correspondand aux colonnes Nom et Age, respectivement.

#### Colonnes

Toutes les cellules dans une colonne contiennent le même type d'information. Par exemple, dans la table d'exempple ci-dessus, la colonne `Nom` contient des noms dans chaque cellule, alors que la colonne `Age` contient des âges.

Les colonnes sont aussi parfois connues comme des _champs_. Chaque champ a un type qui décrit la sorte de données qui sera stockée dans le champ.

**Exemples de types:**

- **Types String (chaîne de caractères)** (TEXT, CHAR, VCHAR, etc.) - Dans le monde de la technologie, on se réfère aux morceaux de textes comme des “strings.” (Vous avez probablement déjà écouteé le terme “string de texte”). Ces champs stockent des choses comme des noms, des adresses, ou n'importe quoi d'autre qui est du texte.

- **Types numériques** (Integer, Float, DoubleFloat, Decimal, etc.) - Ces champs stockent des nombres. Les entiers (Integer) sont des nombres... entiers; Les flottants (Floats) et décimaux (Decimals) sont des façons de stocker des nombres qui contiennent des décimales. Les types numériques stockent des informations comme l'âge, le solde d'un compte en banque, des coûts, des latitudes, des longitudes.

- **Types temporels** (Timestamp, etc.) - Ces champs sont un format spécial de nombres utilisés pour stocker des dates et des heures (ou les deux), appelés “timestamps”. Parfois les bases de données stockent des marqueurs de temps entiers, sous la forme de secondes ou de millisecondes, comme `00:00:00 Coordinated Universal Time (UTC), Thursday, 1 January 1970`. Cette conversion permet un stockage compact des timestamps.

- **IDs** (aussi appelés **clefs primaires** - primary keys) - Ce champ identifie de façon unique une ligne dans une table. Par exemple, imaginez une application de location de voiture dans laquelle vous pouvez réserver une voiture à l'avance. L'ID de la réservation pourrait être le numéro de réservation, et deux réservations ne partageraient *jamais* le même numéro de réservation, ce qui permet que chaque réservation soit identifiée de façon unique par son numéro.

**Exemple**

_Table Reservations_

| ID Reservation | Nom   | Age |
| -------------- | ----- | --- |
| 11             | John  | 25  |
| 12             | Jenny | 31  |

Dans la table ci-dessus le champ `ID Reservation` est l'ID (primary key). Le champ `Nom` est un type string et le champ `Age` est un type numérique (spécifiquement un entier).

#### Relations

Les tables peuvent contenir des références à d'autres tables, ce qui établit une relation entre elles.

Par exemple, dans notre base de données de l'application de location de voiture, nous pourrions avoir deux tables: une por les réservations (nous l'appellerons **Reservations**) et une pour les clients (nous l'appellerons **Clients**).

Pour connecter les données de réservation aux données du client correspondant, vous pouvez utiliser une _clef étrangère_ (foreign key). Une clef étrangère est un type spécial de champ dans un table qui référence la même colonne dans une autre table. Le champ vers lequel la clef étrangère pointe est presque toujours l'_ID_ ou la _clef primaire_ dans l'autre table.

Par exemple, dans notre application hypothétique de location de voiture, nous pourrions connecter chaque réservation de la table _Reservations_ au client correspondant qui a fait la réservation en faisant en sorte que la colonne `Clients` de la table `Reservations` contienne la même valeur que la colonne `ID` de la table qui contien les clients qui ont fait la réservation.

**Reservations**

| Client   | Date       | Voiture      |
| -------- | ---------- | ------------ |
| 11       | 20/12/2015 | Toyota Camry |
| 12       | 02/01/2016 | Range Rover  |

**Clients**

| ID  | Nom   | Age |
| --- | ----- | --- |
| 11  | John  | 25  |
| 12  | Jenny | 31  |

Si nous souhaitions analyser la base de données de notre application hypothétique avec Metabase, nous pourrions poser une question comme :

    Quel est l'âge moyen de tous les clients qui ont fait des réservations en février 2015?

Pour cela, nous ouvrons la table Reservations, ajoutons un filtre pour regarder uniquement les réservations entre le 1er et le 28 février 2015, et sélectionnons `Moyenne de...`. Pour sélectionner un âge spécifique, nous utilisons alors le lien (clef étrangère) pour sélectionner Age depuis la table _Clients_ que notre table _Reservations_ référence.

---

## Suivant : Poser des questions

Maintenant que nous avons un vocabulaire partagé et une compréhension fondamentale des bases de données, passons à l'apprentissage de [l'exploration dans Metabase](03-basic-exploration.md)
