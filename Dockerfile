# Usa l'immagine con Gradle 8.13 e JDK 23 (Amazon Corretto)
FROM gradle:8.13-jdk23-corretto-al2023 AS build

# Imposta la directory di lavoro nel container
WORKDIR /app

# Espone le porte di Spring Boot
EXPOSE 8080
EXPOSE 5005

# Imposta il comando di default per avviare l'applicazione Spring Boot
CMD ["./gradlew", "bootRun"]
