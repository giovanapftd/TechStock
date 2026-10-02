package com.techstock.model;

import jakarta.persistence.*; // Anotações do JPA
import jakarta.validation.constraints.*; // Regras de validação
import java.math.BigDecimal; // Armazenar Valores Monetários

@Entity // Diz Para o Spring que essa classe representa algo salvo no banco
@Table(name = "produtos") // Define o Nome da Tabela no BANCO DE DADOS
public class Produto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Gera os IDs Automaticamente
    private Long id;

    // Regras Para Validação Do Cadastro De Produtos
    @NotBlank(message = "Nome é obrigatório")
    private String nome;

    @NotBlank(message = "Descrição é obrigatória")
    @Column(length = 1000)
    private String descricao;

    @DecimalMin(
            value = "0.0",
            message = "Preço deve ser positivo"
    )
    private BigDecimal preco;

    @Min(
            value = 0,
            message = "Quantidade não pode ser negativa"
    )
    private Integer quantidade;

    @Column(length = 60)
    private String categoria;
    @Column(length = 2048)
    private String imagem;

    public String getCategoria() { return categoria == null || categoria.isBlank() ? "Sem categoria" : categoria; }
    public void setCategoria(String categoria) { this.categoria = categoria; }
    public String getImagem() { return imagem; }
    public void setImagem(String imagem) { this.imagem = imagem; }


    // Construtor Vazio Exigido Pelo JPA
    public Produto() {
    }


    // Construtor com os Dados dos Produto
    public Produto(
            String nome,
            String descricao,
            BigDecimal preco,
            Integer quantidade
    ) {
        this.nome = nome;
        this.descricao = descricao;
        this.preco = preco;
        this.quantidade = quantidade;
    }


    // GET e SET do ID
    public Long getId() {
        return id;
    }


    // GET e SET do Nome
    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }


    // GET e SET da Descrição
    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }


    // GET e SET do Preço
    public BigDecimal getPreco() {
        return preco;
    }

    public void setPreco(BigDecimal preco) {
        this.preco = preco;
    }


    // GET e SET da Quantidade
    public Integer getQuantidade() {
        return quantidade;
    }

    public void setQuantidade(Integer quantidade) {
        this.quantidade = quantidade;
    }
}
