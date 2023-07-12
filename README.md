# NestJS Microservice Project

## Github

- https://github.com/fresh502/fastcampus-nestjs-microservice

## 프로젝트 아키텍쳐

- 모놀리식 => 마이크로서비스 전환
- docker-compose를 활용하여 로컬 개발 환경에서 마이크로서비스 세팅
- TCP를 활용한 동기 통신
- Kafka를 활용한 비동기 통신
  ![Alt text](./diagram/img/architecture.svg?raw=true)

## 실습 내용

- NestJS 마이크로서비스 적용
- docker compose를 활용하여 로컬 개발 환경에서 마이크로서비스 구동
- docker compose를 활용하여 Postgres, Kafka 구동
- 마이크로서비스간의 http 동기 통신
- 마이크로서비스간의 Kafka 비동기 통신
  ![Alt text](./diagram/img/sequence.svg?raw=true)

## 기술 스택

- Typescript 4.7.4
- Node.js 18.14.0
- NestJS 9.0.0
- Postgres 14.6
- Kafka 2.8.1
- Docker, Docker Compose
- Git
