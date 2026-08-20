"""HTML email templates.

Colors match the frontend dark-theme design tokens (frontend/src/shared/styles/_themes.scss):
bg #0b0b0d, bg-alt #121217, surface #141417, surface-hover #1b1b1f,
border #26262b, text #f5f5f4, muted #9c9ca3, gold #d4af37.

Email clients strip <style> blocks and external resources, so the layout is
table-based with inline styles only. No external dependencies.
"""

_FONT = "'Manrope',-apple-system,'Segoe UI',Roboto,Arial,sans-serif"

VERIFICATION_EMAIL_HTML = """\
<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="dark">
<title>Подтверждение email</title>
</head>
<body style="margin:0;padding:0;background-color:#0b0b0d;">
<div style="display:none;max-height:0;overflow:hidden;">Код подтверждения: {code}</div>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#0b0b0d;">
<tr>
<td align="center" style="padding:32px 16px;">

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:520px;background-color:#121217;border:1px solid #26262b;border-radius:16px;">
    <tr>
    <td align="center" style="padding:40px 32px 8px 32px;font-family:{font};">
        <div style="font-size:13px;font-weight:600;letter-spacing:3px;text-transform:uppercase;color:#d4af37;">
            {brand}
        </div>
    </td>
    </tr>
    <tr>
    <td align="center" style="padding:12px 32px 0 32px;font-family:{font};">
        <h1 style="margin:0;font-size:22px;line-height:1.3;font-weight:700;color:#f5f5f4;">
            Подтверждение email
        </h1>
        </td>
    </tr>
    <tr>
    <td align="center" style="padding:12px 40px 0 40px;font-family:{font};">
        <p style="margin:0;font-size:15px;line-height:1.6;color:#9c9ca3;">
            Введите этот код на сайте, чтобы завершить регистрацию
        </p>
    </td>
    </tr>
    <tr>
    <td align="center" style="padding:28px 32px 8px 32px;font-family:{font};">
        <!-- The code is a single selectable text node: tap/click to copy it whole -->
        <div style="display:inline-block;padding:14px 28px;background-color:#141417;border:1px solid #26262b;border-bottom:3px solid #d4af37;border-radius:10px;">
            <span style="font-size:24px;font-weight:700;letter-spacing:6px;color:#d4af37;">{code}</span>
        </div>
    </td>
    </tr>
    <tr>
    <td align="center" style="padding:8px 32px 32px 32px;font-family:{font};">
        <p style="margin:0;font-size:13px;line-height:1.6;color:#9c9ca3;">
            Код действителен {minutes} минут.<br>
            Если вы не регистрировались — просто проигнорируйте это письмо.
        </p>
    </td>
    </tr>

    <tr>
    <td style="padding:0 32px;">
        <div style="height:1px;background-color:#26262b;line-height:1px;font-size:0;">&nbsp;</div>
    </td>
    </tr>
    <tr>
    <td align="center" style="padding:20px 32px 32px 32px;font-family:{font};">
        <p style="margin:0;font-size:12px;line-height:1.5;color:#9c9ca3;">
            Это автоматическое письмо, отвечать на него не нужно.
        </p>
    </td>
    </tr>
    </table>

</td>
</tr>
</table>
</body>
</html>
"""


def render_verification_email(code: str, minutes: int, brand: str) -> str:
    return VERIFICATION_EMAIL_HTML.format(
        code=code,
        minutes=minutes,
        font=_FONT,
        # non-breaking spaces keep the brand name on one line in the header
        brand=brand.replace(" ", "&nbsp;"),
    )
