package com.techstock.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.http.converter.HttpMessageNotReadableException;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> dadosInvalidos(MethodArgumentNotValidException erro) {
        var campos = erro.getBindingResult().getFieldErrors().stream()
            .collect(Collectors.toMap(item -> item.getField(), item -> item.getDefaultMessage(), (primeiro, segundo) -> primeiro));
        return ResponseEntity.badRequest().body(Map.of("mensagem", "Confira os dados informados.", "campos", campos));
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<?> formatoInvalido() {
        return ResponseEntity.badRequest().body(Map.of("mensagem", "Os dados enviados estão em um formato inválido."));
    }


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
