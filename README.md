# Passo a Passo

Projeto EasyDonate

## O que fazer?

1. Clonar repositório (Terminal do Vs Code)

   ```bash
   git clone https://github.com/guilherme-rodrigues-de-queiroz/easydonate.git
   ```

2. Installar dependencias (Terminal do Vs Code)

   ```bash
   npm i
   ```

3. Abrir API do Easy Donate
   ```bash
   Usar http ao invés de https para rodar a API
   ```

5. Configurar projeto para rodar com o Back-End

   ```bash
   Acesse o aplicativo com o Vs Code vá em API/axios.ts
   Trocar o ip igual vou passar a baixo:
   
   Usar ipconfig no cmd do windows para ver seu ipv4 e copiar até antes da porta.
   Ex: 192.168.0.1 e deixar com a porta 5062

   Trocar o ip do baseURL pelo seu SEU_IP:5062
   ```

6. Iniciando o projeto (Aconselho usar o terminal do windows abrindo a pasta do projeto)
   ```bash
   npx expo start
   ```

7. Iniciando o projeto limpando o cache
   ```bash
   npx expo start -c
   ```

8. Trocando de branch (VS Code)
   ```bash
   git checkout "nome da branch"
   ```

9. Atualizando a Main antes de dar Commit na sua branch
   ```bash
   git pull
   ```
