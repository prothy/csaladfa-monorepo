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

  createChildConnections() {
    const isSingleChild = this.childPositions.length === 1;

    let posX = this.parentPositions[0].x + Tile.WIDTH / 2;
    let endPosY =
      this.parentPositions[0].y + Tile.HEIGHT + Controller.TILE_GAP_Y / 2;

    if (this.parentPositions[1]) {
      posX = this.parentPositions[0].x + Tile.WIDTH + Controller.TILE_GAP_X / 2;
    }

    if (isSingleChild) {
      endPosY = this.childPositions[0].y + Tile.HEIGHT / 2;
    }

    const pathA = new Graphics()
      .stroke({ color: 0x000, width: 2 })
      .moveTo(posX, this.parentPositions[0].y + Tile.HEIGHT / 2)
      .lineTo(posX, endPosY);

    this.path.push(pathA);

    if (isSingleChild) {
      return;
    }

    const pathB = new Graphics()
      .stroke({ color: 0x000, width: 10 })
      .moveTo(this.childPositions[0].x + Tile.WIDTH / 2, endPosY)
      .lineTo(this.childPositions.at(-1)!.x + Tile.WIDTH / 2, endPosY);

    this.path.push(pathB);
  }

  render() {
    this.createParentConnection();
    this.createChildConnections();

    this.parentPath && this.stage.addChild(this.parentPath);
    this.stage.addChild(...this.path);
  }
}

export default Connection;
