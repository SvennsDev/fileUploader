/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { addChatBarButton, ChatBarButton, removeChatBarButton } from "@api/ChatButtons";
import { showNotification } from "@api/Notifications";
import { definePluginSettings } from "@api/Settings";
import { Devs } from "@utils/constants";
import { insertTextIntoChatInputBox } from "@utils/discord";
import definePlugin, { OptionType } from "@utils/types";
import { SelectedChannelStore } from "@webpack/common";
// eslint-disable-next-line no-duplicate-imports
import { Toasts } from "@webpack/common";

const settings = definePluginSettings({
    uploadUrl: {
        description: "URL for file uploads",
        type: OptionType.STRING,
        default: "https://example.com/upload",
    },
    token: {
        description: "Authentication token for file uploads",
        type: OptionType.STRING,
        default: "INSERT TOKEN HERE",
    },
    maxUploadSize: {
        description: "Maximum upload size in MB",
        type: OptionType.NUMBER,
        default: 500,
    },
});

async function sendFileToServer(file: File): Promise<string> {
    console.log("Uploading file", file);
    const message = "File is being uploaded";
    const type = Toasts.Type.CUSTOM;
    Toasts.show({
        id: Toasts.genId(),
        message,
        type,
        options: {
            position: Toasts.Position.BOTTOM, // NOBODY LIKES TOASTS AT THE TOP
        },
    });
    const formData = new FormData();
    formData.append("upload", file);
    formData.append("token", settings.store.token);

    try {
        const response = await fetch(settings.store.uploadUrl, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${settings.store.token}`,
            },
            body: formData,
        });

        const responseData = await response.json();

        if (response.ok && responseData.message === "OK") {
            console.log("File uploaded successfully", responseData);
            const message = "File uploaded successfully";
            const type = Toasts.Type.SUCCESS;
            Toasts.show({
                id: Toasts.genId(),
                message,
                type,
                options: {
                    position: Toasts.Position.BOTTOM, // NOBODY LIKES TOASTS AT THE TOP
                },
            });
            return responseData.url; // Return the URL of the uploaded file
        } else {
            Toasts.show({
                id: Toasts.genId(),
                message: "Error uploading file",
                type: Toasts.Type.FAILURE,
                options: {
                    position: Toasts.Position.BOTTOM,
                },
            });
            console.error("Error uploading file", responseData);
            throw new Error("Failed to upload file.");
        }
    } catch (error: any) {
        console.error("Error uploading file", error);
        Toasts.show({
            id: Toasts.genId(),
            message: "Error uploading file",
            type: Toasts.Type.FAILURE,
            options: {
                position: Toasts.Position.BOTTOM,
            },
        });
        throw new Error(error.message);
    }
}

const FileUploadButton: React.FC = () => {
    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const maxUploadSizeInBytes = settings.store.maxUploadSize * 1024 * 1024;
        if (file.size > maxUploadSizeInBytes) {
            Toasts.show({
                id: Toasts.genId(),
                message: "File too large. Maximum upload size is " + settings.store.maxUploadSize + " MB.",
                type: Toasts.Type.FAILURE,
                options: {
                    position: Toasts.Position.BOTTOM,
                },
            });
            return;
        }

        try {
            const channelId = SelectedChannelStore.getChannelId();
            const fileUrl = await sendFileToServer(file); // Use the sendFileToServer function
            insertTextIntoChatInputBox(fileUrl); // Insert the file URL into the message box
        } catch (error: any) {
            showNotification({ title: "File Upload Failed", body: "There was an error uploading your file \n" + error.message });
            alert(`File upload failed: ${error.message}`);
        }
    };

    return (
        <ChatBarButton
            aria-haspopup="dialog"
            tooltip="Upload File"
            onClick={() => {
                const input = document.createElement("input");
                input.type = "file";
                input.onchange = event => handleFileUpload(event as unknown as React.ChangeEvent<HTMLInputElement>);
                input.click();
            }}
        >
            <svg
                aria-hidden="true"
                role="img"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                style={{ scale: "1.2" }}
            >
                <path
                    fill="currentColor"
                    d="M19 3h-4.18C14.4 1.84 13.3 1 12 1s-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1-1-.45-1 1-1zm0 16-4-4h2.5v-4h3v4H16l-4 4z"
                />
            </svg>
        </ChatBarButton>
    );
};

export default definePlugin({
    name: "FileUploader",
    description: "Adds a file upload button to the message box.",
    authors: [Devs.Svenns],
    settings,
    start() {
        addChatBarButton("FileUploader", FileUploadButton);
    },
    stop() {
        removeChatBarButton("FileUploader");
    },
});
