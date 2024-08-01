import {
  BitmapText,
  Container,
  Graphics,
  Text,
  type ContainerChild,
  type FillInput,
} from 'pixi.js';
import Controller from './controller';
import type DataNode from '../data/node';

export default class Tile extends Graphics {
  private stage: Container;
  dataNode: DataNode;
  private displayText: string;

  private readonly DEFAULT_COLOR: FillInput = 0x666666;
  private readonly HOVER_COLOR: FillInput = 0x999999;
  private readonly CLICKED_COLOR: FillInput = 0x333333;

  static readonly WIDTH: number = 200;
  static readonly HEIGHT: number = 100;

  // TODO move offset to parent container
  private xOffset: number;
  private yOffset: number;

  connectedTo: Set<Tile> = new Set();

  constructor(
    stage: Container,
    dataNode: DataNode,
    xOffset: number,
    yOffset: number,
  ) {
    super({
      eventMode: 'dynamic',
    });
    this.stage = stage;
    this.dataNode = dataNode;
    this.displayText = dataNode.id.toString();

    this.renderText = this.renderText.bind(this);
    this.setFill = this.setFill.bind(this);
    this.setRect = this.setRect.bind(this);
    this.render = this.render.bind(this);

    this.xOffset = xOffset;
    this.yOffset = yOffset;

    this.createEventListeners();
    this.setRect();
    this.setFill(this.DEFAULT_COLOR);
  }

  setFill(fill: FillInput): void {
    this.setRect();
    this.fill(fill);
  }

  setRect(): void {
    this.context.clear();

    this.rect(0, 0, Tile.WIDTH, Tile.HEIGHT).stroke({
      color: 0x000,
      width: 2,
      alignment: 0,
    });

    this.position.set(400 + this.xOffset, 150 + this.yOffset);
  }

  renderText(): void {
    const text = new BitmapText({
      text: this.displayText,
      style: {
        fill: 0xffffff,
        fontFamily: 'Arial',
        fontSize: 24,
      },
    });

    text.position.set(
      400 + this.xOffset + (Tile.WIDTH - text.width) / 2,
      150 + this.yOffset + (Tile.HEIGHT - text.height) / 2,
    );

    this.stage.addChild(text);
  }

  private createEventListeners(): void {
    const handler = Controller.getOnClickHandler();

    this.on('pointerdown', () => {
      if (handler) {
        this.setFill(this.CLICKED_COLOR);
        handler(this);
      }
    });

    this.on('pointerup', () => {
      this.setFill(this.HOVER_COLOR);
    });

    this.on('pointerenter', () => {
      this.setFill(this.HOVER_COLOR);
    });

    this.on('pointerleave', () => {
      this.setFill(this.DEFAULT_COLOR);
    });
  }

  render(): void {
    this.stage.addChild(this);
    this.renderText();
  }
}
