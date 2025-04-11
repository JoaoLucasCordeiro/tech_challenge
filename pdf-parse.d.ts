// pdf-parse.d.ts
declare module "pdf-parse" {
    interface PDFData {
      numpages: number;
      numrender: number;
      info: any;
      metadata: any;
      version: any;
      text: string;
    }
  
    function pdf(dataBuffer: Buffer): Promise<PDFData>;
  
    export = pdf;
  }
  