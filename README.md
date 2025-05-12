### Anotações

```txt
locador — lessor 
locatário — lessee 
locação — leasing
locações — leases
```

### Variáveis de Ambiente
Instalar `@t3-oss/env-nextjs` no package `env` para configurar as variáveis de ambiente para o server e client;

```bash
npm i @t3-oss/env-nextjs
```

Instalar `dotenv-cli` no `server` para conseguir passar as variáveis de ambiente para os comandos de alguns scripts, já que o arquivo .env agora está na raiz do monorepo, então é necessário passar o caminho até o arquivo;

```bash
npm i dotenv-cli -D
```

Configuração no `package.json`:

```json
{
  ...
  "scripts": {
    "dev": "npm env:load tsx watch src/http/server.ts",
    "env:load": "dotenv -e ../../.env --"
  }
  ...
}
```

```bash
  git rm -r --cached apps/client
  git add apps/client
```
