@echo off
cd /d "c:\Users\dayro\OneDrive - MSFT\JOB\Emprendimiento\Project # 3 Startup AI\RestPro AI\cartaya"
echo Iniciando servidor en http://localhost:8000
echo Presiona Ctrl+C para detener
echo.
python -m http.server 8000 2>nul || npx serve -s . -l 8000 2>nul || echo "No se pudo iniciar el servidor"
pause
