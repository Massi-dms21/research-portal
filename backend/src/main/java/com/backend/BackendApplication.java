// src/main/java/com/example/researchbackendsimplified/BackendApplication.java
package com.backend; // Or your chosen base package

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BackendApplication { // Renamed as requested

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

}