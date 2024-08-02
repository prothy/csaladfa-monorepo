// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

declare module 'd3-dtree' {
  interface Person {
    name: string;
  }
  interface Marriages {
    spouse: Person;
    children: Person[];
  }
  interface DataObject {
    name: string;
    class: string;
    textClass: string;
    depthOffset: number;
    marriages: Marriages[];
    extra?: Record<string, any>;
  }

  interface Options {
    target: 'string';
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

  var init: (data: DataObject[], options?: Options) => void;
}

