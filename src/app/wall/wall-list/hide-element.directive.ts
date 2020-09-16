import { Directive, ElementRef } from '@angular/core';
import { interval, Observable, Subscription } from 'rxjs';

@Directive({
  selector: '[appHideElement]'
})
export class HideElementDirective {

  sub: Subscription;

  constructor(el: ElementRef) {

    this.sub = interval(200).subscribe((val) => {
      const textEl = el.nativeElement.children[0];
      const moreEl = el.nativeElement.children.length > 2 ? el.nativeElement.children[2] : el.nativeElement.children[1];

      if (textEl.offsetHeight === 0 || textEl.scrollHeight === 0 || !moreEl) return;

      if (textEl.offsetHeight < textEl.scrollHeight) {
        moreEl.style.display = 'unset';
      }

      if (textEl.offsetHeight > 0 && textEl.scrollHeight > 0) {
        this.sub.unsubscribe();
      }
    });
  }

}
