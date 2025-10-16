# 👋 LEIA-ME PRIMEIRO!

## 🎉 Novos Comandos Simplificados Disponíveis!

O projeto agora possui comandos unificados que facilitam muito o desenvolvimento!

---

## ⚡ Início Rápido

### Se você é novo no projeto:

```bash
# 1. Instale TUDO de uma vez
npm run install:all

# 2. Configure os .env (veja SETUP_INSTRUCTIONS.md)

# 3. Configure o banco
cd backend && npm run prisma:generate && npm run prisma:migrate && cd ..

# 4. Rode o projeto completo
npm run dev
```

**Pronto!** 🚀
- Backend: http://localhost:3001
- Frontend: http://localhost:3000

---

### Se você já tem o projeto configurado:

```bash
# Apenas rode!
npm run dev
```

---

## 📋 Comandos Principais

| Comando | O que faz |
|---------|-----------|
| `npm run install:all` | Instala deps do frontend + backend |
| `npm run dev` | Roda frontend + backend simultaneamente |
| `npm run dev:backend` | Roda apenas o backend |
| `npm run dev:frontend` | Roda apenas o frontend |

---

## 📚 Documentação

### Para começar:
1. **[Quick Start](./docs/getting-started/QUICK_START.md)** - Setup em 5 minutos
2. **[Comandos](./docs/reference/COMANDOS.md)** - Todos os comandos disponíveis
3. **[Exemplo de Uso](./docs/reference/EXEMPLO_USO.md)** - Casos práticos e troubleshooting

### Documentação completa:
- **[README.md](./README.md)** - Visão geral do projeto
- **[Setup Instructions](./docs/getting-started/SETUP_INSTRUCTIONS.md)** - Setup detalhado
- **[IMPLEMENTATION_STATUS.md](./IMPLEMENTATION_STATUS.md)** - Status da migração

### Referência técnica:
- **[Novos Comandos Summary](./docs/technical/NOVOS_COMANDOS_SUMMARY.md)** - Resumo das mudanças
- **[Exemplos de Output](./docs/technical/.comandos-exemplos.txt)** - Exemplos de saída dos comandos

### Índice Completo:
- **[📚 Documentation Index](./docs/README.md)** - Estrutura completa da documentação

---

## 🎯 Fluxo Recomendado

### Primeira Vez:
1. Leia este arquivo (✅ você está aqui!)
2. Siga [Quick Start](./docs/getting-started/QUICK_START.md)
3. Consulte [Comandos](./docs/reference/COMANDOS.md) quando necessário

### Desenvolvimento Diário:
```bash
npm run dev  # É só isso! 🎉
```

---

## 💡 Diferença dos Comandos Antigos

### Antes:
```bash
# Terminal 1
cd backend
npm run dev

# Terminal 2
npm run dev
```

### Agora:
```bash
# Um comando, um terminal!
npm run dev
```

---

## 🆘 Precisa de Ajuda?

1. **Problemas de setup?** → [Setup Instructions](./docs/getting-started/SETUP_INSTRUCTIONS.md) (seção Troubleshooting)
2. **Não sabe qual comando usar?** → [Comandos](./docs/reference/COMANDOS.md)
3. **Quer ver exemplos práticos?** → [Exemplo de Uso](./docs/reference/EXEMPLO_USO.md)
4. **Erros ao rodar?** → [Exemplos de Output](./docs/technical/.comandos-exemplos.txt)
5. **Ver tudo organizado?** → [Documentation Index](./docs/README.md)

---

## ✨ O Que Mudou?

Foi adicionado ao `package.json` raiz:

```json
{
  "scripts": {
    "install:all": "npm install && cd backend && npm install",
    "dev": "concurrently \"npm run dev:backend\" \"npm run dev:frontend\"",
    "dev:backend": "cd backend && npm run dev",
    "dev:frontend": "next dev --turbopack"
  }
}
```

Isso permite gerenciar frontend e backend de um único lugar! 🎉

---

## 🚀 Próximos Passos

Depois de rodar o projeto:

1. Acesse http://localhost:3000
2. Crie uma conta
3. Faça login
4. Registre seu primeiro humor
5. Explore as funcionalidades!

---

## 📞 Contato

Se tiver dúvidas ou problemas, consulte a documentação listada acima ou entre em contato com a equipe.

---

**Bem-vindo ao Meu Humor!** 💙

*Última atualização: 2025-10-15*

