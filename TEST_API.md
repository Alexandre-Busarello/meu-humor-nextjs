# Como Testar a API com CURL

## 1. Registrar ou Fazer Login

```bash
# Registrar
curl -X POST http://localhost:4000/api/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"email":"test@example.com","password":"Test123456"}'

# OU Fazer Login
curl -X POST http://localhost:4000/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"test@example.com","password":"Test123456"}'
```

**Salve o token da resposta!** Exemplo:
```json
{
  "user": { "id": "...", "email": "..." },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## 2. Usar o Token nas Requisições

**Importante:** Inclua `Authorization: Bearer {TOKEN}` em todos os endpoints protegidos!

```bash
# Substitua SEU_TOKEN_AQUI pelo token recebido
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Criar mood entry
curl -X POST http://localhost:4000/api/mood-entries \
  -H 'Content-Type: application/json' \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "timestamp": 1760567037104,
    "score": 3,
    "note": "Bem"
  }'

# Listar mood entries
curl http://localhost:4000/api/mood-entries \
  -H "Authorization: Bearer $TOKEN"

# Obter usuário atual
curl http://localhost:4000/api/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

## 3. Endpoints Disponíveis

### Públicos (sem token)
- `POST /api/auth/register` - Registrar
- `POST /api/auth/login` - Login

### Protegidos (requerem token)
- `GET /api/auth/me` - Dados do usuário
- `GET /api/mood-entries` - Listar humores
- `POST /api/mood-entries` - Criar humor
- `PUT /api/mood-entries/:id` - Atualizar humor
- `DELETE /api/mood-entries/:id` - Deletar humor
- `GET /api/health-records` - Listar prontuários
- `POST /api/health-records` - Gerar prontuário
- `GET /api/mood-patterns/*` - Padrões de humor

## 4. Exemplo Completo

```bash
# 1. Login e capturar token
RESPONSE=$(curl -s -X POST http://localhost:4000/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"busamar@gmail.com","password":"Busa@123"}')

# 2. Extrair token (requer jq)
TOKEN=$(echo $RESPONSE | jq -r '.token')

echo "Token: $TOKEN"

# 3. Fazer requisição protegida
curl http://localhost:4000/api/mood-entries \
  -H "Authorization: Bearer $TOKEN"
```

## 5. Erro 401 Unauthorized

Se você receber erro 401, significa que:
- ❌ Falta o header `Authorization`
- ❌ Token inválido ou expirado
- ❌ Token no formato errado (deve ser `Bearer {token}`)

**Solução:** Faça login novamente e use o token recebido.

