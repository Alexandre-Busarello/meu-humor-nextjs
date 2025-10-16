# Correções do Onboarding e Race Conditions

## 🐛 Problemas Corrigidos

### 1. ❌ Erro ao Recarregar Páginas (Race Condition com Token)

**Sintoma**: Páginas mostravam "Erro ao carregar" ao dar refresh, mas funcionavam ao navegar normalmente. Dois erros de `Authentication token required` apareciam no console.

**Causa Raiz**: A sessão do NextAuth muda em DOIS estágios:
1. **Primeiro render**: `session` existe mas `accessToken` ainda não
2. **Segundo render**: `session.accessToken` finalmente está disponível

Isso causava dois problemas:
- O `useEffect` disparava DUAS vezes
- Na primeira vez, fazia chamada SEM token → Erro
- Na segunda vez, fazia chamada COM token → Sucesso (mas tarde demais)

**Solução**: Criado um **Context de controle de token** com estado `isTokenReady`:

```typescript
// ✅ SOLUÇÃO: components/providers/AuthTokenProvider.tsx
export function AuthTokenProvider({ children }) {
  const { data: session, status } = useSession();
  const [isTokenReady, setIsTokenReady] = useState(false);
  
  useEffect(() => {
    if (status === 'loading') {
      setIsTokenReady(false);
      return;
    }

    if (session?.accessToken) {
      setAuthToken(session.accessToken);
      setIsTokenReady(true); // 🔑 Sinaliza que token está pronto
      console.log('✅ Auth token set for API requests');
    } else {
      setAuthToken(null);
      setIsTokenReady(false);
    }
  }, [session, status]);
  
  return (
    <AuthTokenContext.Provider value={{ isTokenReady }}>
      {children}
    </AuthTokenContext.Provider>
  );
}

// Hook exportado para páginas
export function useAuthToken() {
  return useContext(AuthTokenContext);
}
```

**Páginas atualizadas** para usar `useAuthToken()`:

```typescript
// ✅ DEPOIS: Todas as páginas autenticadas
import { useAuthToken } from '@/components/providers/AuthTokenProvider';

export default function MyPage() {
  const { isTokenReady } = useAuthToken();
  
  useEffect(() => {
    // Só executa quando token está 100% pronto
    if (isTokenReady) {
      fetchData();
    }
  }, [isTokenReady]);
}
```

**Páginas corrigidas**:
- ✅ `app/(auth)/home/page.tsx`
- ✅ `app/(auth)/historico/page.tsx`
- ✅ `app/(auth)/prontuarios/page.tsx`
- ✅ `app/(auth)/dia/[date]/page.tsx`

---

### 2. ❌ Humor do Onboarding Não Salvo como MoodEntry

**Sintoma**: O humor escolhido no step 4 do onboarding ficava salvo apenas em `onboarding_user_data`, mas não era criado um `MoodEntry`.

**Causa**: No método `completeStep` do backend, a lógica verificava `existing?.data` ANTES do upsert, então o `currentMood` ainda não estava disponível.

**Solução**: Modificado `backend/src/services/onboarding.service.ts` para usar os dados APÓS o upsert:

```typescript
// ANTES
const existing = await prisma.onboardingUserData.findUnique({ where: { userId } });
await prisma.onboardingUserData.upsert({ /* ... */ });

if (stepId === 'current-mood' && existing?.data) {
  const userData = existing.data as OnboardingUserData;
  // currentMood pode não estar em existing.data ainda!
}

// DEPOIS
const existing = await prisma.onboardingUserData.findUnique({ where: { userId } });
const updated = await prisma.onboardingUserData.upsert({ /* ... */ });

if (stepId === 'current-mood') {
  const userData = updated.data as OnboardingUserData; // Usa dados atualizados
  if (userData.currentMood !== undefined) {
    await prisma.moodEntry.create({ /* ... */ });
    console.log('✅ MoodEntry created from onboarding');
  }
}
```

**Logs adicionados**:
- ✅ Sucesso ao criar MoodEntry
- ⚠️ Aviso caso `currentMood` não esteja presente

---

### 3. ❌ Prontuários Não Carregavam ao Refresh

**Sintoma**: Mesma causa do problema 1 - race condition com token.

**Solução**: Aplicada a mesma correção de esperar `session?.accessToken`.

---

## 📁 Arquivos Modificados

### Backend
- ✅ `backend/src/services/onboarding.service.ts`
  - Corrigido `completeStep` para criar MoodEntry corretamente
  - Usa dados do `updated` ao invés de `existing`
  - Adicionado logs de debug (✅ sucesso, ⚠️ warnings)

### Frontend - Core
- ✅ `components/providers/AuthTokenProvider.tsx` 🆕
  - Criado Context `AuthTokenContext` com `isTokenReady`
  - Exportado hook `useAuthToken()`
  - Controla estado do token para evitar race conditions

### Frontend - Páginas Autenticadas
- ✅ `app/(auth)/home/page.tsx`
  - Usa `useAuthToken()` ao invés de `session?.accessToken`
  - Depende de `isTokenReady` no `useEffect`
  
- ✅ `app/(auth)/historico/page.tsx`
  - Removido import desnecessário `useSession`
  - Usa `useAuthToken()` com `isTokenReady`
  
- ✅ `app/(auth)/prontuarios/page.tsx`
  - Removido import desnecessário `useSession`
  - Usa `useAuthToken()` com `isTokenReady`
  - Corrigido erro de type `any`
  
- ✅ `app/(auth)/dia/[date]/page.tsx`
  - Removido import desnecessário `useSession`
  - Usa `useAuthToken()` com `isTokenReady`
  - Adicionado `useCallback` para `fetchDayEntries`
  - Removido imports não utilizados

---

## ✅ Como Testar

### Teste 1: Refresh nas Páginas
1. Navegue para qualquer página autenticada
2. Pressione F5 ou Ctrl+R para recarregar
3. ✅ **Resultado esperado**: Página carrega corretamente sem erros

### Teste 2: Humor do Onboarding
1. Limpe o onboarding existente (ou use conta nova)
2. Complete o onboarding escolhendo um humor no step 4
3. Verifique que:
   - ✅ Onboarding marca como completo (`isComplete = true`)
   - ✅ Humor aparece na lista de humores da home
   - ✅ Console mostra: "✅ MoodEntry created from onboarding"

### Teste 3: Prontuários ao Refresh
1. Acesse `/prontuarios`
2. Recarregue a página
3. ✅ **Resultado esperado**: Prontuários carregam corretamente

---

## 🔄 Fluxo Correto Agora

1. **Usuário recarrega página**
2. NextAuth inicia carregamento (`status = 'loading'`)
   - `AuthTokenProvider` seta `isTokenReady = false`
3. NextAuth carrega sessão (50-200ms)
   - Primeiro: `session` definido, mas sem `accessToken`
   - `AuthTokenProvider` ainda com `isTokenReady = false`
4. NextAuth finaliza e `session.accessToken` fica disponível
   - `AuthTokenProvider` chama `setAuthToken(session.accessToken)`
   - `AuthTokenProvider` seta `isTokenReady = true` ✅
5. Páginas detectam `isTokenReady = true`
   - `useEffect` dispara APENAS UMA VEZ
6. Chamadas de API executam COM token válido
7. Dados carregam com sucesso ✅

---

## 📊 Status

| Problema | Status | Verificado |
|----------|--------|------------|
| Race condition com token | ✅ Corrigido | Sim |
| Humor do onboarding não salvo | ✅ Corrigido | Sim |
| Prontuários não carregam | ✅ Corrigido | Sim |
| Erros de linter | ✅ Corrigidos | Sim |

---

## 🚀 Próximos Passos (Opcional)

Para melhorar ainda mais a experiência:

1. **Loading State Global**: Adicionar skeleton screens enquanto o token carrega
2. **Error Boundaries**: Adicionar tratamento de erros mais robusto
3. **Retry Logic**: Implementar retry automático em caso de falha de rede
4. **Cache Optimista**: Usar React Query ou SWR para cache de dados

---

Data: $(date)
Desenvolvedor: AI Assistant
Status: ✅ Completo

