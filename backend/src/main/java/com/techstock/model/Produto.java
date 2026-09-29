package com.techstock.model;

import jakarta.persistence.*;   /* Anotações de JPA */
import java.math.BigDecimal;   /* Armazenar Valores Monetários */


@Entity   /* Diz Para o Spring Que Essa Classe Representa Algo Que Será Salvo no Banco */
@Table(name = "produtos")   /* Tabela Chamada PRODUTOS */
public class Produto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)   /* Gerar ID's Automaticamente */
    private Long id;
    private String nome;
    private String descricao;
    private BigDecimal preco;
    private Integer quantidade;

    public Produto(){
    }

    public Produto(String nome, String descricao, BigDecimal preco, Integer quantidade) {
        this.nome = nome;
        this.descricao = descricao;
        this.preco = preco;
        this.quantidade = quantidade;
    }



    public Long getId(){
        return id;
    }


    public String getNome(){
        return nome;
    }
    public void setNome(String nome){
        this.nome = nome;
    }


    public String getDescricao(){
        return descricao;
    }
    public void setDescricao (String descricao){
        this.descricao = descricao;
    }


    public BigDecimal getPreco(){
        return preco;
    }
    public void setPreco(BigDecimal preco){
        this.preco = preco;
    }


    public Integer getQuantidade(){
        return quantidade;
    }
    public void setQuantidade(Integer quantidade){
        this.quantidade = quantidade;
    }
}
