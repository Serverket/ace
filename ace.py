import sys
import os
import json
import time
import threading
import traceback
import math
import urllib.request

# --- File Logging (essential for pythonw.exe which has no console) ---
_LOG_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'ace_error.log')
_log_file = open(_LOG_PATH, 'w', encoding='utf-8', buffering=1)
sys.stdout = _log_file
sys.stderr = _log_file
# ---------------------------------------------------------------------------

try:
    import requests
    from plyer import notification
    from PIL import Image, ImageDraw, ImageFont
except Exception as _import_err:
    traceback.print_exc()
    _log_file.flush()
    sys.exit(1)

__version__ = "v1.1.1"

CONFIG_FILE = os.path.join(os.path.dirname(__file__), 'config.json')

# Human-readable names for each source (UI stays in Spanish)
SOURCE_NAMES = {
    'bcv':      'BCV $',
    'paralelo': 'Paralelo $',
    'binance':  'Binance $',
    'euro_bcv': 'BCV €',
}

# Background color for the text icon by source
_SOURCE_COLORS = {
    'bcv':      (0,   56,  168),   # Venezuelan Blue
    'paralelo': (25,  120,  25),   # Lettuce Green
    'binance':  (180, 130,  10),   # Binance Gold (darker)
    'euro_bcv': (0,   51,  153),   # EU Blue
}


def _draw_star(dc, cx, cy, r_out, r_in, fill):
    """
    Draws a 5-pointed star at (cx, cy).
    r_out: outer points radius. r_in: inner vertices radius.
    """
    pts = []
    for i in range(10):
        angle = math.radians(-90 + i * 36)
        r = r_out if i % 2 == 0 else r_in
        pts.append((cx + r * math.cos(angle), cy + r * math.sin(angle)))
    dc.polygon(pts, fill=fill)


def _load_font(size=20):
    """Attempts to load a TrueType font from the system with progressive fallback."""
    candidates = [
        # Windows
        r"C:\Windows\Fonts\arialbd.ttf",
        r"C:\Windows\Fonts\arial.ttf",
        r"C:\Windows\Fonts\calibrib.ttf",
        r"C:\Windows\Fonts\segoeui.ttf",
        # macOS
        "/System/Library/Fonts/Helvetica.ttc",
        "/Library/Fonts/Arial Bold.ttf",
        # GNU/Linux
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
        "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf",
    ]
    for path in candidates:
        try:
            return ImageFont.truetype(path, size)
        except Exception:
            pass
    # Last resort: PIL default bitmap font
    try:
        return ImageFont.load_default(size=size)
    except Exception:
        return ImageFont.load_default()


def create_image(source='bcv', save_path=None):
    """
    Generates a vector icon in memory (PIL Image) depending on the source.
    - 'bcv'     : Venezuelan flag (tricolor).
    - 'paralelo': Lettuce (symbol for Venezuelan parallel dollar).
    - 'binance' : Stylized Binance logo in gold.
    - 'euro_bcv': European Union flag (12 gold stars on blue).

    :param source:    str - The selected source.
    :param save_path: str - Optional. Path to save the icon on disk
                           (required by Ayatana on GNU/Linux).
    :return: PIL.Image
    """
    image = Image.new('RGBA', (64, 64), (0, 0, 0, 0))
    dc    = ImageDraw.Draw(image)

    if source == 'binance':
        # --- Binance: gold diamond ---
        dc.rectangle((4, 4, 60, 60), fill=(243, 186, 47))
        dc.polygon([(32, 16), (48, 32), (32, 48), (16, 32)], fill=(24, 26, 32))
        dc.polygon([(32, 24), (40, 32), (32, 40), (24, 32)], fill=(243, 186, 47))

    elif source == 'euro_bcv':
        # --- European Union flag ---
        EU_BLUE = (0,   51, 153)
        EU_GOLD = (255, 204,   0)
        dc.rectangle((4, 4, 60, 60), fill=EU_BLUE)
        # 12 5-pointed stars in a circle of radius 18, centered at (32, 32)
        ring_r = 18
        for i in range(12):
            angle = math.radians(-90 + i * 30)
            sx = 32 + ring_r * math.cos(angle)
            sy = 32 + ring_r * math.sin(angle)
            _draw_star(dc, sx, sy, r_out=4.5, r_in=1.8, fill=EU_GOLD)

    elif source == 'paralelo':
        # --- Lettuce: symbol for Venezuelan parallel dollar ---
        # Outer shadow
        dc.ellipse((5, 8, 59, 57), fill=(15, 80, 15))
        # 6 outer lobes (large leaves)
        for i in range(6):
            a  = math.radians(i * 60)
            lx = 32 + 13 * math.cos(a)
            ly = 32 + 11 * math.sin(a)
            dc.ellipse((lx - 14, ly - 13, lx + 14, ly + 13), fill=(40, 155, 40))
        # 6 inner lobes (small leaves, rotated 30°)
        for i in range(6):
            a  = math.radians(i * 60 + 30)
            lx = 32 + 9 * math.cos(a)
            ly = 32 + 9 * math.sin(a)
            dc.ellipse((lx - 10, ly - 9, lx + 10, ly + 9), fill=(70, 190, 55))
        # Central heart (lighter)
        dc.ellipse((21, 21, 43, 43), fill=(110, 220, 75))
        dc.ellipse((27, 27, 37, 37), fill=(165, 242, 110))

    else:
        # --- BCV: Venezuelan flag (tricolor) ---
        dc.rectangle((4, 10, 60, 24), fill=(252, 209,  22))
        dc.rectangle((4, 24, 60, 38), fill=(  0,  56, 168))
        dc.rectangle((4, 38, 60, 52), fill=(206,  17,  38))
        for x in [20, 26, 32, 38, 44]:
            dc.ellipse((x, 30, x + 2, 32), fill=(255, 255, 255))

    if save_path:
        image.save(save_path)
    return image


def create_text_icon(value, source='bcv'):
    """
    Generates a 64x64 icon with the price rendered as text (Windows/macOS).
    Allows seeing the value directly in the tray without needing to hover.

    Visual strategy:
    - Rounded background with the source color.
    - Currency symbol ($ or €) in the top left corner (small).
    - Large centered integer value.
    """
    SIZE = 64
    img = Image.new('RGBA', (SIZE, SIZE), (0, 0, 0, 0))
    dc  = ImageDraw.Draw(img)

    # Background with source color
    bg = _SOURCE_COLORS.get(source, (30, 30, 30))
    dc.rounded_rectangle((0, 0, SIZE - 1, SIZE - 1), radius=10, fill=bg)

    # Format numeric value
    if value is None:
        price_text = "···"
    else:
        iv = int(value)
        price_text = f"{iv:,}".replace(',', '.') if iv >= 1000 else str(iv)

    # Currency symbol (top-left corner, semi-transparent)
    currency_sym = '€' if source == 'euro_bcv' else '$'
    sym_font     = _load_font(13)
    dc.text((4, 3), currency_sym, font=sym_font, fill=(255, 255, 255, 160))

    # Price in large text, vertically centered with slight offset downwards
    price_font = _load_font(21)
    bbox = dc.textbbox((0, 0), price_text, font=price_font)
    w = bbox[2] - bbox[0]
    h = bbox[3] - bbox[1]
    x = (SIZE - w) / 2 - bbox[0]
    y = (SIZE - h) / 2 - bbox[1] + 5
    dc.text((x, y), price_text, font=price_font, fill=(255, 255, 255))

    return img


class AceApplet:
    """
    Main class for the ACE Widget.
    Implements a hybrid architecture:
    - AyatanaAppIndicator3 for native integration with panel text on GNU/Linux.
    - pystray with dynamic text icon for Windows and macOS (visible without hover).
    """
    def __init__(self):
        self.config       = self.load_config()
        self.prices       = {'bcv': None, 'paralelo': None, 'binance': None, 'euro_bcv': None}
        self.last_notified = {'bcv': None, 'paralelo': None, 'binance': None, 'euro_bcv': None}
        self.running      = True
        self.is_linux     = sys.platform.startswith('linux')
        self.tmp_icon     = "/tmp/ace_icon.png"

        if self.is_linux:
            import gi
            gi.require_version('Gtk', '3.0')
            gi.require_version('AyatanaAppIndicator3', '0.1')
            gi.require_version('GLib', '2.0')
            from gi.repository import Gtk, AyatanaAppIndicator3, GLib
            self.Gtk  = Gtk
            self.GLib = GLib
            self.indicator = AyatanaAppIndicator3.Indicator.new(
                "ace-applet",
                "accessories-calculator",
                AyatanaAppIndicator3.IndicatorCategory.APPLICATION_STATUS
            )
            self.indicator.set_status(AyatanaAppIndicator3.IndicatorStatus.ACTIVE)
            self.indicator.set_label("Cargando...", "Cargando...")
            create_image(self.config.get('primary', 'bcv'), self.tmp_icon)
            self.indicator.set_icon_full(self.tmp_icon, "Icon")
            self.rebuild_linux_menu()
        else:
            import pystray
            from pystray import MenuItem as item
            self.pystray = pystray
            self.item    = item
            primary      = self.config.get('primary', 'bcv')
            self.icon    = pystray.Icon(
                "ace",
                create_text_icon(None, primary),
                "Cargando..."
            )
            self.icon.menu = self.build_pystray_menu()

    def load_config(self):
        default_config = {
            'primary': 'bcv',
            'api_url':      'https://ve.dolarapi.com/v1/dolares',
            'api_url_euro': 'https://ve.dolarapi.com/v1/euros/oficial',
        }
        if os.path.exists(CONFIG_FILE):
            try:
                with open(CONFIG_FILE, 'r') as f:
                    config = json.load(f)
                    default_config.update(config)
            except Exception:
                pass
        return default_config

    def save_config(self):
        with open(CONFIG_FILE, 'w') as f:
            json.dump(self.config, f, indent=4)

    def set_primary(self, source, *_):
        self.config['primary'] = source
        self.save_config()
        if self.is_linux:
            self.rebuild_linux_menu()
        else:
            self.icon.menu = self.build_pystray_menu()
            self.icon.update_menu()
        self.update_tray_title()

    def get_menu_label(self, source):
        val          = self.prices.get(source)
        name         = SOURCE_NAMES.get(source, source)
        primary_mark = " (Activo)" if self.config.get('primary') == source else ""
        if val is None:
            return f"{name}: Cargando...{primary_mark}"
        formatted = f"{val:,.2f}".replace(',', 'X').replace('.', ',').replace('X', '.')
        return f"{name}: {formatted} Bs{primary_mark}"

    def build_pystray_menu(self):
        mk = self.item
        sep = self.pystray.Menu.SEPARATOR
        return self.pystray.Menu(
            mk(lambda _: self.get_menu_label('bcv'),
               lambda: self.set_primary('bcv'),
               radio=True, checked=lambda _: self.config.get('primary') == 'bcv'),
            mk(lambda _: self.get_menu_label('paralelo'),
               lambda: self.set_primary('paralelo'),
               radio=True, checked=lambda _: self.config.get('primary') == 'paralelo'),
            mk(lambda _: self.get_menu_label('binance'),
               lambda: self.set_primary('binance'),
               radio=True, checked=lambda _: self.config.get('primary') == 'binance'),
            mk(lambda _: self.get_menu_label('euro_bcv'),
               lambda: self.set_primary('euro_bcv'),
               radio=True, checked=lambda _: self.config.get('primary') == 'euro_bcv'),
            sep,
            mk('Acerca de ACE',    self.show_about),
            mk('Actualizar Ahora', self.force_update),
            mk('Salir',            self.stop),
        )

    def rebuild_linux_menu(self):
        menu = self.Gtk.Menu()
        for source in ['bcv', 'paralelo', 'binance', 'euro_bcv']:
            it = self.Gtk.MenuItem(label=self.get_menu_label(source))
            it.connect('activate', lambda w, s=source: self.set_primary(s))
            menu.append(it)

        menu.append(self.Gtk.SeparatorMenuItem())

        for label, cb in [
            ("Acerca de ACE",    lambda w: self.show_about()),
            ("Actualizar ahora", lambda w: self.force_update()),
            ("Salir",            lambda w: self.stop()),
        ]:
            it = self.Gtk.MenuItem(label=label)
            it.connect('activate', cb)
            menu.append(it)

        menu.show_all()
        self.indicator.set_menu(menu)

    def show_about(self, *_):
        self.notify("ACE - A Cuanto Está",
                    f"Versión {__version__}\nDesarrollado por serverket.dev\nLicencia GPLv3")

    def notify(self, title, message):
        try:
            notification.notify(title=title, message=message, app_name="ACE", timeout=5)
        except Exception:
            pass

    def update_tray_title(self):
        """
        Updates the text/icon visible in the System Tray based on the primary source.

        - GNU/Linux: native panel label (text next to the icon).
        - Windows/macOS: generated icon with the price rendered in pixels,
          permanently visible in the tray without needing hover.
        """
        primary = self.config.get('primary', 'bcv')
        val     = self.prices.get(primary)
        name    = SOURCE_NAMES.get(primary, primary)

        if val is not None:
            formatted  = f"{val:,.2f}".replace(',', 'X').replace('.', ',').replace('X', '.')
            title_text = f"{name}: {formatted}"

            if self.is_linux:
                # GNU/Linux superpower: native label always visible on the panel
                self.GLib.idle_add(self.indicator.set_label, title_text, title_text)
                create_image(primary, self.tmp_icon)
                self.GLib.idle_add(self.indicator.set_icon_full, self.tmp_icon, "Icon")
                self.GLib.idle_add(self.rebuild_linux_menu)
            else:
                # Windows/macOS: icon with price in pixels + tooltip
                self.icon.title = title_text
                self.icon.icon  = create_text_icon(val, primary)
                self.icon.update_menu()
        else:
            if self.is_linux:
                self.GLib.idle_add(self.indicator.set_label, "Cargando...", "Cargando...")
            else:
                self.icon.title = "Cargando..."
                self.icon.icon  = create_text_icon(None, primary)

    def check_changes_and_notify(self, source):
        """
        Compares the newly fetched price with the previous one.
        If there is a fluctuation, fires a desktop notification.
        """
        val  = self.prices[source]
        last = self.last_notified[source]
        if last is not None and val != last:
            name = SOURCE_NAMES.get(source, source)
            self.notify("ACE Update", f"{name} cambió a {val:,.2f}")
        self.last_notified[source] = val

    def fetch_dolarapi(self):
        """
        Fetches USD BCV and Parallel from DolarAPI, and Euro BCV from its own endpoint.
        """
        # --- USD (BCV + Paralelo) ---
        try:
            req = urllib.request.Request(
                self.config['api_url'],
                headers={'User-Agent': 'Mozilla/5.0'}
            )
            with urllib.request.urlopen(req, timeout=10) as response:
                data = json.loads(response.read().decode())
                for rate in data:
                    if rate.get('fuente') == 'oficial':
                        self.prices['bcv'] = rate.get('promedio')
                        self.check_changes_and_notify('bcv')
                    elif rate.get('fuente') == 'paralelo':
                        self.prices['paralelo'] = rate.get('promedio')
                        self.check_changes_and_notify('paralelo')
        except Exception as e:
            print("Error dolarapi (USD):", e)

        # --- Euro BCV ---
        try:
            req = urllib.request.Request(
                self.config['api_url_euro'],
                headers={'User-Agent': 'Mozilla/5.0'}
            )
            with urllib.request.urlopen(req, timeout=10) as response:
                rate = json.loads(response.read().decode())
                self.prices['euro_bcv'] = rate.get('promedio')
                self.check_changes_and_notify('euro_bcv')
        except Exception as e:
            print("Error dolarapi (EUR):", e)

    def fetch_binance(self):
        """
        Queries the Binance P2P API anonymously.
        Calculates the average price of the top 10 USDT/VES sell offers.
        """
        try:
            payload = {
                "asset": "USDT", "fiat": "VES", "merchantCheck": False,
                "page": 1, "payTypes": [], "publisherType": None,
                "rows": 10, "tradeType": "SELL",
            }
            res  = requests.post(
                "https://p2p.binance.com/bapi/c2c/v2/friendly/c2c/adv/search",
                json=payload, timeout=10
            )
            data = res.json()
            if data.get('code') == '000000' and 'data' in data:
                prices = [float(item['adv']['price']) for item in data['data']]
                if prices:
                    self.prices['binance'] = sum(prices) / len(prices)
                    self.check_changes_and_notify('binance')
        except Exception as e:
            print("Error binance (Direct API):", e)
            # --- Yadio Fallback (No gaps, no caveats) ---
            try:
                print("Intentando fallback con Yadio...")
                req = urllib.request.Request(
                    "https://api.yadio.io/json/USDT",
                    headers={'User-Agent': 'Mozilla/5.0'}
                )
                with urllib.request.urlopen(req, timeout=10) as response:
                    data = json.loads(response.read().decode())
                    if 'VES' in data and 'price' in data['VES']:
                        self.prices['binance'] = float(data['VES']['price'])
                        self.check_changes_and_notify('binance')
            except Exception as fallback_e:
                print("Error binance (Yadio Fallback):", fallback_e)

    def fetch_all(self):
        self.fetch_dolarapi()
        self.fetch_binance()
        self.update_tray_title()

    def force_update(self, *_):
        threading.Thread(target=self.fetch_all, daemon=True).start()

    def loop_dolarapi(self):
        while self.running:
            self.fetch_dolarapi()
            self.update_tray_title()
            for _ in range(30 * 60):
                if not self.running:
                    break
                time.sleep(1)

    def loop_binance(self):
        while self.running:
            self.fetch_binance()
            self.update_tray_title()
            for _ in range(10 * 60):
                if not self.running:
                    break
                time.sleep(1)

    def run(self):
        threading.Thread(target=self.loop_dolarapi, daemon=True).start()
        threading.Thread(target=self.loop_binance, daemon=True).start()

        if self.is_linux:
            # Immediate pre-fetch before starting the GTK loop
            self.force_update()
            self.Gtk.main()
        else:
            # On Windows/macOS the icon must be registered with the Shell
            # before the first fetch. The 'setup' callback guarantees this order.
            def _setup(icon):
                icon.visible = True
                self.force_update()

            self.icon.run(setup=_setup)

    def stop(self, *_):
        self.running = False
        if self.is_linux:
            self.Gtk.main_quit()
        else:
            self.icon.stop()


if __name__ == "__main__":
    try:
        app = AceApplet()
        app.run()
    except Exception:
        traceback.print_exc()
        _log_file.flush()
