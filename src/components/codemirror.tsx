import { useRef, useEffect, useMemo } from "react";
import { EditorState } from "@codemirror/state";
import { EditorView, keymap, lineNumbers, ViewUpdate } from "@codemirror/view";
import { espresso, cobalt, dracula } from "thememirror";
import {
  defaultKeymap,
  history,
  indentWithTab,
  redo,
  undo,
} from "@codemirror/commands";
import { bracketMatching } from "@codemirror/language";
import { html } from "@codemirror/lang-html";
import { EditorTheme } from "@/types";

interface Props {
  code: string;
  editorTheme: EditorTheme;
  onCodeChange: (code: string) => void;
  editable?: boolean;
}

function CodeMirror({ code, editorTheme, onCodeChange, editable = true }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const view = useRef<EditorView | null>(null);
  const theme = editorTheme === EditorTheme.ESPRESSO ? espresso : EditorTheme.DRACULA ? dracula : cobalt;
  const editorState = useMemo(
    () =>
      EditorState.create({
        extensions: [
          history(),
          keymap.of([
            ...defaultKeymap,
            indentWithTab,
            { key: "Mod-z", run: undo, preventDefault: true },
            { key: "Mod-Shift-z", run: redo, preventDefault: true },
          ]),
          lineNumbers(),
          bracketMatching(),
          html(),
          theme,
          EditorView.lineWrapping,
          EditorView.updateListener.of((update: ViewUpdate) => {
            if (update.docChanged) {
              const updatedCode = update.state.doc.toString();
              onCodeChange(updatedCode);
            }
          }),
          EditorView.editable.of(editable),
        ],
      }),
    [editorTheme]
  );
  useEffect(() => {
    view.current = new EditorView({
      state: editorState,
      parent: ref.current as Element,
    });

    return () => {
      if (view.current) {
        view.current.destroy();
        view.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (view.current && view.current.state.doc.toString() !== code) {
      view.current.dispatch({
        changes: { from: 0, to: view.current.state.doc.length, insert: code },
      });
    }
  }, [code]);

  return (
    <div
      className="border border-gray-700 overflow-hidden rounded-md h-full"
      ref={ref}
    />
  );
}

export default CodeMirror;
