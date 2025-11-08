# patternfly-tauri-example

This is a basic example [Tauri](https://tauri.app/) application that uses [PatternFly](https://patternfly.org/) + [React](https://react.dev/) for the frontend. It also supports mobile devices.

## Running the app
First, make sure you install the following dependencies: (or use the `shell.nix` file)
- `androidsdk`
- `at-spi2-atk`
- `atkmm`
- `cairo`
- `cargo`
- `cargo-tauri`
- `gdk-pixbuf`
- `glib`
- `gobject-introspection`
- `gtk3`
- `harfbuzz`
- `librsvg`
- `libsoup_3`
- `make`
- `nodejs`
- `openssl`
- `pango`
- `pkg-config`
- `webkitgtk_4_1`

Then, run `make dev` on Linux, or `cargo tauri dev` for other platforms.

## Compiling
The app can also be compiled with `make` or `cargo tauri build`.