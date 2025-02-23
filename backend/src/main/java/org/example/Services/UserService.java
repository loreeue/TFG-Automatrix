package org.example.Services;

import org.example.Entities.User;
import org.example.Repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

	@Autowired
    private PasswordEncoder passwordEncoder;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User saveUser(User user) {
		String encryptedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(encryptedPassword);
        return userRepository.save(user);
    }

	public User authenticate(String email, String rawPassword) {
        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            // En la BD tenemos la contraseña hasheada: user.getPassword()
            // passwordEncoder.matches comprueba si la 'rawPassword' encaja con el hash de la BD
            if (passwordEncoder.matches(rawPassword, user.getPassword())) {
                return user; // Contraseña correcta
            }
        }
        return null; // No coincide o no existe
    }
}
