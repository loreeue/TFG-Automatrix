package org.example.Security;

import static org.springframework.security.config.Customizer.withDefaults;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
	public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
		http
			.cors(withDefaults())
			.authorizeHttpRequests(auth -> auth
				// I allow all POST, GET and DELETE requests
				.requestMatchers(HttpMethod.POST, "/**").permitAll()
				.requestMatchers(HttpMethod.GET, "/**").permitAll()
				.requestMatchers(HttpMethod.DELETE, "/**").permitAll()
				.anyRequest().authenticated()
			)
			.headers(headers -> headers.frameOptions(frame -> frame.disable()))
			.csrf(csrf -> csrf.disable())
			.httpBasic(httpBasic -> httpBasic.disable())
			.formLogin(formLogin -> formLogin.disable());
		return http.build();
	}
}
