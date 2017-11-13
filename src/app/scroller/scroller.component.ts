import {
  Component,
  OnInit
} from '@angular/core';

import { AppState } from '../app.service';
declare let jquery:any;
declare let $ :any;

@Component({
  /**
   * The selector is what angular internally uses
   * for `document.querySelectorAll(selector)` in our index.html
   * where, in this case, selector is the string 'home'.
   */
  selector: 'scroller-parent',  // <home></home>
  /**
   * We need to tell Angular's Dependency Injection which providers are in our app.
   */
  providers: [],
  /**
   * Our list of styles in our component. We may add more to compose many styles together.
   */
  styleUrls: [ './scroller.component.css' ],
  /**
   * Every Angular template is first compiled by the browser before Angular runs it's compiler.
   */
  templateUrl: './scroller.component.html'
})
export class ScrollerParentComponent implements OnInit {
  /**
   * Set our default values
   */
  public localState = { value: '' };
  /**
   * TypeScript public modifiers
   */
  constructor(
    public appState: AppState
  ) {}

  public ngOnInit() {
    console.log('hello `Father Scroller` component');
    /**
     * this.title.getData().subscribe(data => this.data = data);
     */
    let dataAmount = [];
    for (let i = 1; i < 11; i++) {
        dataAmount.push(1000 * i);
    }

    let dataMonthly = [];
    for (let i = 1; i < 200; i++) {
        dataMonthly.push(200 + i);
    }

    let scroller2 = new (<any>window).ScrollBuilder("#scroller2", {
        data: dataMonthly,
        sideCount: 2,
        snappedComplete: function (index, elem) {
            $("#monthly").html($(elem).html());
        }
    });

    let scroller1 = new (<any>window).ScrollBuilder("#scroller", {
        data: dataAmount,
        sideCount: 2,
        snappedComplete: function (index, elem) {
            let value = Number($(elem).html());
            let newData = [];
            for (let i = 0; i <= 10; i++) {
                newData.push(value + i);
            }
            scroller2.updateData(newData);
            scroller2.__scroller.scrollTo(0, 0);
            $("#amount").html(value);
        }
    });
  }

  public submitState(value: string) {
    console.log('submitState', value);
    this.appState.set('value', value);
    this.localState.value = '';
  }
}
