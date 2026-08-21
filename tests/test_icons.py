#!/usr/bin/env python3

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
        self.assertIn(".mat-icon", styles)
        self.assertIn("Material Symbols Sharp", styles)


if __name__ == "__main__":
    unittest.main()
