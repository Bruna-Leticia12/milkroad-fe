
# 💻 Milkroad

Interface web desenvolvida em **Angular 17+** para o sistema **Milk Road**, que realiza a gestão de clientes, entregas e rotas de forma intuitiva e responsiva.  
Esta aplicação consome os serviços REST do **API Milk Road back-end** e foi estruturada para atender perfis de usuários **ADMIN** e **CLIENTE**.

---

## 📄 Índice
1. [Visão Geral](#-visão-geral)
2. [Tecnologias Utilizadas](#-tecnologias-utilizadas)
3. [Estrutura do Projeto](#-estrutura-do-projeto)
4. [Componentes Principais](#-componentes-principais)
5. [Serviços e Modelos](#-serviços-e-modelos)
6. [Guarda de Rotas e Interceptadores](#-guarda-de-rotas-e-interceptadores)
7. [Configuração do Ambiente](#-configuração-do-ambiente)
8. [Como Executar o Projeto](#-como-executar-o-projeto)
9. [Autores](#-autores)

---

## 🌐 Visão Geral

O **Milkroad Front-End** oferece uma interface moderna e responsiva, construída com **Angular Material** e **SCSS**, proporcionando uma navegação fluida e amigável para o usuário.

As principais funções da aplicação incluem:
- Login e autenticação de usuários.
- Acesso a menus diferenciados conforme o perfil (ADMIN ou CLIENTE).
- Cadastro, listagem e atualização de clientes.
- Gerenciamento de entregas e rotas com integração ao Google Maps.
- Controle de sessões com JWT e redirecionamento automático.

---

## 📂 Tecnologias Utilizadas

| Categoria | Ferramenta |
|------------|-------------|
| Framework principal | Angular 17+ |
| Linguagem | TypeScript |
| Estilos | SCSS |
| UI | Angular Material |
| Mapas | Google Maps API |
| Gerenciamento de autenticação | JWT + Interceptor |

---

## 🧱 Estrutura do Projeto

```
src/
├── app/
│   ├── components/
│   │   ├── atualizacao-rota/
│   │   ├── cadastro-cliente/
│   │   ├── cancelar-entrega/
│   │   ├── lista-cliente/
│   │   ├── lista-entrega/
│   │   ├── login/
│   │   └── menu/
│   ├── environments/
│   │    ├── environment.ts
│   │    └── environment.prod.ts
│   ├── guards/
│   │   └── auth.guard.ts
│   ├── models/
│   │   ├── cliente.model.ts
│   │   ├── entrega.model.ts
│   │   ├── login-request.model.ts
│   │   └── login-response.model.ts
│   ├── services/
│   │   ├── api.service.ts
│   │   ├── auth.service.ts
│   │   ├── cliente.service.ts
│   │   └── google-maps-loader.service.ts
│   ├── app-routing.module.ts
│   ├── app.component.ts
│   ├── app.module.ts
│   └── auth.interceptor.ts
├── assets/
├── index.html
├── main.ts
├── styles.scss
├── package-lock.json
├── package.json
└── README.md

```

---

## 🧩 Componentes Principais

### Login (`login.component`)
Tela de autenticação com validação de e-mail e senha.  
Ao efetuar login, o token JWT é armazenado no `localStorage` e o redirecionamento ocorre conforme o perfil.

### Menu (`menu.component`)
Menu centralizado com botões de acesso às principais funcionalidades.  
Inclui opções exclusivas para administradores e botão de retorno ao login.

### Cadastro de Cliente (`cadastro-cliente.component`)
Permite o registro de novos clientes. Apenas administradores têm acesso.

### Lista e Cancelamento de Entregas
Componentes dedicados à visualização e gestão de entregas.  
Integrados com Google Maps e acesso protegido por autenticação.

---

## 🔧 Serviços e Modelos

### `api.service.ts`
Gerencia as chamadas HTTP para o back-end, adicionando automaticamente cabeçalhos e tokens quando necessário.

### `auth.service.ts`
Responsável pelo login, armazenamento de dados de sessão e logout.

### `cliente.service.ts`
Fornece métodos de CRUD para clientes (listar, buscar, atualizar, ativar/desativar).

### `google-maps-loader.service.ts`
Carrega dinamicamente a API do Google Maps para componentes que exibem rotas e entregas.

---

## 🔑 Guarda de Rotas e Interceptadores

### `auth.guard.ts`
Verifica se o usuário está autenticado e, se necessário, restringe o acesso com base no perfil.

### `auth.interceptor.ts`
Anexa o token JWT a todas as requisições (exceto login) e trata erros 401, redirecionando para login.

---

## ⚙️ Configuração do Ambiente

| Arquivo | Descrição |
|----------|------------|
| `environment.ts` | Ambiente de desenvolvimento |
| `environment.prod.ts` | Ambiente de produção |
| `apiBaseUrl` | URL da API do back-end (ex: `http://localhost:8080/api`) |

---

## 🚀 Como Executar o Projeto

### 1️⃣ Instalar dependências
```bash
npm install
```

### 2️⃣ Rodar o projeto localmente
```bash
npm start
```
Acesse em: [http://localhost:4200](http://localhost:4200)

### 3️⃣ Build para produção
```bash
npm run build
```

---

## 👩‍💻 Autores
- [Bruna Letícia](https://github.com/Bruna-Leticia12)
- [Abdiel Junio](https://github.com/abdieljunio)
- [Lorhayne Lopes](https://github.com/LorhayneLopes)