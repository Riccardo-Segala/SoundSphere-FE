@echo off

:: Avvia il servizio Docker
docker-compose up -d

:: Attendi che il servizio MySQL sia pronto
echo Aspettando che MySQL sia pronto...
timeout /t 15