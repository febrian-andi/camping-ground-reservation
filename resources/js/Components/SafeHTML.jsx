import DOMPurify from "dompurify";

export default function SafeHTML({ html, className }) {
    const cleanHTML = DOMPurify.sanitize(html);

    return (
        <div
            className={className}
            dangerouslySetInnerHTML={{ __html: cleanHTML }}
        />
    );
}
