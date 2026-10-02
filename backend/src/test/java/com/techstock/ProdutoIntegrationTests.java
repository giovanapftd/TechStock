package com.techstock;

import com.techstock.repository.ProdutoRepository;
import com.jayway.jsonpath.JsonPath;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.*;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(properties = {"spring.datasource.url=jdbc:h2:mem:crud;DB_CLOSE_DELAY=-1",
    "spring.datasource.username=sa", "spring.datasource.password=",
    "spring.jpa.hibernate.ddl-auto=create-drop", "spring.jpa.show-sql=false"})
class ProdutoIntegrationTests {
    @Autowired WebApplicationContext context;
    @Autowired ProdutoRepository repository;
    MockMvc mvc;
    static final String PRODUTO = "{\"nome\":\"Produto de teste\",\"descricao\":\"Descrição do teste\",\"preco\":49.90,\"quantidade\":3,\"categoria\":\"Acessórios\",\"imagem\":\"https://example.com/produto.jpg\"}";

    @BeforeEach void preparar() {
        mvc = MockMvcBuilders.webAppContextSetup(context).apply(springSecurity()).build();
        repository.deleteAll();
    }

    private long cadastrar() throws Exception {
        MvcResult resultado = mvc.perform(post("/api/produtos").with(user("admin").roles("ADMINISTRADOR")).with(csrf())
            .contentType(MediaType.APPLICATION_JSON).content(PRODUTO))
            .andExpect(status().isCreated()).andExpect(jsonPath("categoria").value("Acessórios")).andReturn();
        Number id = JsonPath.read(resultado.getResponse().getContentAsString(), "$.id");
        return id.longValue();
    }

    @Test void administradorPersisteAtualizaEExcluiProduto() throws Exception {
        long id = cadastrar();
        assertEquals("https://example.com/produto.jpg", repository.findById(id).orElseThrow().getImagem());
        mvc.perform(get("/api/produtos/" + id)).andExpect(status().isOk()).andExpect(jsonPath("nome").value("Produto de teste"));
        mvc.perform(put("/api/produtos/" + id).with(user("admin").roles("ADMINISTRADOR")).with(csrf())
            .contentType(MediaType.APPLICATION_JSON).content(PRODUTO.replace("49.90", "79.90").replace("Produto de teste", "Produto atualizado")))
            .andExpect(status().isOk()).andExpect(jsonPath("preco").value(79.90));
        assertEquals("Produto atualizado", repository.findById(id).orElseThrow().getNome());
        mvc.perform(delete("/api/produtos/" + id).with(user("admin").roles("ADMINISTRADOR")).with(csrf()))
            .andExpect(status().isNoContent());
        assertFalse(repository.existsById(id));
        mvc.perform(get("/api/produtos/" + id)).andExpect(status().isNotFound());
    }

    @Test void leituraPublicaEAlteracaoExigeAdministrador() throws Exception {
        long id = cadastrar();
        mvc.perform(get("/api/produtos")).andExpect(status().isOk());
        mvc.perform(post("/api/produtos").with(csrf()).contentType(MediaType.APPLICATION_JSON).content(PRODUTO))
            .andExpect(status().isUnauthorized());
        mvc.perform(post("/api/produtos").with(user("comum").roles("USUARIO")).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(PRODUTO))
            .andExpect(status().isForbidden());
        mvc.perform(put("/api/produtos/" + id).with(user("comum").roles("USUARIO")).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(PRODUTO))
            .andExpect(status().isForbidden());
        mvc.perform(delete("/api/produtos/" + id).with(user("comum").roles("USUARIO")).with(csrf()))
            .andExpect(status().isForbidden());
        assertEquals(1, repository.count());
    }

    @Test void validaCadastroEEdicaoSemAlterarBancoEmErro() throws Exception {
        long id = cadastrar();
        for (String invalido : new String[] {"{}", PRODUTO.replace("49.90", "-1"), PRODUTO.replace("49.90", "1.001"), PRODUTO.replace("https://example.com/produto.jpg", "javascript:alert(1)")}) {
            mvc.perform(post("/api/produtos").with(user("admin").roles("ADMINISTRADOR")).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(invalido))
                .andExpect(status().isBadRequest());
            mvc.perform(put("/api/produtos/" + id).with(user("admin").roles("ADMINISTRADOR")).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(invalido))
                .andExpect(status().isBadRequest());
        }
        assertEquals(1, repository.count());
        assertEquals("Produto de teste", repository.findById(id).orElseThrow().getNome());
    }

    @Test void escritaExigeCsrfEIdInexistenteRetorna404() throws Exception {
        mvc.perform(post("/api/produtos").with(user("admin").roles("ADMINISTRADOR")).contentType(MediaType.APPLICATION_JSON).content(PRODUTO))
            .andExpect(status().isForbidden());
        mvc.perform(put("/api/produtos/999999").with(user("admin").roles("ADMINISTRADOR")).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(PRODUTO))
            .andExpect(status().isNotFound());
        mvc.perform(delete("/api/produtos/999999").with(user("admin").roles("ADMINISTRADOR")).with(csrf()))
            .andExpect(status().isNotFound());
    }

    @Test void corsPermiteEdicaoEExclusaoNaPorta5174() throws Exception {
        for (String metodo : new String[] {"PUT", "DELETE"}) {
            mvc.perform(options("/api/produtos/1").header("Origin", "http://localhost:5174")
                .header("Access-Control-Request-Method", metodo).header("Access-Control-Request-Headers", "X-CSRF-TOKEN"))
                .andExpect(status().isOk()).andExpect(header().string("Access-Control-Allow-Credentials", "true"));
        }
    }
}
