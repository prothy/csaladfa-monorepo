import {
  Application,
  Container,
  FederatedPointerEvent,
  Graphics,
} from 'pixi.js';
import GraphNode from './node';
import { clamp } from '$lib/utils';
import { buildGraph } from '../parser';

class Controller {
  private app: Application;

  private readonly TRANSFORM_SPEED: number = 1.5;
  private readonly SCALE_SPEED: number = 0.005;
  private readonly MAX_SCALE: number = 2;
  private readonly MIN_SCALE: number = 0.5;

  readonly TILE_WIDTH: number = 200;
  readonly TILE_HEIGHT: number = 100;
  readonly TILE_GAP: number = 20;

  private transform: { x: number; y: number } = { x: 0, y: 0 };
  private scale: number = 1;
  private onClickHandler: ((event: GraphNode) => void) | undefined;

  constructor() {
    this.app = new Application();

    this.handleScroll = this.handleScroll.bind(this);
    this.handleDrag = this.handleDrag.bind(this);
    this.handlePointerDown = this.handlePointerDown.bind(this);
  }

  async init(
    container: HTMLDivElement,
    onClickHandler: (event: GraphNode) => void,
  ): Promise<void> {
    await this.app.init({
      resizeTo: window,
      backgroundColor: 0xff0000,
      backgroundAlpha: 0,
    });
    this.app.stage.interactive = true;

    container.appendChild(this.app.canvas);

    this.onClickHandler = onClickHandler;
    this.createEventListeners();

    const graph = buildGraph();

    const generations = graph.mapNodesByGeneration();
    const largestGen = graph.getLargestGeneration();

    const largestGenWidth =
      largestGen.length * this.TILE_WIDTH +
      (largestGen.length - 1) * this.TILE_GAP;

    generations.forEach((nodes, gen) => {
      const genWidth =
        nodes.length * this.TILE_WIDTH + (nodes.length - 1) * this.TILE_GAP;
      const genX = (largestGenWidth - genWidth) / 2;

      nodes.forEach((node, i) => {
        const x = genX + i * (this.TILE_WIDTH + this.TILE_GAP);
        const y = gen * (this.TILE_HEIGHT + this.TILE_GAP);

        const tile = new GraphNode(this.app.stage, node, x, y);

        this.app.stage.addChild(tile);
      });
    });
  }

  async destroy(): Promise<void> {
    this.destroyEventListeners();
    this.app.destroy(true);
  }

  getOnClickHandler(): ((event: GraphNode) => void) | undefined {
    return this.onClickHandler;
  }

  private handleScroll(event: WheelEvent): void {
    event.preventDefault();

    const { clientX, clientY } = event;
    const {
      scale,
      SCALE_SPEED,
      MIN_SCALE,
      MAX_SCALE,
      app: { stage },
    } = this;

    this.scale = clamp(
      scale + event.deltaY * SCALE_SPEED,
      MIN_SCALE,
      MAX_SCALE,
    );
    stage.scale.set(this.scale, this.scale);
    stage.position.set(
      clientX - (clientX - this.transform.x) * this.scale,
      clientY - (clientY - this.transform.y) * this.scale,
    );
  }

  private handleDrag(event: MouseEvent): void {
    event.preventDefault();

    const { movementX, movementY } = event;
    const { x, y } = this.transform;

    this.transform = {
      x: x + movementX * this.TRANSFORM_SPEED,
      y: y + movementY * this.TRANSFORM_SPEED,
    };

    this.app.stage.position.set(this.transform.x, this.transform.y);
  }

  private handlePointerDown(): void {
    const {
      app: { canvas },
      handleDrag,
      onClickHandler,
    } = this;

    let dragging = false;

    const handlePointerMove = (mouseMoveEvent: PointerEvent) => {
      dragging = true;
      handleDrag(mouseMoveEvent);
    };

    canvas.addEventListener('pointermove', handlePointerMove);

    canvas.addEventListener('pointerup', function onPointerUp() {
      // if (!dragging) {
      //   onClickHandler(pointerDownEvent);
      // }

      canvas.removeEventListener('pointermove', handlePointerMove);
      canvas.removeEventListener('pointerup', onPointerUp);
    });
  }

  private createEventListeners(): void {
    const {
      handleScroll,
      handlePointerDown,
      app: { canvas, stage },
    } = this;

    canvas.addEventListener('wheel', handleScroll);
    stage.on('pointerdown', handlePointerDown);
  }

  private destroyEventListeners(): void {
    const {
      handleScroll,
      handlePointerDown,
      app: { canvas, stage },
    } = this;

    canvas.removeEventListener('wheel', handleScroll);
    stage.off('pointerdown', handlePointerDown);
  }
}

export default new Controller();
