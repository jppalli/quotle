param(
    [string]$OutputZip = 'quotle-itch-build.zip'
)

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem

function Get-RelativePathCompat {
    param(
        [Parameter(Mandatory = $true)][string]$BasePath,
        [Parameter(Mandatory = $true)][string]$TargetPath
    )

    $baseUri = New-Object System.Uri((Resolve-Path $BasePath).Path.TrimEnd([char[]]@([char]92,[char]47)) + '/')
    $targetUri = New-Object System.Uri((Resolve-Path $TargetPath).Path)
    return [System.Uri]::UnescapeDataString($baseUri.MakeRelativeUri($targetUri).ToString())
}

$projectRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$outputPath = Join-Path $projectRoot $OutputZip

$includePaths = @(
    'index.html',
    'game-modern.js',
    'quotes_calendar.js',
    'scramble-utils.js',
    'quote-manager.js',
    'arkadium-integration-stub.js',
    'achievements-manager.js',
    'assets',
    'sounds'
)

if (Test-Path $outputPath) {
    Remove-Item $outputPath -Force
}

$zipStream = [System.IO.File]::Open($outputPath, [System.IO.FileMode]::Create)
$zip = New-Object System.IO.Compression.ZipArchive($zipStream, [System.IO.Compression.ZipArchiveMode]::Create, $false)

try {
    foreach ($relativePath in $includePaths) {
        $sourcePath = Join-Path $projectRoot $relativePath
        if (-not (Test-Path $sourcePath)) {
            throw "Missing path: $relativePath"
        }

        if (Test-Path $sourcePath -PathType Leaf) {
            $entryName = ($relativePath -replace '\\','/')
            [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile(
                $zip,
                $sourcePath,
                $entryName,
                [System.IO.Compression.CompressionLevel]::Optimal
            ) | Out-Null
            continue
        }

        Get-ChildItem -Path $sourcePath -Recurse -File | ForEach-Object {
            $relativeFilePath = Get-RelativePathCompat -BasePath $projectRoot -TargetPath $_.FullName
            $entryName = ($relativeFilePath -replace '\\','/')
            [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile(
                $zip,
                $_.FullName,
                $entryName,
                [System.IO.Compression.CompressionLevel]::Optimal
            ) | Out-Null
        }
    }
}
finally {
    $zip.Dispose()
    $zipStream.Dispose()
}

$verify = [System.IO.Compression.ZipFile]::OpenRead($outputPath)
try {
    $badEntries = $verify.Entries | Where-Object { $_.FullName -match '\\' }
    if ($badEntries) {
        throw 'ZIP contains Windows path separators. Build failed.'
    }

    Write-Host "Created $OutputZip with $($verify.Entries.Count) entries"
}
finally {
    $verify.Dispose()
}


