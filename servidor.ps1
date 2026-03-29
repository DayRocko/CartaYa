# Servidor simple para el dashboard
$port = 8000
$directory = "c:\Users\dayro\OneDrive - MSFT\JOB\Emprendimiento\Project # 3 Startup AI\RestPro AI\cartaya"

Write-Host "Iniciando servidor en http://localhost:$port"
Write-Host "Directorio: $directory"
Write-Host "Presiona Ctrl+C para detener"
Write-Host ""

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()

try {
    while ($true) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        
        $localPath = Join-Path $directory ($request.Url.LocalPath.TrimStart('/'))
        if ($localPath -eq $directory) {
            $localPath = Join-Path $directory "dashboard.html"
        }
        
        if (Test-Path $localPath) {
            $content = [IO.File]::ReadAllBytes($localPath)
            $extension = [IO.Path]::GetExtension($localPath)
            
            switch ($extension) {
                ".html" { $response.ContentType = "text/html" }
                ".css" { $response.ContentType = "text/css" }
                ".js" { $response.ContentType = "application/javascript" }
                default { $response.ContentType = "text/plain" }
            }
            
            $response.ContentLength64 = $content.Length
            $response.OutputStream.Write($content, 0, $content.Length)
        } else {
            $response.StatusCode = 404
            $response.StatusDescription = "Not Found"
        }
        
        $response.Close()
    }
}
catch {
    Write-Host "Servidor detenido"
}
finally {
    $listener.Stop()
}
