// This file was generated by Mendix Studio Pro.
//
// WARNING: Only the following code will be retained when actions are regenerated:
// - the import list
// - the code between BEGIN USER CODE and END USER CODE
// - the code between BEGIN EXTRA CODE and END EXTRA CODE
// Other code you write will be lost the next time you deploy the project.
import { Big } from "big.js";

// BEGIN EXTRA CODE
// END EXTRA CODE

/**
 * @param {"Actions_WIP.StatusBarStyle.DefaultStyle"|"Actions_WIP.StatusBarStyle.LightContentStyle"|"Actions_WIP.StatusBarStyle.DarkContentStyle"} style - If empty, the current style is not changed.
 * @param {boolean} hidden
 * @param {string} backgroundColor - If empty, the current background color is not changed. Use a hex value here including the #
 * @param {"Actions_WIP.OverlaysWebView.Yes"|"Actions_WIP.OverlaysWebView.No"} overlaysWebView - If empty, current value is not changed.
 * @returns {Promise.<boolean>}
 */
export async function ChangeStatusBar(style, hidden, backgroundColor, overlaysWebView) {
    // BEGIN USER CODE
    if (!window.StatusBar) {
        throw new Error("ChangeStatusBar action requires cordova-plugin-statusbar to be installed in the app");
    }
    if (style) {
        switch (style) {
            case "DefaultStyle":
                window.StatusBar.styleDefault();
                break;
            case "LightContentStyle":
                StatusBar.styleLightContent();
                break;
            case "BlackTranslucent":
                StatusBar.styleBlackTranslucent();
                break;
            case "BlackOpaque":
                StatusBar.styleBlackOpaque();
                break;
        }
    }
    if (hidden !== undefined) {
        if (hidden) {
            StatusBar.hide();
        } else {
            StatusBar.show();
        }
    }
    if (backgroundColor) {
        StatusBar.backgroundColorByHexString(backgroundColor);
    }
    if (overlaysWebView) {
        switch (overlaysWebView) {
            case "Yes":
                StatusBar.overlaysWebView(true);
                break;
            case "No":
                StatusBar.overlaysWebView(false);
                break;
        }
    }
    return true;
    // END USER CODE
}
