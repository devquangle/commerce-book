import React from "react";
import { EditorContent } from "@tiptap/react";
import type { Editor } from "@tiptap/react";

type Props = {
  editor: Editor;
};

const ProductDescriptionView = ({ editor }: Props) => {
  return (
    <EditorContent
      editor={editor}
      className="
        tiptap min-h-[250px] p-2
        [&_.ProseMirror]:min-h-[250px]
        [&_.ProseMirror]:outline-none
        
        [&_.ProseMirror_h1]:text-3xl
        [&_.ProseMirror_h1]:font-bold
        [&_.ProseMirror_h1]:leading-tight
        [&_.ProseMirror_h1]:mt-6
        [&_.ProseMirror_h1]:mb-3
        
        [&_.ProseMirror_h2]:text-2xl
        [&_.ProseMirror_h2]:font-bold
        [&_.ProseMirror_h2]:leading-tight
        [&_.ProseMirror_h2]:mt-6
        [&_.ProseMirror_h2]:mb-3
        
        [&_.ProseMirror_h3]:text-xl
        [&_.ProseMirror_h3]:font-semibold
        [&_.ProseMirror_h3]:mt-4
        [&_.ProseMirror_h3]:mb-2
        
        [&_.ProseMirror_h4]:text-lg
        [&_.ProseMirror_h4]:font-semibold
        [&_.ProseMirror_h4]:mt-4
        [&_.ProseMirror_h4]:mb-2
        
        [&_.ProseMirror_h5]:text-base
        [&_.ProseMirror_h5]:font-semibold
        [&_.ProseMirror_h5]:mt-4
        [&_.ProseMirror_h5]:mb-2
        
        [&_.ProseMirror_h6]:text-sm
        [&_.ProseMirror_h6]:font-semibold
        [&_.ProseMirror_h6]:mt-4
        [&_.ProseMirror_h6]:mb-2
        
        [&_.ProseMirror_p]:mb-3
        [&_.ProseMirror_p]:leading-relaxed
        
        [&_.ProseMirror_ul]:list-disc
        [&_.ProseMirror_ul]:pl-5
        [&_.ProseMirror_ul]:mb-3
        
        [&_.ProseMirror_ol]:list-decimal
        [&_.ProseMirror_ol]:pl-5
        [&_.ProseMirror_ol]:mb-3
        
        [&_.ProseMirror_img]:block
        [&_.ProseMirror_img]:mx-auto
        [&_.ProseMirror_img]:max-w-full
        [&_.ProseMirror_img]:h-auto
        [&_.ProseMirror_img]:rounded-md
        [&_.ProseMirror_img]:my-4
        
        [&_.ProseMirror_table]:w-full
        [&_.ProseMirror_table]:border-collapse
        [&_.ProseMirror_table]:my-5
        [&_.ProseMirror_td]:border
        [&_.ProseMirror_td]:border-slate-200
        [&_.ProseMirror_th]:border
        [&_.ProseMirror_th]:border-slate-200
        [&_.ProseMirror_td]:p-2.5
        [&_.ProseMirror_th]:p-2.5
      "
    />
  );
};

export default ProductDescriptionView;
