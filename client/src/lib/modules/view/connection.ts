import { Container, Graphics, ObservablePoint } from 'pixi.js';
import Tile from './node';
import { Controller } from './controller';

class Connection {
  stage: Container;

  parentPositions: ObservablePoint[];
  childPositions: ObservablePoint[];

  parentPath: Graphics | null = null;
  path: Graphics[] = [];

  constructor(
    stage: Container,
    childPositions: ObservablePoint[],
    parentPositions: ObservablePoint[],
  ) {
    this.stage = stage;
    this.parentPositions = parentPositions;
    this.childPositions = childPositions;

    this.createParentConnection = this.createParentConnection.bind(this);
    this.createChildConnections = this.createChildConnections.bind(this);
  }

  createParentConnection() {
    if (!this.parentPositions[1]) {
      return;
    }

    const [parentA, parentB] = this.parentPositions;

    const path = new Graphics()
      .stroke({ color: 0x000, width: 2 })
      .moveTo(parentA.x + Tile.WIDTH, parentA.y + Tile.HEIGHT / 2)
      .lineTo(parentB.x, parentB.y + Tile.HEIGHT / 2);

    this.parentPath = path;
  }

  // TODO this is terrible
  createChildConnections() {
    const isSingleChild = this.childPositions.length === 1;

    if (!isSingleChild) {
      const parentPositionA = this.parentPositions[0];
      const parentPositionB =
        this.parentPositions[1] ?? this.parentPositions[0];

      const pathA = new Graphics()
        .moveTo(
          parentPositionA.x + Tile.WIDTH,
          parentPositionA.y + Tile.HEIGHT / 2,
        )
        .lineTo(parentPositionB.x, parentPositionB.y + Tile.HEIGHT / 2)
        .stroke({ color: 0x000, width: 2 });

      this.path.push(pathA);
    }

    let posX = this.parentPositions[0].x + Tile.WIDTH / 2;
    const startPosY = this.parentPositions[0].y + Tile.HEIGHT / 2;
    let endPosY =
      this.parentPositions[0].y + Tile.HEIGHT + Controller.TILE_GAP_Y / 2;

    if (this.parentPositions[1]) {
      posX = this.parentPositions[0].x + Tile.WIDTH + Controller.TILE_GAP_X / 2;
    }

    if (isSingleChild) {
      endPosY = this.parentPositions[0].y + Tile.HEIGHT + Controller.TILE_GAP_Y;
    }

    const pathB = new Graphics()
      .moveTo(posX, startPosY)
      .lineTo(posX, endPosY)
      .stroke({ color: 0x000, width: 2 });

    this.path.push(pathB);

    if (isSingleChild) {
      return;
    }

    const pathC = new Graphics()
      .moveTo(this.childPositions[0].x + Tile.WIDTH / 2, endPosY)
      .lineTo(this.childPositions.at(-1)!.x + Tile.WIDTH / 2, endPosY)
      .stroke({ color: 0x000, width: 2 });

    this.path.push(pathC);
  }

  render() {
    this.createParentConnection();
    this.createChildConnections();

    this.parentPath && this.stage.addChild(this.parentPath);
    this.stage.addChild(...this.path);
  }
}

export default Connection;
