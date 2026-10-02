package com.techstock.auth;

import jakarta.persistence.*;

@Entity
@Table(name = "usuarios", uniqueConstraints = @UniqueConstraint(name = "uk_usuario_email", columnNames = "email"))
public class Usuario {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, length = 100)
    private String nome;
    @Column(nullable = false, length = 254)
    private String email;
    @Column(nullable = false)
    private String senhaHash;
    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private Perfil perfil = Perfil.USUARIO;

    public enum Perfil { USUARIO, ADMINISTRADOR }

    protected Usuario() {}
    public Usuario(String nome, String email, String senhaHash) {
        this.nome = nome;
        this.email = email;
        this.senhaHash = senhaHash;
    }
    public Long getId() { return id; }
    public String getNome() { return nome; }
    public String getEmail() { return email; }
    public String getSenhaHash() { return senhaHash; }
    public Perfil getPerfil() { return perfil == null ? Perfil.USUARIO : perfil; }
    public void definirAdministrador() { this.perfil = Perfil.ADMINISTRADOR; }
}
