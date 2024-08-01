import {
  Application,
  Container,
  FederatedPointerEvent,
  Graphics,
} from 'pixi.js';
import Tile from './node';
import { clamp } from '$lib/utils';
import { buildGraph } from '../parser';
import Connection from './connection';
import Graph from '../data/graph';
import type { FamilyId } from '$lib/types';

export class Controller {
  private app: Application;
  nodes: Map<string, Tile>;

  private readonly TRANSFORM_SPEED: number = 1.5;
  private readonly SCALE_SPEED: number = 0.005;
  private readonly MAX_SCALE: number = 2;
  private readonly MIN_SCALE: number = 0.5;

  static readonly TILE_GAP_X: number = 50;
  static readonly TILE_GAP_Y: number = 80;

  private transform: { x: number; y: number } = { x: 0, y: 0 };
  private scale: number = 1;
  private onClickHandler: ((event: Tile) => void) | undefined;

  constructor() {
    this.app = new Application();
    this.nodes = new Map();

    this.handleScroll = this.handleScroll.bind(this);
    this.handleDrag = this.handleDrag.bind(this);
    this.handlePointerDown = this.handlePointerDown.bind(this);
    this.generateNodes = this.generateNodes.bind(this);
    this.renderConnections = this.renderConnections.bind(this);
  }

  async init(
    container: HTMLDivElement,
    onClickHandler: (event: Tile) => void,
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

    this.generateNodes(graph);
    this.renderConnections(graph);

    this.nodes.forEach((tile) => {
      tile.render();
    });
  }

  generateNodes(graph: Graph) {
    const generations = graph.mapNodesByGeneration();
    const largestGen = graph.getLargestGeneration();

    const largestGenWidth =
      largestGen.length * Tile.WIDTH +
      (largestGen.length - 1) * Controller.TILE_GAP_X;

    generations.forEach((nodes, gen) => {
      const genWidth =
        nodes.length * Tile.WIDTH + (nodes.length - 1) * Controller.TILE_GAP_X;
      const genX = (largestGenWidth - genWidth) / 2;

      nodes.forEach((node, i) => {
        const x = genX + i * (Tile.WIDTH + Controller.TILE_GAP_X);
        const y = gen * (Tile.HEIGHT + Controller.TILE_GAP_Y);

        const tile = new Tile(this.app.stage, node, x, y);

        this.nodes.set(node.id, tile);
      });
    });
  }

  renderConnections(graph: Graph): void {
    graph.mapHouseholds();

    graph.families.forEach((children, familyId) => {
      const parents = familyId.split('_');

      if (!(parents.length && children.size)) {
        return;
      }

      const parentPositions = Array.from(parents).map(
        (id) => this.nodes.get(id)!.position,
      );
      const childPositions = Array.from(children).map(
        (node) => this.nodes.get(node.id)!.position,
      );

      const connection = new Connection(
        this.app.stage,
        childPositions,
        parentPositions,
      );

      connection.render();
    });
  }

  async destroy(): Promise<void> {
    this.destroyEventListeners();
    this.app.destroy(true);
  }

  getOnClickHandler(): ((event: Tile) => void) | undefined {
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
