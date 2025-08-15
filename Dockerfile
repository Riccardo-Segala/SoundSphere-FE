# Usa un'immagine base con Node.js (ultima LTS)
FROM node:lts-bullseye

# Installa dipendenze di sistema
RUN apt update && apt install -y curl unzip zip bash software-properties-common

# Installa OpenJDK 17 dai repository ufficiali di Debian
RUN apt install -y openjdk-17-jdk

# Configura JAVA_HOME
ENV JAVA_HOME="/usr/lib/jvm/java-17-openjdk-amd64"
ENV PATH="$JAVA_HOME/bin:$PATH"

# Installa NVM
ENV NVM_VERSION="0.40.0"
RUN curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v$NVM_VERSION/install.sh | bash \
    && export NVM_DIR="/root/.nvm" \
    && [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

# Imposta variabili d'ambiente per NVM
ENV NVM_DIR="/root/.nvm"
RUN echo 'export NVM_DIR="/root/.nvm"' >> /root/.bashrc && \
    echo '[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"' >> /root/.bashrc

# Installa Node.js (ultima versione disponibile)
RUN bash -c "source /root/.nvm/nvm.sh && nvm install node && nvm use node"

# Installa Angular CLI globalmente
RUN npm install -g @angular/cli

RUN npm install -g @openapitools/openapi-generator-cli

# Imposta il working directory
WORKDIR /app

# Espone la porta usata da Angular
EXPOSE 4200

CMD ["/bin/bash"]