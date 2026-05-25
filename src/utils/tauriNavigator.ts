import {INavigator, Logger, NavigateParams, NavigateResponse} from "oidc-client-ts";
import {openUrl} from "@tauri-apps/plugin-opener";
import {type} from "@tauri-apps/plugin-os";

export class TauriNavigator implements INavigator {
  private readonly _logger = new Logger("TauriNavigator");

  public async prepare() {
    this._logger.create("prepare");

    return {
      navigate: async (params: NavigateParams): Promise<NavigateResponse> => {
        this._logger.create("navigate");
        return new Promise((resolve, reject) => {
          const openWith = type() === "android" || type() === "ios" ? "inAppBrowser" : undefined;

          openUrl(params.url, openWith).then(() => resolve({ url: params.url })).catch(reject);
        });
      },
      close: () => {
        this._logger.create("close");
        return;
      },
    };
  }

  public async callback() {
    return;
  }
}
