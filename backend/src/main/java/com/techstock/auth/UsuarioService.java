package com.techstock.auth;

import java.util.Locale;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class UsuarioService implements UserDetailsService {
    private final UsuarioRepository repository;
    private final PasswordEncoder encoder;

    public UsuarioService(UsuarioRepository repository, PasswordEncoder encoder) {
        this.repository = repository;
        this.encoder = encoder;
    }

    public static String normalizarEmail(String email) {
        return email.strip().toLowerCase(Locale.ROOT);
    }

    public AuthDtos.Conta cadastrar(AuthDtos.Cadastro dados) {
        String email = normalizarEmail(dados.email());
        if (email.equals(AdministradorInicial.EMAIL)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Este e-mail é reservado à conta de administrador.");
        }
        if (repository.existsByEmail(email)) throw duplicado();
        try {
            Usuario usuario = repository.saveAndFlush(new Usuario(dados.nome().strip(), email, encoder.encode(dados.senha())));
            return AuthDtos.Conta.de(usuario);
        } catch (DataIntegrityViolationException erro) {
            // A restrição do banco também cobre cadastros simultâneos.
            throw duplicado();
        }
    }

    private ResponseStatusException duplicado() {
        return new ResponseStatusException(HttpStatus.CONFLICT, "Este e-mail já está cadastrado.");
    }

    public AuthDtos.Conta conta(String email) {
        return AuthDtos.Conta.de(repository.findByEmail(email)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Sessão inválida.")));
    }

    @Override
    public UserDetails loadUserByUsername(String email) {
        Usuario usuario = repository.findByEmail(normalizarEmail(email))
            .orElseThrow(() -> new UsernameNotFoundException("E-mail ou senha incorretos."));
        return User.withUsername(usuario.getEmail()).password(usuario.getSenhaHash()).roles(usuario.getPerfil().name()).build();
    }
}
