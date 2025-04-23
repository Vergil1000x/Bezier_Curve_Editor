# Bezier Curve Editor for After Effects

## Bezier Editor – Free, Open & Flow-like

A free extension for After Effects that lets you create and apply custom cubic Bezier easing curves to keyframes using an intuitive, interactive canvas. It’s like [Flow](https://aescripts.com/flow/) — but free and open-source. I call it Flov.

I reinvented the wheel, as the old one was behind a paywall. Enjoy!

## Features

- Interactive canvas to edit cubic Bezier curves
- Input field for precise curve values (e.g., `0.25,0.1,0.25,1`)
- Presets for common easing curves
- "Copy" button to copy `cubic-bezier(a,b,c,d)` to the clipboard
- "Apply to AE" button to apply curves to selected keyframes
- Dark/light theme toggle

## Requirements

- Windows or macOS
- After Effects CS6 (12.0) or later (tested on 25.0)
- AEScripts ZXP Installer ([Download](https://aescripts.com/learn/zxp-installer))

## Alternate Video Guide

- Check this video on YouTube - [Link](https://youtu.be/V19eBzCciJU?si=yBVhxdyaBgPsWJ44)

## Installation

1. Download `BezierCurveEditor.zxp` (v1.0.0) from [GitHub](https://github.com/Vergil1000x/Bezier_Curve_Editor/releases/download/v1.0.0/BezierCurveEditor.zxp).
2. Install using AEScripts ZXP Installer:
   - Download and install AEScripts ZXP Installer from [here](https://aescripts.com/learn/zxp-installer).
   - Open ZXP Installer.
   - Drag `BezierCurveEditor.zxp` into the window or select it.
   - Install for After Effects.
3. In After Effects:
   - Go to `Edit > Preferences > General` (Windows) or `After Effects > Preferences > General` (macOS).
   - Check "Allow Extensions" or "Allow scripts to write files and access network".
   - Restart After Effects.
4. Open the extension: `Window > Extensions > Bezier Curve Editor`.

### Manual Installation (Alternative)

If the ZXP Installer fails, follow these steps:

1. Rename `BezierCurveEditor.zxp` to `BezierCurveEditor.zip` and extract it.
2. Copy the `BezierCurveEditor` folder to:
   - Windows: `C:\Users\<YourUsername>\AppData\Roaming\Adobe\CEP\extensions\`
   - macOS: `~/Library/Application Support/Adobe/CEP/extensions/`
3. Enable debugging:
   - Windows: Run `reg add HKEY_CURRENT_USER\Software\Adobe\CSXS.12 /v PlayerDebugMode /t REG_SZ /d 1` in Command Prompt.
   - macOS: Run `defaults write com.adobe.CSXS.12 PlayerDebugMode 1` in Terminal.
4. In After Effects, enable "Allow Extensions" (see above) and restart.

## Usage

1. Open the extension: `Window > Extensions > Bezier Curve Editor`.
2. Create a curve:
   - Drag control points on the canvas to shape the curve.
   - Enter precise values in the input field (e.g., `0.25,0.1,0.25,1`).
   - Select a preset from the "Preset Curves" list.
3. Copy the curve: Click "Copy" to save the `cubic-bezier(...)` value to your clipboard.
4. Apply to keyframes:
   - Select a layer in After Effects with keyframes (e.g., position or opacity).
   - Click "Apply to AE" to apply the curve to the selected keyframes.
   - If no keyframes are selected, an error message will appear.
5. Toggle themes: Use the theme button to switch between dark and light modes.

## Tips: Custom Bezier Curves

1. Create custom curves using tools like [Flow](https://aescripts.com/flow/) or [cubic-bezier.com](https://cubic-bezier.com).
2. Edit the `graphs.json` file in the extension folder:
   - Windows: `C:\Users\<YourUsername>\AppData\Roaming\Adobe\CEP\extensions\BezierCurveEditor\graphs.json`
   - macOS: `~/Library/Application Support/Adobe/CEP/extensions/BezierCurveEditor\graphs.json`
3. Add curves in this format:
   ```json
   [
     {
       "label": "Custom Ease",
       "value": "custom_ease",
       "tooltip": "Custom: Smooth Ease",
       "bezier": "0.25,0.1,0.25,1",
       "group": "Custom"
     }
   ]
   ```
4. Save the file. Your custom curves will appear in the preset list.
5. Share `graphs.json` with others for personal use.

## Troubleshooting

- **Extension Not Appearing**: Ensure "Allow Extensions" is enabled in After Effects preferences and restart the application.
- **Installation Fails**: Use manual installation if ZXP Installer fails. Verify the extension folder path and debugging setting.
- **Apply to AE Fails**: Select a layer with keyframes before clicking "Apply to AE". Check the error message in the extension for details.
- **Hidden Files**: If the extension folder is not visible, enable hidden files in File Explorer (Windows) or use Finder’s “Go to Folder” (macOS).
- **Contact Support**: Reach out via [Discord](https://www.discord.gg/kMdnrGGf3p), [YouTube](https://www.youtube.com/@Vergil1000), or [Email](mailto:koushikmallick2002@gmail.com).

## Uninstall Using AEScripts ZXP Installer

1. Open AEScripts ZXP Installer.
2. Locate **Bezier Curve Editor** in the list of installed extensions.
3. Click **Uninstall** or **Remove** and follow any prompts.
4. Restart After Effects to complete the uninstallation.

## Manual Uninstallation

1. **Delete the Extension Files**:
   - Windows: Navigate to `C:\Users\<YourUsername>\AppData\Roaming\Adobe\CEP\extensions\` and delete the `BezierCurveEditor` folder.
   - macOS: Navigate to `~/Library/Application Support/Adobe/CEP/extensions/` and delete the `BezierCurveEditor` folder.
   - Note: Enable hidden files if the folder is not visible. On macOS, use Finder’s “Go to Folder” option.
2. **Remove Debugging Setting (Optional)**:
   - Windows: Open Command Prompt as an administrator and run:
     ```cmd
     reg delete HKEY_CURRENT_USER\Software\Adobe\CSXS.12 /v PlayerDebugMode /f
     ```
   - macOS: Open Terminal and run:
     ```bash
     defaults delete com.adobe.CSXS.12 PlayerDebugMode
     ```
   - Note: Skip this step if debugging was not enabled.
3. Restart After Effects to finalize the removal.

## Support

For questions, bug reports, or feature requests, contact me:

- **Discord**: [Join the community](https://www.discord.gg/kMdnrGGf3p)
- **YouTube**: [Vergil1000](https://www.youtube.com/@Vergil1000)
- **Email**: [My Email](mailto:koushikmallick2002@gmail.com)

## Notes

- The extension uses a self-signed certificate, requiring "Allow Extensions" to be enabled in After Effects.
- Not available on Adobe Marketplace due to cost constraints.
- Check for updates on [GitHub](https://github.com/Vergil1000x/Bezier_Curve_Editor/releases).

## Acknowledgements

- **[Grok](https://grok.com/)**: Wrote most of the extension’s code.
- **[ChatGPT](https://chatgpt.com/)**: Provided insights and resolved development queries.
- **[grishka/AE CubicBezier.jsx](https://gist.github.com/grishka/83755b852a1968b8a98e2153eb5c060f)**: Guided Bezier curve conversion to speed and influence.
- **[zepha (CodePen)](https://codepen.io/zepha/pen/gapMVW)**: Contributed cubic Bezier graph code.
- **[After Effects Scripting Guide](https://ae-scripting.docsforadobe.dev/)**: Helped in making my CEP a success through it's guide.
- **[Vergil1000](https://www.youtube.com/@Vergil1000)**: aka Me, for managing development, packaging, documentation and distribution.

### About the Project

This extension was created (in 3 days) as a free alternative to paid tool, i.e. Flow.

## Feedback

Additionally you can also fill this [Form](https://docs.google.com/forms/d/e/1FAIpQLSfymHk5ygvyQy5AHubEUOJSiPmvneQtD9l3aKD0JqJ7VcTisg/viewform?usp=sharing) to give me some insights, bugs, suggestions, improvements, etc.

## License

- Free for personal use only.
- Do not steal, commercialize, resell, or redistribute as your own.
- You may share the `.zxp` file and `graphs.json` for personal use, provided you credit the original author (Vergil1000x).

Free Bezier Curve Editor for After Effects | Free Flow Alternative

Discover the Bezier Curve Editor, a free, open-source After Effects extension to create and apply custom cubic Bezier easing curves to keyframes! 🎨 Think Flow, but free! In this video, I walk you through installation, usage, and customization, as explained in the official README. Perfect for animators and motion designers looking to enhance their workflow without breaking the bank. 💸

🔗 Download: https://github.com/Vergil1000x/Bezier_Curve_Editor/releases/download/v1.0.0/BezierCurveEditor.zxp
🔗 AEScripts ZXP Installer: https://aescripts.com/learn/zxp-installer
🔗 Full README: https://github.com/Vergil1000x/Bezier_Curve_Editor

📋 Features

- Interactive canvas to edit Bezier curves
- Input precise values (e.g., 0.25,0.1,0.25,1)
- Presets for common easing curves
- Copy curves to clipboard
- Apply curves to After Effects keyframes
- Dark/light theme toggle

🛠️ Installation

1. Download BezierCurveEditor.zxp (v1.0.0) from GitHub.
2. Use AEScripts ZXP Installer to install for After Effects.
3. In After Effects, enable "Allow Extensions" in Preferences > General and restart.
4. Open via Window > Extensions > Bezier Curve Editor.
   _Manual installation steps in the README if needed!_

🎮 Usage

1. Open the extension in After Effects.
2. Shape curves on the canvas, enter values, or pick a preset.
3. Click "Copy" to save the curve or "Apply to AE" for selected keyframes.
4. Switch themes for your vibe! 🌙☀️

💡 Tips

- Customize curves in graphs.json (see README for details).
- Share your custom curves with friends! 📤
- Use cubic-bezier.com for inspiration.

❓ Support
Got questions or issues? Reach out:

- Discord: https://discord.gg/kMdnrGGf3p
- Email: koushikmallick2002@gmail.com
- YouTube Comments: Drop them below! ⬇️

🎶 Music
"In Dreamland" by @Chillpeach (No Copyright Music)
Watch: https://youtu.be/DSWYAclv2I8?si=11t66VVR5VhdKfSd

🙌 Feedback & Subscribe!
Love the extension? Have suggestions or edit requests? Comment below! 🗿 Don’t forget to like, share, and subscribe for more After Effects tutorials, anime AMVs, and creative content! 🚀

#vergil1000 #AfterEffects #BezierCurve #MotionDesign #Animation #FreeExtension #FlowAlternative #Tutorial
