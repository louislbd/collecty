# Phase de build
FROM rust:latest AS builder

WORKDIR /usr/src/app

COPY Cargo.toml Cargo.lock ./

# Copier le répertoire src avant de construire
COPY . .

# Définir la variable d'environnement DATABASE_URL
ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}

# Installer sqlx-cli
RUN cargo install sqlx-cli

# Préparer le cache des requêtes SQL
RUN DATABASE_URL=${DATABASE_URL} cargo sqlx prepare -- --lib

RUN cargo build --release

# Phase de run
FROM rust:latest

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/target/release/collecty_back /usr/local/bin/collecty_back
COPY --from=builder $HOME/.cargo/bin/sqlx-cli sqlx-cli

# Définir la variable d'environnement DATABASE_URL
ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}

EXPOSE 8080

CMD ["collecty_back"]