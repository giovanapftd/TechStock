package com.techstock.auth;

import jakarta.validation.constraints.*;

public final class AuthDtos {
    private AuthDtos() {}

    public record Cadastro(
        @NotBlank(message = "Nome é obrigatório") @Size(max = 100, message = "Nome deve ter até 100 caracteres") String nome,
        @NotBlank(message = "E-mail é obrigatório") @Email(message = "E-mail inválido") @Size(max = 254) String email,
        @NotBlank(message = "Senha é obrigatória") @Size(min = 8, max = 128, message = "Senha deve ter entre 8 e 128 caracteres") String senha
    ) {}

    public record Login(
        @NotBlank @Email @Size(max = 254) String email,
        @NotBlank @Size(max = 128) String senha
    ) {}

    // A API nunca devolve a senha nem seu hash.
    public record Conta(Long id, String nome, String email, Usuario.Perfil perfil) {
        static Conta de(Usuario usuario) {
            return new Conta(usuario.getId(), usuario.getNome(), usuario.getEmail(), usuario.getPerfil());
        }
    }
}
