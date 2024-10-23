import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeRaw from 'rehype-raw';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

interface MarkdownRendererProps {
    markdownText: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ markdownText }) => {
    return (
        <div className="markdown-body">
            <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[rehypeRaw, rehypeKatex]}
            >
                {markdownText}
            </ReactMarkdown>
        </div>
    );
};

export default MarkdownRenderer;