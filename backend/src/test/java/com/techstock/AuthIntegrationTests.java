package com.techstock;

import com.techstock.auth.UsuarioRepository;
import com.techstock.auth.AdministradorInicial;
import com.techstock.auth.Usuario;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.test.web.servlet.*;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.http.MediaType;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(properties = {
    "spring.datasource.url=jdbc:h2:mem:auth;DB_CLOSE_DELAY=-1",
    "spring.datasource.username=sa", "spring.datasource.password=",
    "spring.jpa.hibernate.ddl-auto=create-drop", "spring.jpa.show-sql=false"
})
class AuthIntegrationTests {
    @Autowired WebApplicationContext context;
    @Autowired UsuarioRepository usuarios;
    @Autowired PasswordEncoder encoder;
    MockMvc mvc;

    @BeforeEach void preparar() {
        mvc = MockMvcBuilders.webAppContextSetup(context).apply(springSecurity()).build();
        usuarios.deleteAll();
    }

    private void cadastrar() throws Exception {
        mvc.perform(post("/api/auth/cadastro").with(csrf()).contentType(MediaType.APPLICATION_JSON)
            .content("{\"nome\":\"Giovana\",\"email\":\"GIOVANA@example.com\",\"senha\":\"SenhaTeste123\"}"))
            .andExpect(status().isCreated()).andExpect(jsonPath("email").value("giovana@example.com"))
            .andExpect(jsonPath("senha").doesNotExist()).andExpect(jsonPath("senhaHash").doesNotExist());
    }

    @Test void cadastroProtegeSenhaEImpedeDuplicado() throws Exception {
        cadastrar();
        assertNotEquals("SenhaTeste123", usuarios.findByEmail("giovana@example.com").orElseThrow().getSenhaHash());
        mvc.perform(post("/api/auth/cadastro").with(csrf()).contentType(MediaType.APPLICATION_JSON)
            .content("{\"nome\":\"Outra\",\"email\":\"giovana@example.com\",\"senha\":\"SenhaTeste123\"}"))
            .andExpect(status().isConflict());
        assertEquals(1, usuarios.count());
    }

    @Test void validaCamposECsrf() throws Exception {
        mvc.perform(post("/api/auth/cadastro").contentType(MediaType.APPLICATION_JSON).content("{}"))
            .andExpect(status().isForbidden());
        mvc.perform(post("/api/auth/cadastro").with(csrf()).contentType(MediaType.APPLICATION_JSON)
            .content("{\"nome\":\" \",\"email\":\"invalido\",\"senha\":\"123\"}"))
            .andExpect(status().isBadRequest());
        assertEquals(0, usuarios.count());
    }

    @Test void loginSessaoELogoutComCsrfReal() throws Exception {
        cadastrar();
        mvc.perform(get("/api/auth/me")).andExpect(status().isUnauthorized());
        MvcResult tokenInicial = mvc.perform(get("/api/auth/csrf")).andExpect(status().isOk()).andReturn();
        MockHttpSession session = (MockHttpSession) tokenInicial.getRequest().getSession(false);
        String idAnterior = session.getId();
        var csrfInicial = (org.springframework.security.web.csrf.CsrfToken) tokenInicial.getRequest().getAttribute(org.springframework.security.web.csrf.CsrfToken.class.getName());
        mvc.perform(post("/api/auth/login").session(session).header(csrfInicial.getHeaderName(), csrfInicial.getToken())
            .contentType(MediaType.APPLICATION_JSON).content("{\"email\":\"giovana@example.com\",\"senha\":\"SenhaTeste123\"}"))
            .andExpect(status().isOk()).andExpect(jsonPath("nome").value("Giovana"));
        assertNotEquals(idAnterior, session.getId());
        mvc.perform(get("/api/auth/me").session(session)).andExpect(status().isOk())
            .andExpect(jsonPath("senhaHash").doesNotExist());
        MvcResult tokenNovo = mvc.perform(get("/api/auth/csrf").session(session)).andReturn();
        var csrfNovo = (org.springframework.security.web.csrf.CsrfToken) tokenNovo.getRequest().getAttribute(org.springframework.security.web.csrf.CsrfToken.class.getName());
        mvc.perform(post("/api/auth/sair").session(session).header(csrfNovo.getHeaderName(), csrfNovo.getToken()))
            .andExpect(status().isNoContent());
        assertTrue(session.isInvalid());
        mvc.perform(get("/api/auth/me")).andExpect(status().isUnauthorized());
    }

    @Test void erroDeLoginNaoRevelaSeEmailExiste() throws Exception {
        cadastrar();
        for (String email : new String[] {"giovana@example.com", "inexistente@example.com"}) {
            mvc.perform(post("/api/auth/login").with(csrf()).contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\":\"" + email + "\",\"senha\":\"incorreta\"}"))
                .andExpect(status().isUnauthorized()).andExpect(jsonPath("mensagem").value("E-mail ou senha incorretos."));
        }
    }

    @Test void corsPermiteFrontendEBloqueiaOutrasOrigens() throws Exception {
        mvc.perform(options("/api/auth/login").header("Origin", "http://localhost:5173")
            .header("Access-Control-Request-Method", "POST").header("Access-Control-Request-Headers", "X-CSRF-TOKEN"))
            .andExpect(status().isOk()).andExpect(header().string("Access-Control-Allow-Credentials", "true"));
        mvc.perform(options("/api/auth/login").header("Origin", "https://outro.example")
            .header("Access-Control-Request-Method", "POST"))
            .andExpect(status().isForbidden());
    }

    @Test void emailAdministradorNaoPodeSerCadastradoPublicamente() throws Exception {
        mvc.perform(post("/api/auth/cadastro").with(csrf()).contentType(MediaType.APPLICATION_JSON)
            .content("{\"nome\":\"Outra pessoa\",\"email\":\"GIOVANAPFTD@gmail.com\",\"senha\":\"SenhaTeste123\",\"perfil\":\"ADMINISTRADOR\"}"))
            .andExpect(status().isConflict());
        assertEquals(0, usuarios.count());
    }

    @Test void administradorCriadoPeloBackendTemAcessoReservado() throws Exception {
        AdministradorInicial inicializador = new AdministradorInicial(usuarios, encoder, "SenhaAdminTeste123");
        inicializador.run(null);
        Usuario administrador = usuarios.findByEmail(AdministradorInicial.EMAIL).orElseThrow();
        String hash = administrador.getSenhaHash();
        assertEquals(Usuario.Perfil.ADMINISTRADOR, administrador.getPerfil());
        assertTrue(encoder.matches("SenhaAdminTeste123", hash));
        inicializador.run(null);
        assertEquals(1, usuarios.count());
        assertEquals(hash, usuarios.findByEmail(AdministradorInicial.EMAIL).orElseThrow().getSenhaHash());
        MvcResult login = mvc.perform(post("/api/auth/login").with(csrf()).contentType(MediaType.APPLICATION_JSON)
            .content("{\"email\":\"giovanapftd@gmail.com\",\"senha\":\"SenhaAdminTeste123\"}"))
            .andExpect(status().isOk()).andExpect(jsonPath("perfil").value("ADMINISTRADOR")).andReturn();
        mvc.perform(get("/api/auth/admin").session((MockHttpSession) login.getRequest().getSession(false)))
            .andExpect(status().isOk());
    }

    @Test void usuarioComumNaoPodeAcessarRotaAdministrativa() throws Exception {
        cadastrar();
        MvcResult login = mvc.perform(post("/api/auth/login").with(csrf()).contentType(MediaType.APPLICATION_JSON)
            .content("{\"email\":\"giovana@example.com\",\"senha\":\"SenhaTeste123\"}"))
            .andExpect(status().isOk()).andExpect(jsonPath("perfil").value("USUARIO")).andReturn();
        mvc.perform(get("/api/auth/admin").session((MockHttpSession) login.getRequest().getSession(false)))
            .andExpect(status().isForbidden());
        mvc.perform(get("/api/auth/admin")).andExpect(status().isUnauthorized());
    }

    @Test void inicializadorNaoPromoveContaComumExistente() {
        usuarios.saveAndFlush(new Usuario("Outro", AdministradorInicial.EMAIL, encoder.encode("OutraSenha123")));
        AdministradorInicial inicializador = new AdministradorInicial(usuarios, encoder, "SenhaAdminTeste123");
        assertThrows(IllegalStateException.class, () -> inicializador.run(null));
        assertEquals(Usuario.Perfil.USUARIO, usuarios.findByEmail(AdministradorInicial.EMAIL).orElseThrow().getPerfil());
    }
}
