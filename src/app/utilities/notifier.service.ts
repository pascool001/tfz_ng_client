import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface INotifier {
  status: string,
  message: string
}

@Injectable({
    providedIn: 'root'
})
export class Notifier {
  private notifier = new BehaviorSubject<INotifier|null>({status:'null', message: ""});

  notifier$ = this.notifier.asObservable();

  notify(objet: INotifier): void {
    this.notifier.next(objet);
  }

  get currentNotification(): INotifier|null {
    return this.notifier.value;
  }

}
