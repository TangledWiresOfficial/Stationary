# THIS FILE IS AUTO-GENERATED. DO NOT MODIFY!!

# Copyright 2020-2023 Tauri Programme within The Commons Conservancy
# SPDX-License-Identifier: Apache-2.0
# SPDX-License-Identifier: MIT

-keep class uk.co.tangledwires.stationary.* {
  native <methods>;
}

-keep class uk.co.tangledwires.stationary.WryActivity {
  public <init>(...);

  void setWebView(uk.co.tangledwires.stationary.RustWebView);
  java.lang.Class getAppClass(...);
  java.lang.String getVersion();
}

-keep class uk.co.tangledwires.stationary.Ipc {
  public <init>(...);

  @android.webkit.JavascriptInterface public <methods>;
}

-keep class uk.co.tangledwires.stationary.RustWebView {
  public <init>(...);

  void loadUrlMainThread(...);
  void loadHTMLMainThread(...);
  void evalScript(...);
}

-keep class uk.co.tangledwires.stationary.RustWebChromeClient,uk.co.tangledwires.stationary.RustWebViewClient {
  public <init>(...);
}
