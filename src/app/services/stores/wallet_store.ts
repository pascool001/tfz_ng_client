import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from "@ngrx/signals";
import { computed, inject } from "@angular/core";
import { LocalStorageService } from "@utilities";
import { WalletStoreType, IWallet, ICombination } from "@models/wallet";
import { Notifier } from "@utilities";
import { WalletApi } from "@backend/httpRequests/walletApi";
// import { CountryStore } from "./country_store";


const initialStoreState: WalletStoreType = {
    loading: false,
    wallets: [],
    countryId: "",
    filter: { query: '', order: 'asc' },
};


export const WalletStore = signalStore(
    { providedIn: 'root' },
    withState(initialStoreState),

    withComputed((store) => ({

        walletCount: computed(() => store.wallets().length),

        walletCombinatedByCountry: computed(() => {
          let combinations: ICombination[] = []
          let countryWallets: IWallet[] = store.wallets().filter((w) => w.country === store.countryId())
          let source: IWallet[] = [...countryWallets]
          let targets: IWallet[] = [...countryWallets]
          source.forEach((srv: IWallet) => {
            targets.forEach((tgt: IWallet) => {
              combinations.push({w_source: srv, w_target: tgt})
            })
          })

          return combinations
        }),

        filtered: computed(() => {
            const country_id = store.countryId()
            return store.wallets().filter((wallet:IWallet) => wallet.country == country_id ).filter((item:IWallet) => {
                const source = item.wallet_name.trim().toLowerCase()
                const searched_text = store.filter.query().trim().toLowerCase()
                return source.includes(searched_text)
            })
        }),


    })),

    withMethods((store, Api = inject(WalletApi), notifier = inject(Notifier)) => ({

        updateQuery(query: string): void {
          patchState(store, (state) => ({ filter: { ...state.filter, query } }));
        },

        setCountyId(id:string): void {
          patchState(store, {countryId: id})
        },

        async add(data:IWallet): Promise<void> {
            patchState(store, {loading: true });
            Api.add(data).then(async resp => {
                patchState(store, {loading: false, wallets: [...store.wallets(), resp.data] });
                notifier.notify({message: "Operation reussie", status: 'success'})
              }).catch(Error => {
                console.log('Country Adding Error: ', Error)
                patchState(store, {loading: false,});
                notifier.notify({message: "Operation échouée", status: 'error'})
            })

        },


        async update(data:IWallet, id: string): Promise<void> {
            patchState(store, {loading: true });

            Api.update(data, id).then(async resp => {
                patchState(store, {
                    loading: false,
                    wallets: [...store.wallets().map(item => item._id === id ? resp.data : item )]
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
                patchState(store, { loading: false, wallets: [ ...arr] });
            }).catch(err => {
                console.log('GetALL error : ', err)
                patchState(store, {loading: false, wallets: []});
            })
        },

        async delete(id:string): Promise<void> {
            patchState(store, {loading: true });
            Api.delete(id).then(resp => {
                const {_id: deleted_id} = resp.data
                patchState(store, {
                    loading: false,
                    wallets:  [ ...store.wallets().filter((item:IWallet) => item._id !== deleted_id ) ]
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
                    const localStore = _storageService.getItem<WalletStoreType>('walletStore');
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


