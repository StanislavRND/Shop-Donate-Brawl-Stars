"""Email sending via SMTP (aiosmtplib). All SMTP settings come from .env."""

from email.message import EmailMessage

from aiosmtplib import send

from app.core.config import Settings
from app.services.email_templates import render_verification_email


class EmailService:
    def __init__(self, settings: Settings) -> None:
        self.settings = settings

    async def _send(self, message: EmailMessage) -> None:
        s = self.settings
        await send(
            message,
            hostname=s.SMTP_HOST,
            port=s.SMTP_PORT,
            username=s.SMTP_USER or None,
            password=s.SMTP_PASSWORD or None,
            start_tls=s.SMTP_STARTTLS,
        )

    async def send_verification_email(self, to_email: str, code: str) -> None:
        s = self.settings
        message = EmailMessage()
        message["From"] = f"{s.SMTP_FROM_NAME} <{s.SMTP_FROM_EMAIL}>"
        message["To"] = to_email
        message["Subject"] = f"{s.SMTP_FROM_NAME} — код подтверждения: {code}"
        # Plain-text part first (fallback for clients that block HTML)
        message.set_content(
            f"Здравствуйте!\n\n"
            f"Ваш код подтверждения email:\n\n"
            f"    {code}\n\n"
            f"Код действителен {s.EMAIL_VERIFICATION_CODE_EXPIRE_MINUTES} минут.\n"
            f"Если вы не регистрировались, просто проигнорируйте это письмо."
        )
        message.add_alternative(
            render_verification_email(
                code, s.EMAIL_VERIFICATION_CODE_EXPIRE_MINUTES, s.SMTP_FROM_NAME
            ),
            subtype="html",
        )
        await self._send(message)
