// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

declare module 'd3-dtree' {
  interface Person {
    name: string;
  }

  interface Marriage {
    spouse?: Person;
    children?: Person[];
  }

  interface DataObject {
    name: string;
    class?: string;
    textClass?: string;
    depthOffset: number;
    marriages?: Marriage[];
    extra?: Record<string, any>;
  }

  interface Options {
    target: string;
    debug: boolean;
    width: number;
    height: number;
    hideMarriageNodes: boolean;
    marriageNodeSize: number;
    callbacks: {
      /*
          Callbacks should only be overwritten on a need to basis.
          See the section about callbacks below.
        */
    };
    margin: {
      top: number;
      right: number;
      bottom: number;
      left: number;
    };
    nodeWidth: number;
    styles: {
      node: string;
      linage: string;
      marriage: string;
      text: string;
    };
  }

  const init: (data: DataObject[], options?: Options) => void;
}


declare namespace App {
  interface PageState {
    data: Record<string, unknown>;
  }
}