import React from "react";
import { DirectEditorProps, EditorView } from "prosemirror-view";
import { Schema } from "prosemirror-model";
import { EditorState } from "prosemirror-state";

type UseEditorProps = {
  schema: Schema;
  onchange?: (editor: EditorView) => void;
};
export const useEditor = ({ schema, onchange }: UseEditorProps) => {
  const mount = React.useRef<HTMLElement | null>(null);
  const [view, setView] = React.useState<EditorView | null>(null);
  const [_, setTriggerChange] = React.useState<number>(0);

  React.useEffect(() => {
    if (!mount.current) return;

    const newView = new EditorView(mount.current, {
      state: EditorState.create({ schema }),
      dispatchTransaction: (transaction) => {
        const newState = newView.state.apply(transaction);
        newView.updateState(newState);
        setTriggerChange((prev) => prev + 1);
        if (onchange) onchange(newView);
      },
    });
    setView(newView);

    return () => {
      newView.destroy();
      setView(null);
    };
  }, [mount.current, schema]);

  const handleSetMount = (node: HTMLElement | null) => {
    if (node !== mount.current) {
      mount.current = node;
      // Re-trigger effect when `mount` changes
      setView(null); // Ensure cleanup of old `EditorView`
    }
  };

  return { view, handleSetMount };
};

export const EditorContent = ({
  editor,
}: {
  editor: ReturnType<typeof useEditor>;
}) => {
  return (
    <div
      ref={editor?.handleSetMount}
      className="[&>div]:prose-base  p-2 [&>*]:outline-none [&>*]:whitespace-pre-wrap rounded border bg-white"
    />
  );
};

// interface IEditor {
//   handleMount: (element: (e: HTMLElement | null) => void) => void;
// }

// class Editor extends EditorView implements IEditor {
//   constructor(
//     place:
//       | null
//       | Node
//       | ((editor: HTMLElement) => void)
//       | {
//           mount: HTMLElement;
//         },
//     props: DirectEditorProps
//   ) {
//     super(place, props);
//   }

//   handleMount(element: (e: HTMLElement) => void) {}
// }
// type UseEditorProps = {
//   schema: Schema;
// };
// export const useEditor = ({ schema }: UseEditorProps) => {
//   const mount = React.useRef<HTMLElement | null>(null);
//   const [trigger, setTriggerChange] = React.useState<number>(0);
//   const [view, setView] = React.useState<EditorView | null>(null);

//   React.useEffect(() => {
//     if (!mount.current) return;

//     const newView = new EditorView(mount.current, {
//       state: EditorState.create({ schema }),
//       dispatchTransaction: (transaction) => {
//         const newState = newView.state.apply(transaction);
//         newView.updateState(newState);
//         setTriggerChange((prev) => prev + 1);
//       },
//     });

//     setView(newView);

//     return () => {
//       if (view) {
//         view.destroy();
//         setView(null);
//       }
//     };
//   }, [mount.current, trigger]);

//   const handleSetMount = (e: HTMLElement | null) => {
//     if (mount.current) return;
//     mount.current = e;
//   };

//   return view ? { ...view, handleSetMount } : null;
// };

// export const EditorContent = ({
//   editor,
// }: {
//   editor: ReturnType<typeof useEditor>;
// }) => {
//   return (
//     <div
//       ref={(e) => editor?.handleSetMount(e)}
//       className="[&>div]:prose-base  p-2 [&>*]:outline-none [&>*]:whitespace-pre-wrap rounded border bg-white"
//     />
//   );
// };
