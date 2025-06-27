import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from "@ngrx/signals";
import { computed, inject } from "@angular/core";
import { LocalStorageService } from "../../utilities/local-storage.service";
import { ProfilStoreType, IProfil } from "@models/profil";

import { ProfilApi } from "@backend/httpRequests/profileApi";
import { Notifier } from "@utilities";


const initialStoreState: ProfilStoreType = {
    loading: false,
    profils: [],
    filter: { query: '', order: 'asc' },
};



export const ProfilStore = signalStore(
    { providedIn: 'root' },
    withState(initialStoreState),

    withComputed((store) => ({


        filteredProfils: computed(() => {
            return store.profils().filter((item:IProfil) => {
                const source = item.desi_profil.trim().toLowerCase()
                const searched_text = store.filter.query().trim().toLowerCase()
                return source.includes(searched_text)
            }
            )
        }),


    })),

    withMethods((store, Api = inject(ProfilApi), notifier = inject(Notifier)) => ({

        updateQuery(query: string): void {
          patchState(store, (state) => ({ filter: { ...state.filter, query } }));
        },

        async addProfil(data:IProfil): Promise<void> {
            patchState(store, {loading: true });
            Api.addProfil(data).then(async resp => {
                patchState(store, {loading: false, profils: [...store.profils(), resp.data] });
                notifier.notify({message: "Operation reussie", status: 'success'})
              }).catch(Error => {
                console.log('Country Adding Error: ', Error)
                patchState(store, {loading: false,});
                notifier.notify({message: "Operation échouée", status: 'error'})
            })

        },


        async updateProfil(data:IProfil, id: string): Promise<void> {
            patchState(store, {loading: true });

            Api.updateProfil(data, id).then(async resp => {
                patchState(store, {
                    loading: false,
                    profils: [...store.profils().map(item => item._id === id ? resp.data : item )]
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
                    return (item._doc) ? { ...item._doc} : item
                })
                patchState(store, {loading: false, profils: [ ...arr]});
            }).catch(err => {
                console.log('GetALL error : ', err)
                patchState(store, {loading: false, profils: []});
            })
        },

        async deleteProfil(id:string): Promise<void> {
            patchState(store, {loading: true });
            Api.deleteProfil(id).then(resp => {
                const {_id: deleted_id} = resp.data
                patchState(store, {
                    loading: false,
                    profils:  [ ...store.profils().filter((item:IProfil) => item._id !== deleted_id ) ]
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
                    const localStore = _storageService.getItem<ProfilStoreType>('ProfileStore');
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


