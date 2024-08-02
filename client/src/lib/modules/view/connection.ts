import { Container, Graphics, ObservablePoint } from 'pixi.js';
import Tile from './node';
import { Controller } from './controller';
import type DataNode from '../data/node';

class Connection {
  stage: Container;

  parents: Tile[];
  children: Tile[];

  parentPath: Graphics | null = null;
  path: Graphics[] = [];

  constructor(stage: Container, children: Tile[], parents: Tile[]) {
    this.stage = stage;

    this.parents = parents;
    this.children = children;

    this.createParentConnection = this.createParentConnection.bind(this);
    this.createChildConnections = this.createChildConnections.bind(this);
  }

  createParentConnection() {
    if (!this.parents[1]) {
      return;
    }

    const [parentA, parentB] = this.parents;

    const path = new Graphics()
      .stroke({ color: 0x000, width: 2 })
      .moveTo(parentA.x + Tile.WIDTH, parentA.y + Tile.HEIGHT / 2)
      .lineTo(parentB.x, parentB.y + Tile.HEIGHT / 2);

    this.parentPath = path;
  }

  // TODO this is terrible
  createChildConnections() {
    const isSingleChild = this.children.length === 1;

    if (!isSingleChild) {
      const parentPositionA = this.parents[0].position;
      const parentPositionB = (this.parents[1] ?? this.parents[0]).position;

      const pathA = new Graphics()
        .moveTo(
          parentPositionA.x + Tile.WIDTH,
          parentPositionA.y + Tile.HEIGHT / 2,
        )
        .lineTo(parentPositionB.x, parentPositionB.y + Tile.HEIGHT / 2)
        .stroke({ color: 0x000, width: 2 });

      this.path.push(pathA);
    }

    let posX = this.parents[0].x + Tile.WIDTH / 2;
    const startPosY = this.parents[0].y + Tile.HEIGHT / 2;
    let endPosY = this.parents[0].y + Tile.HEIGHT + Controller.TILE_GAP_Y / 2;

    if (this.parents[1]) {
      posX = this.parents[0].x + Tile.WIDTH + Controller.TILE_GAP_X / 2;
    }

    if (isSingleChild) {
      endPosY = this.parents[0].y + Tile.HEIGHT + Controller.TILE_GAP_Y;
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
      .moveTo(this.children[0].x + Tile.WIDTH / 2, endPosY)
      .lineTo(this.children.at(-1)!.x + Tile.WIDTH / 2, endPosY)
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
