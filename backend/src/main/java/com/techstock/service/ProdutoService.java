package com.techstock.service;

import com.techstock.exception.ProdutoNaoEncontradoException;
import com.techstock.model.Produto;
import com.techstock.repository.ProdutoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProdutoService {
    private final ProdutoRepository produtoRepository;

    public ProdutoService(ProdutoRepository produtoRepository) {
        this.produtoRepository = produtoRepository;
    }

    public Produto buscarPorId(Long id) {
        return produtoRepository.findById(id)
            .orElseThrow(() -> new ProdutoNaoEncontradoException("Produto não encontrado"));
    }

    public Produto atualizar(Long id, Produto produtoAtualizado) {
        Produto produto = buscarPorId(id);

        produto.setNome(produtoAtualizado.getNome());
        produto.setDescricao(produtoAtualizado.getDescricao());
        produto.setPreco(produtoAtualizado.getPreco());
        produto.setQuantidade(produtoAtualizado.getQuantidade());

        return produtoRepository.save(produto);
    }

    public void excluir(Long id) {
        Produto produto = buscarPorId(id);
        produtoRepository.delete(produto);
    }


    
    public List<Produto> listarTodos(){
        return produtoRepository.findAll();
    }

    public Produto salvar(Produto produto){
        return produtoRepository.save(produto);
    }
}
