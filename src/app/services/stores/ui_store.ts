import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from "@ngrx/signals";
import { computed, inject } from "@angular/core";

import { LocalStorageService } from "../../utilities/local-storage.service";


interface UI_model {
  currentUrl: string
}

const initialStoreState: UI_model = {
  currentUrl: ""
};




export const UIStore = signalStore(
    { providedIn: 'root' },
    withState(initialStoreState),

    withComputed((store) => ({

      urlEndsWith: computed(() => {
        return store.currentUrl().split('/').slice(-1)[0]
      })
      
    })),

    withMethods((store) => ({

      async setUrl(url:string): Promise<void> {
        patchState(store, {currentUrl: url });
      }

    })),

    withHooks((store) => {
        const _storageService = inject(LocalStorageService)
        return {
                onInit() {
                    const localStore = _storageService.getItem<UI_model>('UIStore');
                    if (localStore) {
                        patchState(store, localStore)
                    }
                },
                onDestroy() {
                    console.log('Store onDestroy ...')
                    patchState(store, initialStoreState)
                },
        }
    })
  );


