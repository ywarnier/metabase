# J'essaie de poser une question mais on dirait que je ne peux pas accéder à certaines données dont j'ai besoin.

Il y a quelques taisons possibles pour que ça se produise:

- La source d'information qui contient les données pourrait ne pas être connectée à Metabase. Si vous êtes un administrateur, vous pouvez voir une liste de toutes vos sources de données connectées en cliquant sur l'icône d'engrenage, en naviguant vers la section _Administration_, puis en cliquant sur _Bases de données_ dans la barre de navigation supérieure.
- Vous pourriez ne pas disposer des permissions pour accéder aux données en question. Votre administrateur pourrait avoir besoin d'[ajuster vos accès](../../administration-guide/05-setting-permissions.md) en changeant ou en modifiant votre groupe d'utilisateur.
- Les données pourraient exister dans une table différente, autre que celle que vous avez sélectionné pour commencer la question.
 - Si vous utilisez une version de Metabase antérieure à la 0.33, vous aurez besoin d'écrire soit un query SQL qui contient une jointure, soit de demander à votre administrateur Metabase qu'il [configure des clefs étrangères](../../administration-guide/03-metadata-editing.md)). 
 - Si vous utilisez Metabase 0.33 ou supérieur, vous pouvez générer des jointures en utilisant l'éditeur de questions. Notez que vous aurez besoin de choisir un champ sur lequel effectuer la jointure des deux tables. Par exemple, si vous combinez la table des consommateurs avec la table des commandes, vous pourriez sélectionner le champ ID dans la table des consommateurs et le lier au champ customer\_id dans la table des commandes.
 
* Les données peuvent exister dans deux bases de données différentes. Metabase ne supporte pas encore les jointures entre deux bases de données. Généralement, il est conseillé de ramener les données dans une seule base de données.

