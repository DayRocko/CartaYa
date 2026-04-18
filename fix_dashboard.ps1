$filePath = "c:\Users\dayro\Desktop\Project # 3 Startup AI\RestPro AI\cartaya\dashboard_2.html"
$content = Get-Content -LiteralPath $filePath
$newContent = @()
$skip = $false
foreach ($line in $content) {
    if ($line -match 'const recData = Array.isArray') { $skip = $true }
    if ($skip) {
        if ($line -match '^\s*};') { $skip = $false; continue }
        continue
    }
    $newContent += $line
}
$newContent | Set-Content -LiteralPath $filePath -Encoding UTF8
