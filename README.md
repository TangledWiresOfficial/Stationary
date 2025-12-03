# Stationary

Stationary is an app for tracking which UK train stations you've visited.

## Get the app

### iOS
App Store: TBD

### Android
Play Store: TBD

APK Download: TBD

## Developing

### Running the app
First, make sure you install the following dependencies: (or use the `shell.nix` file)
- `androidsdk`
- `at-spi2-atk`
- `atkmm`
- `cairo`
- `cargo`
- `gdk-pixbuf`
- `glib`
- `gobject-introspection`
- `gtk3`
- `harfbuzz`
- `jdk21`
- `librsvg`
- `libsoup_3`
- `make`
- `nodejs`
- `openssl`
- `pango`
- `pkg-config`
- `webkitgtk_4_1`

Then, run `make dev` on Linux, or `cargo tauri dev` for other platforms.

### Compiling
The app can also be compiled with `make` or `cargo tauri build`.