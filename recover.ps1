$logPath = "C:\Users\asus s\.gemini\antigravity-ide\brain\232eca99-2627-4d70-839d-1a6d1ddf81fb\.system_generated\logs\transcript.jsonl"
Get-Content -LiteralPath $logPath | ForEach-Object {
    if ($_ -like "*loginTranslations*") {
        $_ | Out-File -FilePath "e:\EquusChain\recovered_log.txt" -Append -Encoding utf8
    }
}
Write-Host "Search completed."
