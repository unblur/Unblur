# Unblur

CSE416 Group Project

## Repo Setup Instructions

1. Clone this repo: `git clone git@github.com:unblur/Unblur.git`
2. Go into the repo: `cd Unblur`
3. Get `node_modules` by running: `npm ci`

## Prettier Formatting Instructions (VSCode)

1. Install Prettier extention: `esbenp.prettier-vscode`
2. [How To Format Code with Prettier in Visual Studio Code](https://www.digitalocean.com/community/tutorials/code-formatting-with-prettier-in-visual-studio-code)
3. Update `settings.json` with:

```json
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.tabSize": 2,
    "prettier.singleQuote": true,
    "prettier.jsxSingleQuote": true,
    "prettier.semi": false,
```

## How To Run Server

1. Be in the Unblur repo
2. Add `.env` file
3. Start server with: `npm run server`
