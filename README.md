# 🤖 Discord Delete Bot

Bot Discord qui supprime tous les salons d'un serveur via la commande `/delete`, sauf les salons protégés.

---

## 📋 Prérequis

- Un ordinateur avec **Node.js** installé
- Un compte Discord avec accès au [Developer Portal](https://discord.com/developers/applications)
- Être **administrateur** sur le serveur Discord cible

---

## 🛠️ Étape 1 — Créer le bot sur Discord

1. Va sur [discord.com/developers/applications](https://discord.com/developers/applications)
2. Clique sur **"New Application"** → donne un nom → **"Create"**
3. Dans le menu gauche, clique sur **"General Information"**
   - Copie l'**Application ID** → tu en auras besoin plus tard
4. Dans le menu gauche, clique sur **"Bot"**
   - Clique sur **"Reset Token"** puis **"Yes, do it"**
   - Copie le **Token** → garde-le secret, tu en auras besoin plus tard
   - Active les options suivantes sous "Privileged Gateway Intents" :
     - ✅ **Server Members Intent**
     - ✅ **Message Content Intent**

---

## 🔗 Étape 2 — Inviter le bot sur ton serveur

1. Dans le menu gauche, clique sur **"OAuth2"** → **"URL Generator"**
2. Coche **"bot"** et **"applications.commands"**
3. Dans les permissions, coche **"Administrator"**
4. Copie le lien généré en bas et ouvre-le dans ton navigateur
5. Sélectionne ton serveur → **"Autoriser"**

---

## 💻 Étape 3 — Installer Node.js (si pas déjà fait)

Ouvre le **Terminal** (Cmd + Espace → tape "Terminal" → Entrée) et vérifie :

```bash
node -v
```

- Si tu vois un numéro de version (ex: `v20.0.0`) → ✅ Node.js est installé, passe à l'étape suivante
- Si tu vois une erreur → télécharge Node.js sur [nodejs.org](https://nodejs.org) (version **LTS**) et installe-le

---

## 📁 Étape 4 — Préparer les fichiers

1. Crée un dossier sur ton bureau, par exemple **"discord-bot"**
2. Place les fichiers **`bot.js`** et **`package.json`** dans ce dossier

---

## ⚙️ Étape 5 — Configurer le bot

Ouvre le fichier **`bot.js`** avec un éditeur de texte (TextEdit, VS Code, etc.) et remplace les deux lignes en haut :

```js
const TOKEN = 'VOTRE_TOKEN_ICI';         // ← Colle ton Token ici
const CLIENT_ID = 'VOTRE_CLIENT_ID_ICI'; // ← Colle ton Application ID ici
```

Sauvegarde le fichier.

---

## 🚀 Étape 6 — Installer les dépendances et lancer le bot

Dans le Terminal, navigue jusqu'à ton dossier :

```bash
cd ~/Desktop/discord-bot
```

Installe discord.js :

```bash
npm install discord.js
```

Lance le bot :

```bash
node bot.js
```

Tu devrais voir :

```
✅ Bot connecté en tant que TonBot#1234
📡 Enregistrement de la commande /delete...
✅ Commande /delete enregistrée avec succès.
```

---

## 🗑️ Étape 7 — Utiliser la commande /delete

1. Va sur ton serveur Discord
2. Attends **1 à 2 minutes** que la commande `/delete` apparaisse (propagation Discord)
3. Dans n'importe quel salon, tape `/delete` et appuie sur Entrée
4. Tous les salons seront supprimés **sauf** :
   - `1509572608243531776`
   - `1509572608243531783`

> ⚠️ **Attention** — Cette action est irréversible. Les salons supprimés ne peuvent pas être récupérés.

---

## ⚠️ Problèmes fréquents

| Problème | Solution |
|---|---|
| `Cannot find module 'discord.js'` | Relance `npm install discord.js` dans le bon dossier |
| La commande `/delete` n'apparaît pas | Attends 1-2 min, ou redémarre Discord |
| `Missing Permissions` | Vérifie que le bot a le rôle Administrateur sur le serveur |
| Le bot s'arrête quand je ferme le Terminal | Normal — laisse le Terminal ouvert pendant l'utilisation |

---

## 🛑 Arrêter le bot

Dans le Terminal, appuie sur **Ctrl + C**.
