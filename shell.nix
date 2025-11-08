let
  pkgs = import <nixpkgs> { };

  androidComposition = pkgs.androidenv.composeAndroidPackages {
    platformVersions = [
      "34"
      "35"
      "36"
    ];
    platformToolsVersion = "35.0.1";
    buildToolsVersions = ["35.0.0"];
    includeNDK = true;
  };
in
pkgs.mkShell {
  nativeBuildInputs = with pkgs; [
    cargo
    cargo-tauri
    gnumake
    gobject-introspection
    nodejs
    pkg-config
  ];

  buildInputs = with pkgs; [
    androidComposition.androidsdk
    at-spi2-atk
    atkmm
    cairo
    gdk-pixbuf
    glib
    gtk3
    harfbuzz
    librsvg
    libsoup_3
    pango
    webkitgtk_4_1
    openssl
  ];

  shellHook = ''
    export ANDROID_HOME="${androidComposition.androidsdk}/libexec/android-sdk"
    export NDK_HOME="$ANDROID_HOME/ndk/$(ls -1 $ANDROID_HOME/ndk)"
  '';
}
