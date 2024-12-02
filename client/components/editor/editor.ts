import { EditorState } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { Schema, DOMParser, DOMSerializer } from "prosemirror-model";
import { defaultKeymap } from "./keymap";

type EditorProps = {
  container: HTMLDivElement;
  schema: Schema;
  html?: string | HTMLDivElement;
};

export class Editor {
  editorView: EditorView;

  constructor({ schema, html, container }: EditorProps) {
    const contentElement = document.createElement("div");

    if (typeof html == "string") {
      contentElement.innerHTML = html;
    } else if (html instanceof HTMLElement) {
      contentElement.appendChild(html);
    }

    const state = EditorState.create({
      doc: DOMParser.fromSchema(schema).parse(contentElement),
    });

    this.editorView = new EditorView(container, {
      state,
      plugins: [defaultKeymap],
      dispatchTransaction: (transaction) => {
        const newState = this.editorView.state.apply(transaction);
        this.editorView.updateState(newState);
      },
    });
  }

  setHeading(, { level: 6 })
  
  commands() {

  }

  getText() {
    return this.editorView.state.doc.textContent;
  }
  getJSON() {
    return this.editorView.state.doc.toJSON();
  }
  getHTML() {
    const serializer = DOMSerializer.fromSchema(this.editorView.state.schema);
    const fragment = serializer.serializeFragment(
      this.editorView.state.doc.content
    );
    const temporaryDiv = document.createElement("div");
    temporaryDiv.appendChild(fragment);
    return temporaryDiv.innerHTML;
  }
}
