import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { InlineMath, BlockMath } from 'react-katex';

interface MarkdownRendererProps {
    markdownText: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ markdownText }) => {
    // Función para renderizar matemáticas
    const renderers = {
        inlineMath: ({ value }: { value: string }) => <InlineMath math={value} />,
        blockMath: ({ value }: { value: string }) => <BlockMath math={value} />
    };

    return (
        <div className="markdown-body">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={renderers}
            >
                {markdownText}
            </ReactMarkdown>
        </div>
    );
};

export default MarkdownRenderer;
