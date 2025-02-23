package org.example.Security;

import static org.springframework.security.config.Customizer.withDefaults;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class SecurityConfig {

    // 1) Definimos el PasswordEncoder a usar (BCrypt):
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // 2) Definimos el SecurityFilterChain con la configuración
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
			.cors(withDefaults())
            // Autorizamos rutas, por ejemplo la de H2:
            .authorizeHttpRequests(auth -> auth
				.requestMatchers(
					"/h2-console/**",
					"/api/users/register",
					"/api/users/login"
				).permitAll()
				.anyRequest().authenticated()
			)

            // Para poder usar la consola H2 (frames)
            .headers(headers -> headers.frameOptions(frame -> frame.disable()))
            // CSRF a menudo se desactiva para la consola H2
            .csrf(csrf -> csrf.disable())
            // Y lo demás, login por defecto, etc.
            .formLogin(Customizer.withDefaults());

        // Finalmente construimos el objeto
        return http.build();
    }
}
