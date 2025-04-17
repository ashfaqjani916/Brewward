declare module '*.glb' {
  const content: string;
  export default content;
}

declare module '*.png' {
  import { StaticImageData } from 'next/image';
  const content: StaticImageData;
  export default content;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      meshLineGeometry: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      meshLineMaterial: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
        color?: string;
        depthTest?: boolean;
        resolution?: [number, number];
        useMap?: boolean;
        map?: any;
        repeat?: [number, number];
        lineWidth?: number;
      }, HTMLElement>;
    }
  }
} 
