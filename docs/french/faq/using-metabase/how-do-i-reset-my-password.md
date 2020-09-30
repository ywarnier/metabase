## Comment réinitialiser mon mot de passe?

### Utiliser l'application Mac

Si vous utiliser l'application MacOS sur votre laptop, vous pouvez cliquer sur le menu d'aide puis sur `Réinitialiser le mot de passe`.

### Utiliser l'application web comme un utilisateur normal

Si vous avez des soucis pour vous connecter à cause d'un mot de passe oublié, cliquez sur le lien qui dit "Je semble avoir oublié mon mot de passe" dans la partie inférieure the la boîte de login. Si votre administrateur Metabase a déja [configuré vos paramètres d'e-mail](../../administration-guide/02-setting-up-email.md), vous recevrez l'e-mail de réinitialisation de votre mot de passe. Si l'e-mail n'a pas été configuré, vous devrez contacter votre administrateur Metabase pour qu'il procède à une réinitialisation du mot de passe via le Panneau d'administration > Utiilisateurs.

### Utiliser l'application web en tant qu'administrateur

Si vous êtes l'administrateur Metabase et que vous avez accès à la console du serveur, mais que vous avez oublié le mot de passe de votre compte administrateur, vous pouvez obtenir un token de réinitialisation, qui peut être utilisé pour générer un nouveau mot de passe.

Pour obtenir le token, stoppez l'instance Metabase, puis démarrez-là de nouveau avec les paramètres `reset-password email@example.com` (où "email@example.com" est l'adresse e-mail associée au compte administrateur).

Exemple: `java -jar metabase.jar reset-password email@example.com`

Ceci renverra un tocken et arrêtera l'instance Metabase à nouveau, comme ceci:

```
...
Resetting password for email@example.com...

OK [[[1_7db2b600-d538-4aeb-b4f7-0cf5b1970d89]]]
```

Démarrez maintenant Metabase normalement et naviguez vers l'URL où vous le faite tourner, en rajoutant la route suivante : `/auth/reset_password/:token`, où ":token" est le token généré à l'étape supérieure.

Exemple: `https://metabase.example.com/auth/reset_password/1_7db2b600-d538-4aeb-b4f7-0cf5b1970d89`

Vous devriez voir à présent une page où vous pourrez introduire un nouveau mote de passe pour le compte admin.
