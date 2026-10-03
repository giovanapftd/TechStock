# TechStock

Projeto acadêmico de catálogo e gerenciamento de produtos, com React + Vite no frontend, Spring Boot no backend e PostgreSQL em Docker.

## Funcionalidades

- Loja, catálogo com pesquisa e categorias e detalhes dos produtos.
- Cadastro e login do usuário comum; sessão mantida por cookie e saída da conta.
- Carrinho salvo no navegador, com preços do banco e quantidades limitadas ao estoque.
- Dashboard administrativo com total de produtos, unidades em estoque, estoque baixo (até 5 unidades, incluindo zero) e cinco cadastros mais recentes.
- Cadastro, edição e exclusão de produtos no banco, autorizados pelo backend somente para administradores.

Esta versão não realiza pedidos, pagamentos ou reservas de estoque. O carrinho pertence ao navegador, não é salvo na conta nem no banco e não sincroniza entre dispositivos. O frontend é executado pelo Vite; o Docker Compose inicia o backend e o PostgreSQL.
