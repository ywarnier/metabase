# Est-ce que Metabase est accessible ou compatible avec la norme 508?

Metabase s'efforce de penser en termes d'accessibilité, mais notre solution ne respecte pas encore la section 508 sur l'accessibilité des États-Unis. Voici un petit sommaire rapide des parties spécifiques où Metabase ne respecte pas ces directives:

- L'application n'offre pas une méthode pour permettre aux lecteurs Braille de passer outre certains éléments de navigation spécifiques.
- Metabase est extrêmement proche mais pas à 100% respectueux de la directive concernant les équivalents textuels fournis pour tous les éléments non-textuels de l'application.
- La plupart, mais pas tous, les formulaires de l'application sont sélectionnables en utilisant la tabulation pour naviguer entre éléments.
- Metabase inclut des animations de transition, mais nous n'avons pas encore conduit de tests pour déterminer si leur scintillement est toujours entre 2 et 55 hertz.
- Les tableaux de données de l'application n'ont pas d'en-têtes de colonnes et de lignes identifiés par du markup.
- Nous n'avons pas encore publié de description de nos fonctionnalités d'accessibilité et de compatibilité.
- Notez également que Metabase est une application web basé sur REACT, et ne peux pas fonctionner sans langage de script (dans ce cas, JavaScript) disponible.
