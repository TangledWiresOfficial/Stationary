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
    export XDG_DATA_DIRS=${pkgs.gsettings-desktop-schemas}/share/gsettings-schemas/${pkgs.gsettings-desktop-schemas.name}:${pkgs.gtk3}/share/gsettings-schemas/${pkgs.gtk3.name}:$XDG_DATA_DIRS
    export GIO_MODULE_DIR="${pkgs.glib-networking}/lib/gio/modules/"
    export JAVA_HOME="${pkgs.jdk17}"
  '';
}
