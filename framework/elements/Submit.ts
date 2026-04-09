import { Button } from './Button';

export class Submit extends Button {
  constructor(content: string) {
    super(content);
    this.attr('type', 'submit');
  }
}
