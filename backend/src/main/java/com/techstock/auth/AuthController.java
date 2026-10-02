package com.techstock.auth;

import jakarta.servlet.http.*;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.session.SessionAuthenticationStrategy;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final UsuarioService usuarios;
    private final AuthenticationManager manager;
    private final SecurityContextRepository contextRepository;
    private final SessionAuthenticationStrategy sessionStrategy;

    public AuthController(UsuarioService usuarios, AuthenticationManager manager,
            SecurityContextRepository contextRepository, SessionAuthenticationStrategy sessionStrategy) {
        this.usuarios = usuarios;
        this.manager = manager;
        this.contextRepository = contextRepository;
        this.sessionStrategy = sessionStrategy;
    }

    @GetMapping("/csrf")
    public CsrfToken csrf(CsrfToken token) { return token; }

    @PostMapping("/cadastro") @ResponseStatus(HttpStatus.CREATED)
    public AuthDtos.Conta cadastrar(@Valid @RequestBody AuthDtos.Cadastro dados) {
        return usuarios.cadastrar(dados);
    }

    @PostMapping("/login")
    public AuthDtos.Conta login(@Valid @RequestBody AuthDtos.Login dados,
            HttpServletRequest request, HttpServletResponse response) {
        Authentication authentication = manager.authenticate(UsernamePasswordAuthenticationToken.unauthenticated(
            UsuarioService.normalizarEmail(dados.email()), dados.senha()));
        sessionStrategy.onAuthentication(authentication, request, response);
        var context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(authentication);
        SecurityContextHolder.setContext(context);
        contextRepository.saveContext(context, request, response);
        return usuarios.conta(authentication.getName());
    }

    @GetMapping("/me")
    public AuthDtos.Conta conta(Authentication authentication) {
        return usuarios.conta(authentication.getName());
    }

    // Apenas o perfil ADMINISTRADOR pode acessar esta rota; a regra fica em SecurityConfig.
    @GetMapping("/admin")
    public AuthDtos.Conta administrador(Authentication authentication) {
        return usuarios.conta(authentication.getName());
    }
}
