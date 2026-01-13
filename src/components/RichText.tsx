"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface RichTextProps {
    content: string;
    className?: string;
}

/**
 * Basic BBCode to Markdown converter
 */
function parseBBCode(text: string): string {
    if (!text) return "";

    let decoded = text;

    // Bold, Italic, Strikethrough
    decoded = decoded.replace(/\[b\](.*?)\[\/b\]/gi, "**$1**");
    decoded = decoded.replace(/\[i\](.*?)\[\/i\]/gi, "*$1*");
    decoded = decoded.replace(/\[s\](.*?)\[\/s\]/gi, "~~$1~~");

    // URL: [url]link[/url] -> [link](link)
    decoded = decoded.replace(/\[url\](.*?)\[\/url\]/gi, "[$1]($1)");

    // URL: [url=link]text[/url] -> [text](link)
    decoded = decoded.replace(/\[url=(.*?)\](.*?)\[\/url\]/gi, "[$2]($1)");

    // List: [list][*]item1[*]item2[/list]
    // First, handle the [*] items
    decoded = decoded.replace(/\[\*\]/g, "\n- ");
    // Then remove the [list] and [/list] containers
    decoded = decoded.replace(/\[list\]/gi, "");
    decoded = decoded.replace(/\[\/list\]/gi, "\n");

    return decoded;
}

export function RichText({ content, className }: RichTextProps) {
    const markdownContent = parseBBCode(content);

    return (
        <div className={`prose dark:prose-invert max-w-none ${className || ""}`}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {markdownContent}
            </ReactMarkdown>
        </div>
    );
}
