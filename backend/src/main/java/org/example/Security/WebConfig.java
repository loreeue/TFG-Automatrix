package org.example.Security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import io.micrometer.common.lang.NonNull;

@Configuration
public class WebConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(@NonNull CorsRegistry registry) {
                registry.addMapping("/**")        // Todas las rutas
                        .allowedOrigins("http://localhost:3000") // orígenes permitidos
                        .allowedMethods("*")       // Métodos permitidos (GET,POST,etc.)
                        .allowedHeaders("*");      // Cabeceras permitidas
            }
        };
    }
}
