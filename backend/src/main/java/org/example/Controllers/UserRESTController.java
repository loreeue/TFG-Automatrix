package org.example.Controllers;

import org.example.Entities.User;
import org.example.Services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.example.Entities.LoginRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserRESTController {

    @Autowired
    private UserService userService;

    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @PostMapping("/register")
    public User createUser(@RequestBody User user) {
        return userService.saveUser(user);
    }

	@PostMapping("/login")
	public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest) {
		User user = userService.authenticate(loginRequest.getEmail(), loginRequest.getPassword());
		if (user != null) {
			return ResponseEntity.ok(
				Map.of("userId", user.getId(), "username", user.getUsername())
			);
		}
		else {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuario o contraseña incorrectos");
		}
	}

	@GetMapping("/me")
	public ResponseEntity<?> getCurrentUser(@RequestParam Long userId) {
		User user = userService.getUserById(userId);
		if (user != null) {
			return ResponseEntity.ok(user);
		}
		else {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario no encontrado");
		}
	}
}
