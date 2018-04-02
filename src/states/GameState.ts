import Phaser from 'phaser-ce';

export default class GameState extends Phaser.State {
  private mushroom!: Phaser.Sprite;

  public create(): void {
    this.mushroom = this.game.add.sprite(
      this.world.centerX,
      this.world.centerY,
      'mushroom',
    );
    this.mushroom.anchor.setTo(0.5);
  }

  public update(): void {
    this.mushroom.angle++;
  }

  public render(): void {
    if (process.env.NODE_ENV === 'development') {
      this.game.debug.spriteInfo(this.mushroom, 32, 32);
    }
  }
}
