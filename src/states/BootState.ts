import Phaser from 'phaser-ce';
import GameConfig from '../constants/GameConfig';
import { GAME_STATE } from '../constants/Constants';

export default class BootState extends Phaser.State {
  init(args) {
    super.init(args);
    this.stage.backgroundColor = GameConfig.backgroundColor;
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
    this.game.renderer.renderSession.roundPixels = true;
  }

  public preload(game: Phaser.Game): void {
    super.preload(game);
    this.game.load.image('mushroom', 'assets/mushroom.png');
  }

  public create(game: Phaser.Game): void {
    super.create(game);
    this.game.state.start(GAME_STATE);
  }
}
