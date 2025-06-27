import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from "@ngrx/signals";
import { computed, inject } from "@angular/core";
import { LocalStorageService } from "@utilities";
import { Notifier } from "@utilities";
import { WalletTPStoreType, IWalletTP } from "@models/walletTransPricing";
import { WalletTransferPricingApi } from "@backend/httpRequests/walletTransferPricingApi";
import { ICombination } from "@models/wallet";


const initialStoreState: WalletTPStoreType = {
    loading: false,
    walletTPS: [],
    wallet_combination: null,
    filter: { query: '', order: 'asc' },
};



export const WalletTPStore = signalStore(
    { providedIn: 'root' },
    withState(initialStoreState),

    withComputed((store) => ({

      // descriptionDuPricing: computed(() => {
      //   return {
      //     logo_source
      //   }
      // }),
      activeCombinationId: computed(() => {
        const sourceId = store.wallet_combination()?.w_source._id;
        const targetId = store.wallet_combination()?.w_target._id
        return (sourceId && targetId) ? sourceId.concat("-").concat(targetId) : null
      }),

      Wallet_Combination_Princing_Range: computed(() => {
        return store.walletTPS().find((WCPR) =>
          WCPR.wallet_source_id == store.wallet_combination()?.w_source._id
          &&
          WCPR.wallet_target_id == store.wallet_combination()?.w_target._id
        )
      })

    })),

    withMethods((store, Api = inject(WalletTransferPricingApi), notifier = inject(Notifier)) => ({

        updateQuery(query: string): void {
          patchState(store, (state) => ({ filter: { ...state.filter, query } }));
        },

        setCombination(combObj: ICombination) {
          // console.log("combObj : ", combObj)
          patchState(store, {wallet_combination: combObj})
        },

        async add(data:IWalletTP): Promise<void> {
            patchState(store, {loading: true });
            Api.add(data).then(async resp => {
                patchState(store, {loading: false, walletTPS: [...store.walletTPS(), resp.data] });
                notifier.notify({message: "Operation reussie", status: 'success'})
              }).catch(Error => {
                console.log('Country Adding Error: ', Error)
                patchState(store, {loading: false,});
                notifier.notify({message: "Operation échouée", status: 'error'})
            })
        },


        async update(data:IWalletTP, id: string): Promise<void> {
            patchState(store, {loading: true });

            Api.update(data, id).then(async resp => {
                patchState(store, {
                    loading: false,
                    walletTPS: [...store.walletTPS().map(item => item._id === id ? resp.data : item )]
                });
                notifier.notify({message: "Modification reussie", status: 'success'})
            }).catch(Error => {
                console.log('updateCountry error: ', Error)
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
                patchState(store, { loading: false, walletTPS: [ ...arr] });
            }).catch(err => {
                console.log('GetALL error : ', err)
                patchState(store, {loading: false, walletTPS: []});
            })
        },

        async delete(id:string): Promise<void> {
            patchState(store, {loading: true });
            Api.delete(id).then(resp => {
                const {_id: deleted_id} = resp.data
                patchState(store, {
                    loading: false,
                    walletTPS:  [ ...store.walletTPS().filter((item:IWalletTP) => item._id !== deleted_id ) ]
                });
            }).catch(err => {
                console.log('Store deletion error: ', err)
                patchState(store, {loading: false});
            })
        },

    })),

    withHooks((store) => {
        const _storageService = inject(LocalStorageService)
        return {
                onInit() {
                    const localStore = _storageService.getItem<WalletTPStoreType>('WalletTPStore');
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


