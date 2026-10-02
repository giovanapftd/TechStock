package com.techstock.auth;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class AdministradorInicial implements ApplicationRunner {
    /* Email ADM */
    public static final String EMAIL = "giovanapftd@gmail.com";

    private final UsuarioRepository usuarios;
    private final PasswordEncoder encoder;
    private final String senhaInicial;

    public AdministradorInicial(UsuarioRepository usuarios, PasswordEncoder encoder,
            @Value("${TECHSTOCK_ADMIN_PASSWORD:}") String senhaInicial) {
        this.usuarios = usuarios;
        this.encoder = encoder;
        this.senhaInicial = senhaInicial;
    }

    @Override
    public void run(ApplicationArguments args) {
        if (senhaInicial.isEmpty()) return;
        if (senhaInicial.isBlank() || senhaInicial.length() < 8 || senhaInicial.length() > 128) {
            throw new IllegalStateException("TECHSTOCK_ADMIN_PASSWORD deve ter entre 8 e 128 caracteres.");
        }
        var existente = usuarios.findByEmail(EMAIL);
        if (existente.isPresent()) {
            if (existente.get().getPerfil() != Usuario.Perfil.ADMINISTRADOR) {
                throw new IllegalStateException("O e-mail reservado já pertence a uma conta comum. Revise essa conta antes de provisionar o administrador.");
            }
            return; // Reiniciar o servidor não altera a senha da conta existente.
        }
        Usuario administrador = new Usuario("Giovana", EMAIL, encoder.encode(senhaInicial));
        administrador.definirAdministrador();
        usuarios.saveAndFlush(administrador);
    }
}
