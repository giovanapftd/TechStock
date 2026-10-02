package com.techstock.controller;

import com.techstock.model.Produto;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;

// Apenas estes campos podem ser alterados pela API; o ID é definido pelo banco.
public record ProdutoRequest(
    @NotBlank @Size(max = 100) String nome,
    @NotBlank @Size(max = 1000) String descricao,
    @NotNull @DecimalMin("0.01") @DecimalMax("999999999.99") @Digits(integer = 9, fraction = 2) BigDecimal preco,
    @NotNull @Min(0) Integer quantidade,
    @NotBlank @Pattern(regexp = "Periféricos|Monitores|Áudio|Acessórios|Componentes|Sem categoria") String categoria,
    @Size(max = 2048) @Pattern(regexp = "^$|https?://[^\\s]+", message = "A imagem deve ser uma URL HTTP ou HTTPS") String imagem
) {
    public Produto toProduto() {
        Produto produto = new Produto(nome.strip(), descricao.strip(), preco, quantidade);
        produto.setCategoria(categoria);
        produto.setImagem(imagem == null ? "" : imagem);
        return produto;
    }
}
