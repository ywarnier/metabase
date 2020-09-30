# Comment répondre à des questions qui nécessitent des jointures entre tables?

Si vous utilisez Metabase dans une version antérieure à la 0.33, vous devrez soit écrire la requête SQL qui contient les jointures, soit demander à votre administrateur Metabase de configurer des Foreign Keys pour vous (vous pouvez en lire plus à ce sujet [ici](../../administration-guide/03-metadata-editing.md)).

Si vous utilisez Metabase 0.33 ou supérieur, vous pouvez générer des jointures en utilisant l'éditeur de questions. Notez que vous aurez besoin de choisir un champ sur lequel effectuer la jointure des deux tables. Par exemple, si vous combinez la table des consommateurs avec la table des commandes, vous pourriez sélectionner le champ ID dans la table des consommateurs et le lier au champ customer\_id dans la table des commandes.
