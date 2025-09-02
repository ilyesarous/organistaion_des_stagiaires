import { Editor as Draft } from "@tinymce/tinymce-react";
import "./Editor.css";
import type { FunctionComponent } from "react";

type Props = {
  height?: number;
  initialValue?: string;
  onChange: (val: string) => void;
};

const PLUGINS = ["lists", "image", "link", "table"];
const TOOLBAR =
  "fontfamily fontsize | undo redo | bullist numlist | indent outdent | image link | table | bold italic";

const FONT_FORMATS =
  "Andale Mono=andale mono,times; Arial=arial,helvetica,sans-serif; Arial Black=arial black,avant garde; Book Antiqua=book antiqua,palatino; Comic Sans MS=comic sans ms,sans-serif; Courier New=courier new,courier; Georgia=georgia,palatino; Helvetica=helvetica; Impact=impact,chicago; Symbol=symbol; Tahoma=tahoma,arial,helvetica,sans-serif; Terminal=terminal,monaco; Times New Roman=times new roman,times; Trebuchet MS=trebuchet ms,geneva; Verdana=verdana,geneva; Webdings=webdings; Wingdings=wingdings,zapf dingbats";

const Editor: FunctionComponent<Props> = ({
  height = 450,
  initialValue = "",
  onChange,
}) => {
  return (
    <Draft
      tinymceScriptSrc="https://cdn.tiny.cloud/1/8xmeyqie1ey8hhr9vxhn4uma9tmm7vwk2ru7cy3jo914rk2m/tinymce/6/tinymce.min.js"
      value={initialValue}
      onEditorChange={onChange}
      init={{
        height,
        menubar: false,
        statusbar: false,
        resize: false,
        plugins: PLUGINS,
        toolbar: TOOLBAR,
        content_css:"https://cdnjs.cloudflare.com/ajax/libs/tinymce/6.7.1/skins/ui/oxide/content.min.css",

        font_formats: FONT_FORMATS,
      }}
    />
  );
};

export default Editor;
