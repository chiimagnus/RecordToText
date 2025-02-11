declare module "@logseq/libs" {
  interface IAppProxy {
    showMsg: (content: string, type?: "success" | "warning" | "error") => void;
  }
} 