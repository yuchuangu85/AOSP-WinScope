#!/usr/bin/env python3

import re
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


class IconAssetContractTest(unittest.TestCase):
    def test_material_icon_font_is_packaged_and_applied_to_mat_icon(self):
        font = ROOT / "src/assets/MaterialSymbolsOutlined.woff2"
        styles = (ROOT / "src/styles/styles.scss").read_text(encoding="utf-8")

        self.assertTrue(font.is_file(), "Material icon font must be bundled as a local asset")
        self.assertGreater(font.stat().st_size, 0)
        self.assertIn("@font-face", styles)
        self.assertIn("MaterialSymbolsOutlined.woff2", styles)
        self.assertIn("Material Symbols Sharp", styles)

        icon_rule = re.search(
            r"\.mat-icon,\s*\.material-symbols-outlined\s*\{(?P<body>.*?)\n\}",
            styles,
            flags=re.DOTALL,
        )
        self.assertIsNotNone(icon_rule, "Material icon style rule is missing")
        declarations = icon_rule.group("body")
        required_cross_platform_properties = (
            "font-size: 24px",
            "line-height: 1",
            "letter-spacing: normal",
            "text-transform: none",
            "vertical-align: middle",
            "display: inline-block",
            "white-space: nowrap",
            "word-wrap: normal",
            "direction: ltr",
            "-webkit-font-feature-settings: 'liga'",
            "-webkit-font-smoothing: antialiased",
        )
        for declaration in required_cross_platform_properties:
            self.assertIn(
                declaration,
                declarations,
                f"Material icon style is missing cross-platform declaration: {declaration}",
            )


if __name__ == "__main__":
    unittest.main()
