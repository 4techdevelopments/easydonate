## Funcionalidades
### Para Doadores

- Cadastro Simplificado - Pessoa Física ou Jurídica<br>
- Busca Inteligente - Encontre ONGs por tipo de doação<br>
- Mapa Interativo - Visualize ONGs próximas a você<br>
- Comunicação Direta - Integração com WhatsApp<br>
- Histórico Completo - Acompanhe suas doações<br>
- Perfil Personalizado - Upload de foto e dados

### Para ONGs

- Cadastro Institucional - Com validação de CNPJ<br>
- Perfil Customizado - Logo e informações da organização<br>
- Gestão de Doações - Acompanhe e confirme recebimentos<br>
- Visibilidade - Apareça no mapa para doadores próximos<br>

## Tipos de Doação Suportados

- Alimentos - Alimentos não perecíveis e ração<br>
- Roupas - Vestuário em bom estado<br>
- Dinheiro - Via PIX com integração WhatsApp<br>
- Outros - Brinquedos, materiais, etc.

## Tecnologias Utilizadas

- React Native 0.79.4 - Framework mobile multiplataforma<br>
- Expo SDK 53 - Plataforma de desenvolvimento<br>
- TypeScript 5.8.3 - Tipagem estática

## Navegação e Estado

- Expo Router - Navegação baseada em arquivos<br>
- Context API - Gerenciamento de estado global<br>
- Expo Secure Store - Armazenamento seguro de tokens

## UI/UX

- React Native Maps - Mapas nativos iOS/Android<br>
- Lottie React Native - Animações vetoriais<br>
- React Native Modal - Modais customizados<br>
- Expo Image Picker - Seleção de imagens<br>
- Linear Gradient - Gradientes visuais

## Integração

- Axios - Cliente HTTP para API REST<br>
- JWT Decode - Decodificação de tokens<br>
- Expo Linking - Integração com WhatsApp<br>
- ImgBB API - Hospedagem de imagens

## Pré-requisitos

- Node.js 18 ou superior<br>
- npm ou yarn<br>
- Expo CLI (npm install -g expo-cli)<br>
- Expo Go app (iOS/Android) para testes<br>
- Git<br>
- API EasyDonate rodando localmente

## Instalação e Configuração
1. Clone o repositório

```bash
git clone https://github.com/guilherme-rodrigues-de-queiroz/easydonate.git
```

2. Selecione o diretório

```bash
cd easydonate
```

3. Instale as dependências (npm ou yarn)

```bash
npm install
```
```bash
yarn install
```

4. Configure a API

4.1. Edite o arquivo api/axios.ts e configure o IP da sua API:

```typescript
const api = axios.create({
    baseURL: "http://SEU_IP_LOCAL:5062/api",
    headers: {
        "Content-Type": "application/json"
    },
});
```

4.2. Como encontrar seu IP:

- Windows: ipconfig no cmd<br>
- macOS/Linux: ifconfig no terminal<br>
- Use o IPv4 da sua rede local (ex: 192.168.0.0)

5. Execute o projeto
```bash
npx expo start  #iniciar o app
```
```bash
npx expo start -c  # iniciar o app limpando cache
```

6. Abra no dispositivo

- Escaneie o QR Code com o Expo Go ou use um emulador Android/iOS configurado

## Estrutura do Projeto
```bash
easydonate/
├── app/                      # Rotas e telas (Expo Router)
│   ├── (auth)/              # Telas autenticadas
│   │   ├── _layout.tsx      # Layout do grupo
│   │   ├── home.tsx         # Tela principal
│   │   ├── ongs.tsx         # Mapa de ONGs
│   │   ├── doacoes.tsx      # Histórico de doações
│   │   ├── configuracoes.tsx # Configurações
│   │   ├── conta.tsx        # Perfil do usuário
│   │   ├── ongDetalhes.tsx  # Detalhes da ONG
│   │   └── addLocalizacoes.tsx # Admin only
│   ├── (public)/            # Telas públicas
│   │   ├── _layout.tsx      # Layout do grupo
│   │   ├── inicio.tsx       # Landing page
│   │   ├── login.tsx        # Login
│   │   └── cadastro.tsx     # Cadastro
│   ├── _layout.tsx          # Layout raiz
│   └── index.tsx            # Entry point
├── components/              # Componentes reutilizáveis
│   ├── AvatarUploader.tsx  # Upload de avatar
│   ├── bottomNavigation.tsx # Navegação inferior
│   ├── Colors.tsx           # Paleta de cores
│   ├── CustomInput.tsx      # Input customizado
│   ├── DisplayAvatar.tsx    # Exibição de avatar
│   ├── dropdown.tsx         # Componente dropdown
│   ├── modalDoacao.tsx      # Modal de doação
│   ├── modalOngs.tsx        # Lista de ONGs
│   ├── ModalFeedback.tsx    # Modal de feedback
│   ├── ongCard.tsx          # Card de ONG
│   └── ...                  # Outros componentes
├── contexts/                # Contextos React
│   └── ModalFeedbackContext.tsx
├── routes/                  # Configuração de rotas
│   ├── AuthContext.tsx      # Contexto de autenticação
│   └── PrivateRoute.tsx     # Rotas protegidas
├── types/                   # TypeScript types
│   ├── Doador.ts
│   └── Ong.ts
├── api/                     # Configuração API
│   └── axios.ts
├── assets/                  # Recursos estáticos
│   ├── fonts/              # Fontes customizadas
│   └── images/             # Imagens e ícones
└── package.json            # Dependências
```

## Componentes Principais
- AuthContext
- Gerencia autenticação e estado do usuário:
- typescriptconst { isAuthenticated, usuario, login, logout, atualizarUsuario } = useAuth();
- PrivateRoute
- Protege rotas que requerem autenticação:
```typescript
<PrivateRoute>
  <SuaTela />
</PrivateRoute>
```
- ModalFeedback
- Sistema unificado de feedback:
```typescript
const { mostrarModalFeedback } = useModalFeedback();
mostrarModalFeedback("Mensagem", "success" | "error");
```
- AvatarUploader
- Upload e preview de imagens:
```typescript
<AvatarUploader size={150} />
```

## Fluxo de Uso
1. Primeiro Acesso<br>

- Início → Cadastre-se → Selecionar Tipo (Doador/ONG) → Preencher Dados → Confirmar

2. Doação<br>

- Login → Home → Buscar ONG → Ver Detalhes → Doe Agora → Confirmar → WhatsApp

3. Acompanhamento<br>

- Login → Doações → Filtrar Status → Ver Detalhes → Acompanhar

## Solução de Problemas

1. Erro de conexão com API

- Verifique se a API está rodando
- Confirme o IP em api/axios.ts
- Certifique-se que dispositivo e API estão na mesma rede

2. Erro de permissão de localização

- Aceite as permissões no dispositivo
- Para iOS: Configurações > Privacidade > Localização
- Para Android: Configurações > Apps > EasyDonate > Permissões

3. Cache corrompido
```bash
npx expo start -c
```
```bash
npm cache clean --force
```
```bash
rm -rf node_modules
```
```bash
npm install
```

## Padrões de Código

- Use TypeScript para type safety
- Componentes funcionais com hooks
- Nomes descritivos em português
- Comentários quando necessário
- Teste antes de commitar

## Versões Suportadas

- iOS: 13.0+
- Android: 6.0+ (API 23)
- Expo Go: Última versão

## Segurança

- Tokens JWT armazenados com Expo Secure Store
- Comunicação HTTPS em produção
- Validação de inputs
- Sanitização de dados
- Permissões mínimas necessárias

## Performance

- Lazy loading de componentes
- Otimização de imagens
- Memoização de componentes pesados
- Paginação em listas grandes
- Cache de requisições

## Time

- Guilherme Rodrigues de Queiroz - Desenvolvedor Back-End
- Marcos Junior Bueno Selzler - Desenvolvedor Front-End<br><br><br>

<img src="https://img.shields.io/badge/React_Native-0.79.4-blue"></img>
<img src="https://img.shields.io/badge/Expo-SDK_53-black"></img>
<img src="https://img.shields.io/badge/TypeScript-5.8.3-blue"></img>
