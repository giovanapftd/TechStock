package com.techstock.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {


    @ExceptionHandler(ProdutoNaoEncontradoException.class)
    public ResponseEntity<?> produtoNaoEncontrado(
            ProdutoNaoEncontradoException erro) {


        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(
                    Map.of(
                        "status", 404,
                        "mensagem", erro.getMessage()
                    )
                );
    }
}