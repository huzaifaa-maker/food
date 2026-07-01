Add-Type -AssemblyName System.Drawing

$root = Split-Path -Parent $PSScriptRoot
$sourceDirectory = Join-Path $root "all assets"
$menuDirectory = Join-Path $root "public\images\menu"
$manualFront = Join-Path $sourceDirectory "WhatsApp Image 2026-06-20 at 10.57.15 PM.jpeg"
$manualDeals = Join-Path $sourceDirectory "WhatsApp Image 2026-06-20 at 10.57.16 PM.jpeg"

function Export-MenuCrop {
  param(
    [Parameter(Mandatory = $true)][string]$Source,
    [Parameter(Mandatory = $true)][string]$Destination,
    [Parameter(Mandatory = $true)][int]$X,
    [Parameter(Mandatory = $true)][int]$Y,
    [Parameter(Mandatory = $true)][int]$Width,
    [Parameter(Mandatory = $true)][int]$Height
  )

  $sourceImage = [System.Drawing.Image]::FromFile($Source)
  $output = New-Object System.Drawing.Bitmap 960, 720
  $graphics = [System.Drawing.Graphics]::FromImage($output)

  try {
    $graphics.Clear([System.Drawing.Color]::FromArgb(250, 239, 201))
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $graphics.DrawImage(
      $sourceImage,
      (New-Object System.Drawing.Rectangle 0, 0, 960, 720),
      (New-Object System.Drawing.Rectangle $X, $Y, $Width, $Height),
      [System.Drawing.GraphicsUnit]::Pixel
    )
    $output.Save($Destination, [System.Drawing.Imaging.ImageFormat]::Jpeg)
  }
  finally {
    $graphics.Dispose()
    $output.Dispose()
    $sourceImage.Dispose()
  }
}

$directAssets = @{
  "WhatsApp Image 2026-06-20 at 10.57.01 PM (2).jpeg" = "creamy-silky-pasta.jpg"
  "WhatsApp Image 2026-06-20 at 10.57.01 PM (1).jpeg" = "creamy-spicy-pasta.jpg"
  "WhatsApp Image 2026-06-20 at 10.57.04 PM.jpeg"     = "tempura-nuggets.jpg"
  "WhatsApp Image 2026-06-20 at 10.57.01 PM.jpeg"     = "masala-wings.jpg"
  "WhatsApp Image 2026-06-20 at 10.57.04 PM (2).jpeg" = "baked-wings-plain.jpg"
}

foreach ($entry in $directAssets.GetEnumerator()) {
  Copy-Item -LiteralPath (Join-Path $sourceDirectory $entry.Key) -Destination (Join-Path $menuDirectory $entry.Value) -Force
}

# Product photos embedded in the supplied printed menu.
Export-MenuCrop -Source $manualFront -Destination (Join-Path $menuDirectory "eco-crunch-patty.jpg") -X 245 -Y 410 -Width 175 -Height 145
Export-MenuCrop -Source $manualFront -Destination (Join-Path $menuDirectory "zaiqa-wrap.jpg") -X 385 -Y 685 -Width 205 -Height 145
Export-MenuCrop -Source $manualFront -Destination (Join-Path $menuDirectory "king-crunch-wrap.jpg") -X 945 -Y 670 -Width 220 -Height 145
Export-MenuCrop -Source $manualDeals -Destination (Join-Path $menuDirectory "drink-350ml.jpg") -X 1065 -Y 170 -Width 105 -Height 180

# Deal composites are cropped from the matching rows on the supplied deals menu.
Export-MenuCrop -Source $manualDeals -Destination (Join-Path $menuDirectory "deal-solo-handi.jpg") -X 825 -Y 175 -Width 345 -Height 185
Export-MenuCrop -Source $manualDeals -Destination (Join-Path $menuDirectory "deal-solo-zinger.jpg") -X 815 -Y 365 -Width 355 -Height 180
Export-MenuCrop -Source $manualDeals -Destination (Join-Path $menuDirectory "deal-happy-family.jpg") -X 790 -Y 545 -Width 390 -Height 245
Export-MenuCrop -Source $manualDeals -Destination (Join-Path $menuDirectory "deal-buddy.jpg") -X 815 -Y 800 -Width 355 -Height 175
Export-MenuCrop -Source $manualDeals -Destination (Join-Path $menuDirectory "deal-midnight-sharing.jpg") -X 805 -Y 965 -Width 375 -Height 185
Export-MenuCrop -Source $manualDeals -Destination (Join-Path $menuDirectory "deal-couple.jpg") -X 790 -Y 1125 -Width 390 -Height 225
