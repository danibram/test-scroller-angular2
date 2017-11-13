import { Component, OnInit, Input } from '@angular/core'
import { setTimeout } from 'timers';

declare let jquery:any;
declare let $ :any;

/**
   * We're loading this component asynchronously
   * We are using some magic with es6-promise-loader that will wrap the module with a Promise
   * see https://github.com/gdi2290/es6-promise-loader for more info
   */

console.log('`Detail` component loaded asynchronously')

@Component({
    selector: 'scroller',
    template: `
        <div>
            <div>{{value}}</div>
            <div id="scroller{{id}}"></div>
        </div>
    `
})
export class ScrollerComponent implements OnInit {

    private scroller: any
    public id: string
    public value: number


    @Input() public data: string[]

    constructor() {
        this.id = '_' + Math.random().toString(36).substr(2, 9)
    }

    public ngOnInit() {
        setTimeout(()=>{
            this.scroller = new (<any> window).ScrollBuilder(`#scroller${this.id}`, {
                data: this.data,
                sideCount: 2,
                snappedComplete: (index, elem) => {
                    let value = Number($(elem).html())
                    this.value = value
                }
            })
        }, 0)
    }
}
