FROM rust:latest

WORKDIR /usr/src/app

COPY Cargo.toml Cargo.lock ./

RUN cargo build --release

COPY . .

EXPOSE 8080

RUN cargo install --path .

CMD ["cargo run"]