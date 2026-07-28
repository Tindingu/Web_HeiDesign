export interface PdfFlipbookProps {
  file: string;
  title?: string;
  downloadFileName?: string;
}

export interface FlipEvent {
  data: number;
}

export type FlipOrientation = "portrait" | "landscape";

export interface PageFlipApi {
  flipNext(): void;
  flipPrev(): void;
  turnToPage(page: number): void;
  getCurrentPageIndex(): number;
}

export interface FlipBookRef {
  pageFlip(): PageFlipApi;
}

export interface PdfViewport {
  width: number;
  height: number;
}

export interface RenderTask {
  promise: Promise<void>;
  cancel(): void;
}

export interface PdfPageProxy {
  getViewport(options: { scale: number }): PdfViewport;
  render(options: {
    canvasContext: CanvasRenderingContext2D;
    viewport: PdfViewport;
  }): RenderTask;
}

export interface PdfDocumentProxy {
  numPages: number;
  getPage(pageNumber: number): Promise<PdfPageProxy>;
  destroy?(): Promise<void>;
}

export interface PdfJsModule {
  GlobalWorkerOptions: {
    workerSrc: string;
  };
  getDocument(options: {
    url: string;
    useWorkerFetch?: boolean;
    isEvalSupported?: boolean;
  }): PdfLoadingTask;
}

export interface PdfLoadingTask {
  promise: Promise<PdfDocumentProxy>;
  destroy?(): void;
}
