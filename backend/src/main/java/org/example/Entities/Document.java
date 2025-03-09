package org.example.Entities;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "documents")
@Getter
@Setter
public class Document {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String url;

	@Lob
    private byte[] content; // Para almacenar el archivo en la BD

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
	@JsonIgnore
    private User user;
}
