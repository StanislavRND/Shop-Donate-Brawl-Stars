from app.services.email_templates import render_verification_email


def test_verification_email_contains_code_and_brand_colors() -> None:
    html = render_verification_email("123456", 10, "Vanta Shop")

    # The code is a single selectable text node (easy to copy whole)
    assert ">123456</span>" in html

    # Brand name from settings is rendered
    assert "Vanta&nbsp;Shop" in html

    # Brand colors from the frontend dark theme
    assert "#0b0b0d" in html  # bg
    assert "#121217" in html  # bg-alt (card)
    assert "#141417" in html  # surface (code box)
    assert "#26262b" in html  # border
    assert "#d4af37" in html  # gold accent
    assert "#f5f5f4" in html  # text

    # Email-client friendly markup
    assert html.startswith("<!DOCTYPE html>")
    assert 'role="presentation"' in html
    assert "10 минут" in html
