# Bezier Curve Editor for After Effects

## Bezier Editor – Free, Open & Flow-like

A free extension for After Effects that lets you create and apply custom Cubic Bezier easing curves to keyframes using an intuitive, interactive canvas.

Basically... it's like [Flow](https://aescripts.com/flow/) — but free.

I might have reinvented the wheel, as the old one was behind a paywall.

Power to the people. Down with overpriced keyframe tools.

## Features

- Interactive canvas to draw and edit Bezier curves
- Input field for precise curve values (e.g., `0.25,0.1,0.25,1`)
- Presets for common easing curves
- "Copy" button to copy `cubic-bezier(...)` to clipboard
- "Apply to AE" button to apply curves to selected keyframes
- Dark/light theme toggle

## Requirements

- After Effects CS6 (12.0) or later (tested on 25.0)
- Windows or macOS
- AEScripts ZXP Installer - [Download](https://aescripts.com/learn/zxp-installer)

## Installation

1. Download `BezierCurveEditor.zxp` from [release link].
2. Install using AEScripts ZXP Installer:
   - Download and install AEScripts ZXP Installer from [Download](https://aescripts.com/learn/zxp-installer).
   - Open AEScripts ZXP Installer.
   - Drag `BezierCurveEditor.zxp` into the window or select it.
   - Install for After Effects.
3. In After Effects:
   - Go to `Edit > Preferences > General` (Windows) or `After Effects > Preferences > General` (macOS).
   - Check "Allow Extensions" or "Allow scripts to write files and access network".
   - Restart After Effects.
4. Open the extension: `Window > Extensions > Bezier Curve Editor`.

## Manual Installation (if AEScripts ZXP Installer fails)

1. Rename `BezierCurveEditor.zxp` to `BezierCurveEditor.zip` and extract it.
2. Copy the `BezierCurveEditor` folder to:
   - Windows: `C:\Users\<YourUsername>\AppData\Roaming\Adobe\CEP\extensions\`
   - macOS: `~/Library/Application Support/Adobe/CEP/extensions/`
3. Enable debugging:
   - Windows: Run `reg add HKEY_CURRENT_USER\Software\Adobe\CSXS.12 /v PlayerDebugMode /t REG_SZ /d 1` in Command Prompt.
   - macOS: Run `defaults write com.adobe.CSXS.12 PlayerDebugMode 1` in Terminal.
4. Open After Effects and enable "Allow Extensions" (see above).

## Usage

1. Open `Window > Extensions > Bezier Curve Editor`.
2. Draw a curve on the canvas or enter values (e.g., `0.25,0.1,0.25,1`).
3. Click "Copy" to copy the `cubic-bezier(...)` value.
4. Select a layer with keyframes, then click "Apply to AE" to apply the curve.
5. Toggle themes for dark/light mode.

## Tips (Custom Bezier Curves and Exchange/Export with Other Humans)

1. Make a list of all the custom cubic Bezier curves you want. You can use the inbuilt graph of [Flow](https://aescripts.com/flow/) to copy them or go to [https://cubic-bezier.com](https://cubic-bezier.com).
2. Open the `graphs.json` file in the extension folder:
   - Windows: `C:\Users\<YourUsername>\AppData\Roaming\Adobe\CEP\extensions\BezierCurveEditor\graphs.json`
   - macOS: `~/Library/Application Support/Adobe/CEP/extensions/BezierCurveEditor/graphs.json`
3. Add your curves in the following format:
   ```json
   [
     {
       "label": "Whatever You Wanna Name It",
       "value": "whatever",
       "tooltip": "Custom: Whatever",
       "bezier": "0.25,0.1,0.25,1",
       "group": "Custom"
     },
     {
       "label": "Whatever2 You Wanna Name It",
       "value": "whatever2",
       "tooltip": "Custom: Whatever2",
       "bezier": "0.5,1,0.5,1",
       "group": "Custom"
     }
   ]
   ```
4. Save the file (Ctrl + S). Voila, you just added your custom cubic Bezier curves.
5. Copy `graphs.json` and share it with friends for personal use.

## Notes

- Requires After Effects CS6 or later due to CEP extension support.
- Uses a self-signed certificate, so "Allow Extensions" must be enabled.
- If AEScripts ZXP Installer fails, use manual installation.
- For issues, contact me on [Discord](https://www.discord.gg/kMdnrGGf3p) or [YouTube](https://www.youtube.com/@Vergil1000) or [Email](mailto:koushikmallick2002@gmail.com).
- Not on Adobe Marketplace because I'm broke.
- Vibe coded this in three days... cus AI took my job.
- Sharing `graphs.json` is allowed for personal use only.

## License

Free for personal use only.

Do not steal/commercialize/resell/redistribute as your own.

You may share the `.zxp` file and `graphs.json` with others for personal use, provided you credit the original author.
