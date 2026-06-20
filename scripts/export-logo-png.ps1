Add-Type -AssemblyName System.Drawing

function New-Canvas($width, $height) {
  $bitmap = New-Object System.Drawing.Bitmap $width, $height, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
  $graphics.Clear([System.Drawing.Color]::Transparent)
  return @{ Bitmap = $bitmap; Graphics = $graphics }
}

function New-RoundRect($x, $y, $width, $height, $radius) {
  $path = New-Object System.Drawing.Drawing2D.GraphicsPath
  $diameter = $radius * 2
  $path.AddArc($x, $y, $diameter, $diameter, 180, 90)
  $path.AddArc($x + $width - $diameter, $y, $diameter, $diameter, 270, 90)
  $path.AddArc($x + $width - $diameter, $y + $height - $diameter, $diameter, $diameter, 0, 90)
  $path.AddArc($x, $y + $height - $diameter, $diameter, $diameter, 90, 90)
  $path.CloseFigure()
  return $path
}

function Draw-Mark($graphics, $x, $y, $size, $background, $bowlColor) {
  $cream = [System.Drawing.ColorTranslator]::FromHtml("#F8F4ED")
  $charcoal = [System.Drawing.ColorTranslator]::FromHtml("#0F0F0F")
  $bgBrush = New-Object System.Drawing.SolidBrush $background
  $round = New-RoundRect $x $y $size $size ($size * 0.22)
  $graphics.FillPath($bgBrush, $round)

  $penZ = New-Object System.Drawing.Pen $cream, ($size * 0.102)
  $penZ.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
  $penZ.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
  $penZ.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round
  $points = @(
    (New-Object System.Drawing.PointF ($x + $size * 0.30), ($y + $size * 0.30)),
    (New-Object System.Drawing.PointF ($x + $size * 0.70), ($y + $size * 0.30)),
    (New-Object System.Drawing.PointF ($x + $size * 0.32), ($y + $size * 0.71)),
    (New-Object System.Drawing.PointF ($x + $size * 0.74), ($y + $size * 0.71))
  )
  $graphics.DrawLines($penZ, $points)

  $bowlPen = New-Object System.Drawing.Pen $bowlColor, ($size * 0.047)
  $bowlPen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
  $bowlPen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
  $graphics.DrawArc($bowlPen, $x + $size * 0.28, $y + $size * 0.65, $size * 0.48, $size * 0.18, 18, 144)

  $steamPen = New-Object System.Drawing.Pen $cream, ($size * 0.035)
  $steamPen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
  $steamPen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
  $graphics.DrawBezier($steamPen, $x + $size * 0.50, $y + $size * 0.19, $x + $size * 0.43, $y + $size * 0.25, $x + $size * 0.51, $y + $size * 0.27, $x + $size * 0.49, $y + $size * 0.31)
  $graphics.DrawBezier($steamPen, $x + $size * 0.64, $y + $size * 0.16, $x + $size * 0.56, $y + $size * 0.24, $x + $size * 0.65, $y + $size * 0.26, $x + $size * 0.63, $y + $size * 0.30)

  $round.Dispose()
  $bgBrush.Dispose()
  $penZ.Dispose()
  $bowlPen.Dispose()
  $steamPen.Dispose()
}

function Save-Logo($canvas, $path) {
  $canvas.Bitmap.Save((Join-Path (Get-Location) $path), [System.Drawing.Imaging.ImageFormat]::Png)
  $canvas.Graphics.Dispose()
  $canvas.Bitmap.Dispose()
  Write-Output $path
}

$ember = [System.Drawing.ColorTranslator]::FromHtml("#FF7A00")
$cream = [System.Drawing.ColorTranslator]::FromHtml("#F8F4ED")
$charcoal = [System.Drawing.ColorTranslator]::FromHtml("#0F0F0F")

$c = New-Canvas 512 512
Draw-Mark $c.Graphics 0 0 512 $ember $charcoal
Save-Logo $c "public/images/brand/logo-mark.png"

$c = New-Canvas 512 512
Draw-Mark $c.Graphics 0 0 512 $charcoal $cream
Save-Logo $c "public/images/brand/logo-mono.png"

$c = New-Canvas 1080 1080
$brush = New-Object System.Drawing.SolidBrush $charcoal
$c.Graphics.FillPath($brush, (New-RoundRect 0 0 1080 1080 240))
$brush.Dispose()
Draw-Mark $c.Graphics 240 240 600 $ember $charcoal
Save-Logo $c "public/images/brand/logo-social.png"

$c = New-Canvas 820 220
Draw-Mark $c.Graphics 24 24 172 $ember $charcoal
$fontBig = New-Object System.Drawing.Font "Arial", 42, ([System.Drawing.FontStyle]::Bold)
$fontSmall = New-Object System.Drawing.Font "Arial", 17, ([System.Drawing.FontStyle]::Bold)
$brushText = New-Object System.Drawing.SolidBrush $charcoal
$brushAccent = New-Object System.Drawing.SolidBrush $ember
$c.Graphics.DrawString("ZAIQA JUNCTION", $fontBig, $brushText, 226, 54)
$c.Graphics.DrawString("PREMIUM HOME KITCHEN", $fontSmall, $brushAccent, 230, 124)
$fontBig.Dispose(); $fontSmall.Dispose(); $brushText.Dispose(); $brushAccent.Dispose()
Save-Logo $c "public/images/brand/logo-horizontal.png"

$c = New-Canvas 720 520
Draw-Mark $c.Graphics 248 44 224 $ember $charcoal
$fontBig = New-Object System.Drawing.Font "Arial", 46, ([System.Drawing.FontStyle]::Bold)
$fontSmall = New-Object System.Drawing.Font "Arial", 18, ([System.Drawing.FontStyle]::Bold)
$brushText = New-Object System.Drawing.SolidBrush $charcoal
$brushAccent = New-Object System.Drawing.SolidBrush $ember
$format = New-Object System.Drawing.StringFormat
$format.Alignment = [System.Drawing.StringAlignment]::Center
$c.Graphics.DrawString("ZAIQA JUNCTION", $fontBig, $brushText, (New-Object System.Drawing.RectangleF 0, 318, 720, 70), $format)
$c.Graphics.DrawString("FRESH HOMEMADE FOOD", $fontSmall, $brushAccent, (New-Object System.Drawing.RectangleF 0, 390, 720, 40), $format)
$fontBig.Dispose(); $fontSmall.Dispose(); $brushText.Dispose(); $brushAccent.Dispose(); $format.Dispose()
Save-Logo $c "public/images/brand/logo-main.png"
