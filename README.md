# 🐾 API de Adoção de Pets - Projeto Trainee Unect.Jr

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white) ![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white) ![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white) ![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white) ![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)

## 🌟 Sobre o Projeto

Esta API RESTful foi desenvolvida como projeto final da minha capacitação trainee em Desenvolvimento Back-end na **Unect.Jr**, empresa júnior de Tecnologia da Informação da **Universidade Tecnológica Federal do Paraná (UTFPR-CP)**. O objetivo foi aplicar os conhecimentos adquiridos na capacitação ofertada pela EJ para construir um sistema completo para adoção de pets, permitindo o gerenciamento de usuários e pets, além do processo de adoção.

## 🛠️ Estrutura do Projeto

O projeto visou seguir o Padrão MVC e está organizado da seguinte forma:

- ├── config/ # Configurações (ex: conexão com o banco de dados
- ├── controllers/ # Lógica de negócio e manipulação de requisições
- ├── docs/ # Arquivos de documentação (swagger.yaml)
- ├── helpers/ # Funções utilitárias (ex: criação de token, verificação)
- ├── models/ # Schemas do Mongoose para o banco de dados
- ├── routes/ # Definição das rotas da API
- ├── .env.example # Exemplo de arquivo de variáveis de ambiente
- ├── app.js # Ponto de entrada principal da aplicação Express
- ├── package.json # Metadados do projeto e dependências
- └── README.md # Este arquivo

## ⚙️ Pré-requisitos

Antes de começar, você precisará ter instalado em sua máquina:

*   [Node.js](https://nodejs.org/) (versão LTS recomendada)
*   [MongoDB](https://www.mongodb.com/try/download/community) (uma instância rodando localmente ou um URI de conexão para um serviço cloud como MongoDB Atlas)
*   [NPM](https://www.npmjs.com/) (geralmente vem com o Node.js) ou [Yarn](https://yarnpkg.com/)

## 🚀 Rodando a Aplicação

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/joaovitorrom/API-Sistema-Pets.git
    cd API-Sistemas-Pets
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```
    Ou, se você usa Yarn:
    ```bash
    yarn install
    ```

3.  **Configure as variáveis de ambiente:**
    Crie um arquivo `.env` na raiz do projeto, baseado no `.env.example`.
    ```ini
    # .env
    PORT=5000
    MONGO_URI=mongodb://localhost:27017/sua_database_adocao_pets
    SECRET=SEU_SEGREDO_JWT
    ```
    *   `PORT`: Porta onde o servidor irá rodar.
    *   `MONGO_URI`: Sua string de conexão com o MongoDB.
    *   `SECRET`: Uma string secreta complexa para a assinatura dos tokens JWT.

4.  **Inicie o servidor:**
    ```bash
    npm start
    ```
    O servidor estará rodando em `http://localhost:5000` (ou a porta que você definiu).

## 📖 Documentação da API (Swagger)

A documentação completa e interativa da API, gerada com Swagger, está disponível em:

➡️ **[http://localhost:5000/api-docs](http://localhost:5000/api-docs)** (após iniciar o servidor)

Lá você poderá visualizar todos os endpoints, parâmetros, corpos de requisição e respostas esperadas, além de testar a API diretamente pelo navegador.

## 💡 Possíveis Melhorias Futuras

Embora este projeto seja funcional e completo para os propósitos da capacitação, algumas melhorias futuras poderiam incluir:

*   Implementação de testes unitários e de integração (ex: com Jest, Supertest).
*   Tratamento de erros mais granular e centralizado.
*   Funcionalidade de upload de imagens para os pets.
*   Validação de dados mais robusta utilizando bibliotecas como Joi ou Zod.
*   Implementação de paginação nas listagens de pets.
*   Configuração de um pipeline de CI/CD.
*   Notificações para usuários (ex: sobre agendamentos).


## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE.md) para mais detalhes (você pode adicionar um arquivo LICENSE.md com o texto da licença MIT, se desejar).

---
