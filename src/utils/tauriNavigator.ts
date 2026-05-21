import {INavigator, Logger, NavigateParams, NavigateResponse} from "oidc-client-ts";
import {openUrl} from "@tauri-apps/plugin-opener";

export class TauriNavigator implements INavigator {
  private readonly _logger = new Logger("TauriNavigator");

  public async prepare() {
    this._logger.create("prepare");

    return {
      navigate: async (params: NavigateParams): Promise<NavigateResponse> => {
        this._logger.create("navigate");
        return new Promise(async (resolve, reject) => {
          await openUrl(params.url).then(() => resolve({ url: params.url })).catch(reject);
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