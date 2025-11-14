"use client";

import { useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import type { Editor as TinyMCEEditor } from "tinymce";

const TinyEditor = dynamic(
  async () => (await import("@tinymce/tinymce-react")).Editor,
  { ssr: false }
);

interface MyEditorProps {
  value?: string;
  onChange?: (content: string) => void;
  onImageUpload?: (file: File) => Promise<string>;
  height?: number;
}

export default function MyEditor({
  value = "",
  onChange,
  onImageUpload,
  height = 500
}: MyEditorProps) {
  const editorRef = useRef<TinyMCEEditor | null>(null);

  const onInit = useCallback((_evt: any, editor: TinyMCEEditor) => {
    editorRef.current = editor;
  }, []);

  const handleEditorChange = useCallback((content: string) => {
    onChange?.(content);
  }, [onChange]);

  // Custom image upload handler for Supabase Storage
  const handleImageUpload = useCallback(async (blobInfo: any) => {
    if (!onImageUpload) {
      throw new Error('Image upload handler not provided');
    }

    const file = blobInfo.blob() as File;
    const url = await onImageUpload(file);
    return url;
  }, [onImageUpload]);

  return (
    <div suppressHydrationWarning>
      <TinyEditor
        tinymceScriptSrc="/tinymce/tinymce.min.js"
        licenseKey="gpl"
        onInit={onInit}
        value={value}
        onEditorChange={handleEditorChange}
        init={{
          promotion: false,
          height,
          plugins: 'preview importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media codesample table charmap pagebreak nonbreaking anchor insertdatetime advlist lists wordcount help charmap quickbars emoticons accordion',
          editimage_cors_hosts: ['picsum.photos'],
          menubar: 'file edit view insert format tools table help',
          toolbar: "undo redo | accordion accordionremove | blocks fontfamily fontsize | bold italic underline strikethrough | align numlist bullist | link image | table media | lineheight outdent indent| forecolor backcolor removeformat | charmap emoticons | code fullscreen preview | save print | pagebreak anchor codesample | ltr rtl",
          autosave_ask_before_unload: true,
          autosave_interval: '30s',
          autosave_prefix: '{path}{query}-{id}-',
          autosave_restore_when_empty: false,
          autosave_retention: '2m',
          image_advtab: true,
          importcss_append: true,
          image_caption: true,
          quickbars_selection_toolbar: 'bold italic | quicklink h2 h3 blockquote quickimage quicktable',
          noneditable_class: 'mceNonEditable',
          toolbar_mode: 'sliding',
          contextmenu: 'link image table',
          // Light theme
          skin: 'oxide',
          content_css: 'default',
          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:16px }',
          // Custom image upload handler
          images_upload_handler: onImageUpload ? handleImageUpload : undefined,
          automatic_uploads: true,
          file_picker_types: 'image',
        }}
      />
    </div>
  );
}
