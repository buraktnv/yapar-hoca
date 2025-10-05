"use client";

import { useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import type { Editor as TinyMCEEditor } from "tinymce";

const TinyEditor = dynamic(
  async () => (await import("@tinymce/tinymce-react")).Editor,
  { ssr: false }
);

export default function MyEditor() {
  const editorRef = useRef<TinyMCEEditor | null>(null);

  const onInit = useCallback((_evt: any, editor: TinyMCEEditor) => {
    editorRef.current = editor;
  }, []);

  const log = useCallback(() => {
    if (editorRef.current) {
      console.log(editorRef.current.getContent());
    }
  }, []);

  return (
    <div className="mt-24" suppressHydrationWarning>
      <TinyEditor
        tinymceScriptSrc="/tinymce/tinymce.min.js"
        licenseKey="gpl"
        onInit={onInit}
        initialValue="<p>This is the initial content of the editor.</p>"
        init={{
          promotion: false,
          height: 500,
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
          skin: true ? 'oxide-dark' : 'oxide',
          content_css: true ? 'dark' : 'default',
          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:16px }'
        }}
      />
      <button onClick={log}>Save</button>
    </div>
  );
}
