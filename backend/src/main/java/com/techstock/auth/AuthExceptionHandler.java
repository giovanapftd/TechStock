package com.techstock.auth;

import java.util.Map;
import org.springframework.http.*;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestControllerAdvice(assignableTypes = AuthController.class)
public class AuthExceptionHandler {
    @ExceptionHandler(AuthenticationException.class)
    ResponseEntity<?> credenciaisInvalidas() {
        return ResponseEntity.status(401).body(Map.of("mensagem", "E-mail ou senha incorretos."));
    }

    @ExceptionHandler(ResponseStatusException.class)
    ResponseEntity<?> erroCadastro(ResponseStatusException erro) {
        return ResponseEntity.status(erro.getStatusCode()).body(Map.of("mensagem", erro.getReason()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    ResponseEntity<?> dadosInvalidos() {
        return ResponseEntity.badRequest().body(Map.of("mensagem", "Confira os campos. A senha deve ter entre 8 e 128 caracteres."));
    }
}
