import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownRendererProps {
    markdownText: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({markdownText}) => {
    return (
        <div className="markdown-body">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdownText}</ReactMarkdown>
        </div>
    );
};

export default MarkdownRenderer;
