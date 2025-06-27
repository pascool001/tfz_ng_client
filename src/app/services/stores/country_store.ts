import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from "@ngrx/signals";
import { computed, inject } from "@angular/core";
import { LocalStorageService } from "../../utilities/local-storage.service";
import { CountryStoreType, ICountry } from "../models/country";
import { CountryApi } from "../backend/httpRequests/countryApi";
import { Notifier } from "@utilities";
import { WalletStore } from "./wallet_store";


const initialStoreState: CountryStoreType = {
    loading: false,
    countries: [],
    selectedId: "",
    filter: { query: '', order: 'asc' },
};



export const CountryStore = signalStore(
    { providedIn: 'root' },
    withState(initialStoreState),

    withComputed((store) => ({

        countryCount: computed(() => store.countries().length),

        filteredCountry: computed(() => {
            return store.countries().filter((item:ICountry) => {
                const source = item.country_name.concat(item.country_indic).concat(item.country_code).trim().toLowerCase()
                const searched_text = store.filter.query().trim().toLowerCase()
                return source.includes(searched_text)
            }
            )
        }),

        selectedCountry: computed(() => {
            return store.countries().find(item => item._id == store.selectedId())
        })
    })),

    withMethods((store, Api = inject(CountryApi), wallet_store = inject(WalletStore) , notifier = inject(Notifier)) => ({

        updateQuery(query: string): void {
          patchState(store, (state) => ({ filter: { ...state.filter, query } }));
        },

        selectOne(id:string): void {
          patchState(store, {selectedId: id})
          wallet_store.setCountyId(id)
        },


        async addCountry(data:ICountry): Promise<void> {
            patchState(store, {loading: true });
            Api.addCountry(data).then(async resp => {
                patchState(store, {loading: false, countries: [...store.countries(), resp.data] });
                notifier.notify({message: "Operation reussie", status: 'success'})
              }).catch(Error => {
                patchState(store, {loading: false});
                notifier.notify({message: "Operation échouée", status: 'error'})
            })
        },


        async updateCountry(data:ICountry, id: string): Promise<void> {
            patchState(store, {loading: true });

            Api.updateCountry(data, id).then(async resp => {
                patchState(store, {
                    loading: false,
                    countries: [...store.countries().map(item => item._id === id ? resp.data : item )]
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
                patchState(store, {loading: false, countries: [ ...arr], selectedId: !!arr.length ? arr[0]._id : "",  });
                wallet_store.setCountyId(store.selectedId())
            }).catch(err => {
                console.log('GetALL error : ', err)
                patchState(store, {loading: false, countries: []});
            })
        },

        async deleteCountry(id:string): Promise<void> {
            patchState(store, {loading: true });
            Api.deleteCountry(id).then(resp => {
                const {_id: deleted_id} = resp.data
                patchState(store, {
                    loading: false,
                    countries:  [ ...store.countries().filter((item:ICountry) => item._id !== deleted_id ) ]
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
                    const localStore = _storageService.getItem<CountryStoreType>('countryStore');
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


