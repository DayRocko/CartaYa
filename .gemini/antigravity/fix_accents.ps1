
$Path = "Avance2135.html"
$Content = [System.IO.File]::ReadAllText($Path, [System.Text.Encoding]::UTF8)

$Replacements = @{
    "Ã¢Å¡Â " = "⚠️";
    "Ã¢Å“â€œ" = "✅";
    "Ã¢Å“â€¦" = "✅";
    "Ã°Å¸Å¸" = "🐟";
    "Ã°Å¸ÂÅ¸" = "🐟";
    "Ã¢Â â€œ" = "🕒";
    "ÃƒÂ¡" = "á";
    "ÃƒÂ©" = "é";
    "ÃƒÂ­" = "í";
    "ÃƒÂ³" = "ó";
    "ÃƒÂº" = "ú";
    "ÃƒÂ±" = "ñ";
    "ÃƒÂ" = "á";
    "Ã¡" = "á";
    "Ã©" = "é";
    "Ã­" = "í";
    "Ã³" = "ó";
    "Ãº" = "ú";
    "Ã±" = "ñ";
    "Ã¿" = "¿";
    "Ã¡" = "¡";
    "Ã" = "í"; # This one is risky, usually part of a pair
}

# Apply replacements in a specific order (longest first to avoid partial matches)
$SortedKeys = $Replacements.Keys | Sort-Object -Property Length -Descending

foreach ($Key in $SortedKeys) {
    $Value = $Replacements[$Key]
    $Content = $Content.Replace($Key, $Value)
}

# Specific cleanup for remaining artifacts
$Content = $Content.Replace("Ã‚Â", "")

[System.IO.File]::WriteAllText($Path, $Content, [System.Text.Encoding]::UTF8)
Write-Host "Mojibake and accents fixed in $Path"
