# Petshop — Projeto PWA (Etec São Mateus)

Site do Petshop transformado em **PWA (Progressive Web App)**, seguindo o passo a passo da apresentação "PWA (Progressive Web App)".

## Arquivos do PWA

| Arquivo | Para que serve |
|---|---|
| `manifest.json` | Diz ao navegador/celular como o app deve se comportar (nome, ícones, cores). Sem ele o site não pode virar APK. |
| `sw.js` | Service Worker: roda em segundo plano, salva os arquivos em cache e faz o app funcionar offline. |
| `icon-192.png` / `icon-512.png` | Ícones do app (tamanhos exigidos pelo PWA Builder). |
| `index.html` | Página do site. No `<head>` tem `<link rel="manifest" href="manifest.json">`. |
| `script.js` | Registra o Service Worker, controla o menu, o formulário e o indicador online/offline. |

## Publicar no GitHub Pages (resumo do tutorial)

1. Crie uma conta/crie um repositório em https://github.com (New repository).
2. Envie todos os arquivos desta pasta para o repositório.
3. Em **Settings > Pages**, selecione a branch `main` e clique em **Save**.
4. Aguarde de 2 a 5 minutos e acesse `https://SEU-USUARIO.github.io/NOME-DO-REPO/`.

## Gerar o APK com o PWA Builder

1. Acesse https://www.pwabuilder.com/
2. Cole o link do seu site publicado e clique em **Start**.
3. Confira o relatório e clique em **Package for stores > Android**.
4. Baixe o arquivo **APK** e instale no celular (permitir "instalar apps de fontes desconhecidas").
