"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { incrementDownloadCount } from "@/lib/actions";

interface DownloadButtonProps {
    appId: string;
    downloadUrl: string;
    size: string;
}

export function DownloadButton({ appId, downloadUrl, size }: DownloadButtonProps) {
    const [isDownloading, setIsDownloading] = useState(false);

    const handleDownload = async () => {
        setIsDownloading(true);
        try {
            await incrementDownloadCount(appId);
            // Trigger actual download
            const link = document.createElement("a");
            link.href = downloadUrl;
            link.download = "";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Download failed:", error);
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <Button
            size="lg"
            onClick={handleDownload}
            disabled={isDownloading}
            className="rounded-2xl h-16 px-12 gap-3 bg-primary text-white hover:scale-105 transition-all shadow-xl shadow-primary/20 w-full sm:w-auto text-xl font-bold"
        >
            <Download className="h-6 w-6" />
            {isDownloading ? "Starting..." : "Get Now"}
            <span className="text-sm opacity-60 font-semibold">({size})</span>
        </Button>
    );
}
