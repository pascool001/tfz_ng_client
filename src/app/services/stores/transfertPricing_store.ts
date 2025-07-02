import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from "@ngrx/signals";
import { computed, inject } from "@angular/core";
import { LocalStorageService } from "@utilities";
import { Notifier } from "@utilities";
import {IPricingRange, PricingStoreType} from "@models/transPricing"
import { TransferPricingApi } from "@backend/httpRequests/transPricingApi";


const initialStoreState: PricingStoreType = {
    loading: false,
    pricings: [],
    transDirectionIds: {sourceId: "", targetId: ""},
    filter: { query: '', order: 'asc' },
};


export const TransferPricingStore = signalStore(
    { providedIn: 'root' },
    withState(initialStoreState),

    withComputed((store) => ({

      pricingList: computed(() => {
        const list = store.pricings().filter((item:IPricingRange) => {
          return item.source_wallet == store.transDirectionIds().sourceId
           && item.target_wallet == store.transDirectionIds().targetId
        })
        console.log("LIST: ", list)
        return list
      })

    })),

    withMethods((store, Api = inject(TransferPricingApi), notifier = inject(Notifier)) => ({

        updateQuery(query: string): void {
          patchState(store, (state) => ({ filter: { ...state.filter, query } }));
        },

        setTranferSourceId(source_id:string) {
          patchState(store, {transDirectionIds: {...store.transDirectionIds(), sourceId: source_id}})
        },

        setTranferTargetId(target_id:string) {
          patchState(store, {transDirectionIds: {...store.transDirectionIds(), targetId: target_id}})
        },


        async add(data:IPricingRange): Promise<void> {
            patchState(store, {loading: true });
            Api.add(data).then(async resp => {
                patchState(store, {loading: false, pricings: [...store.pricings(), resp.data] });
                notifier.notify({message: "Operation reussie", status: 'success'})
                console.log("store.pricings : ", store.pricings())
              }).catch(Error => {
                patchState(store, {loading: false,});
                notifier.notify({message: "Operation échouée", status: 'error'})
            })
        },


        async update(data:IPricingRange, id: string): Promise<void> {
            patchState(store, {loading: true });

            Api.update(data, id).then(async resp => {
                patchState(store, {
                    loading: false,
                    pricings: [...store.pricings().map(item => item._id === id ? resp.data : item )]
                });
                notifier.notify({message: "Modification reussie", status: 'success'})
            }).catch(Error => {
                patchState(store, {loading: false});
                notifier.notify({message: "Modification échouée !!", status: 'error'})
            })
        },

        async getAll(): Promise<void> {
            patchState(store, {loading: true });
            Api.getAll().then(resp => {
                let arr = resp.data.map((item:any) => {
                    return (item._doc) ? {image: item.image, ...item._doc} : item
                })
                patchState(store, { loading: false, pricings: [ ...arr] });
            }).catch(err => {
                patchState(store, {loading: false, pricings: []});
            })
        },

        async delete(id:string): Promise<void> {
            patchState(store, {loading: true });
            Api.delete(id).then(resp => {
                const {_id: deleted_id} = resp.data
                patchState(store, {
                    loading: false,
                    pricings:  [ ...store.pricings().filter((item:IPricingRange) => item._id !== deleted_id ) ]
                });
            }).catch(err => {
                patchState(store, {loading: false});
            })
        },

    })),

    withHooks((store) => {
        const _storageService = inject(LocalStorageService)
        return {
                onInit() {
                    const localStore = _storageService.getItem<PricingStoreType>('WalletTPStore');
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


