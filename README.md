# FileUploader Plugin

The **FileUploader** plugin adds a file upload button to the Discord chat bar, allowing users to upload files to a specified server and share the uploaded file's URL in the chat.

## Features
- Adds a file upload button to the chat bar.
- Uploads files to a customizable server endpoint.
- Automatically inserts the uploaded file's URL into the chat input box.
- Displays notifications and toasts for upload success or failure.
- Configurable settings for:
  - Upload server URL
  - Authentication token
  - Maximum upload file size (in MB)

## Installation
1. Clone Vencord from their GitHub page.
2. Clone or download this repository.
3. Add the plugin to your Vencord plugins directory. ``src/userplugins/``
4. Enable the plugin in the Vencord settings.
5. And you are ready to go! 🚀

## Settings
Configure the following settings in the plugin menu:
- **Upload URL**: The URL of the server where files will be uploaded.
- **Authentication Token**: Token for server authentication.
- **Maximum Upload Size**: The maximum allowed file size (in MB).

## Usage
1. Click the **Upload File** button in the chat bar.
2. Select a file to upload.
3. The plugin uploads the file to the configured server and inserts the resulting URL into the chat input box.
4. Send the message to share the file.

## Troubleshooting
- Ensure the **Upload URL** and **Authentication Token** are correctly configured.
- Check the **Maximum Upload Size** if large files fail to upload.
- Notifications will provide error details if an upload fails.

## Connect
If you are experiencing trouble with the plugin, please contact me through Discord: [Svenns.]([https://discord.com/users/411556214741401602])

## License
This plugin is licensed under the [Mozilla Public License 2.0]([https://www.gnu.org/licenses/gpl-3.0.html](https://www.mozilla.org/en-US/MPL/2.0/)).
