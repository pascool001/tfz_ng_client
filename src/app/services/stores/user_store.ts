import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from "@ngrx/signals";
import { computed, inject } from "@angular/core";

import { LocalStorageService } from "../../utilities/local-storage.service";
import { IUser, UserStoreType } from "../models/user";
import { UserApi } from "../backend/httpRequests/userApi";

const initialStoreState: UserStoreType = {
    loading: false,
    users: [],
    selectedId: "",
    filter: { query: '', order: 'asc' },
};

export const UserStore = signalStore(
    { providedIn: 'root' },
    withState(initialStoreState),

    withComputed((store) => ({

        userCount: computed(() => store.users().length),

        filteredUser: computed(() => {
            return store.users().filter((item:IUser) => {
                const source = item.name.concat(item.email).trim().toLowerCase()
                const searched_text = store.filter.query().trim().toLowerCase()
                return source.includes(searched_text)
            }
            )
        }),

        selectedUser: computed(() => {
            return store.users().find(item => item._id == store.selectedId())
        })
    })),

    withMethods((store, Api = inject(UserApi)) => ({

        updateQuery(query: string): void {
            patchState(store, (state) => ({ filter: { ...state.filter, query } }));
        },

        selectOne(id:string): void {
            patchState(store, {selectedId: id})
        },


        async add(data:IUser): Promise<void> {
            patchState(store, {loading: true });
            Api.add(data).then(async resp => {
                patchState(store, {
                    loading: false,
                    users: [...store.users(), resp.data]
                });
            }).catch(Error => {
                patchState(store, {loading: false});
            })

        },


        async update(data:IUser, id: string): Promise<void> {
            patchState(store, {loading: true });

            Api.update(data, id).then(async resp => {
                patchState(store, {
                    loading: false,
                    users: [...store.users().map(item => item._id === id ? resp.data : item )]
                });
            }).catch(Error => {
                console.log('update user error: ', Error)
                patchState(store, {loading: false});
            })
        },

        async getAll(): Promise<void> {
            patchState(store, {loading: true });
            Api.getAll().then(resp => {
                let arr = resp.data.map((item:any) => {
                    return (item._doc) ? {image: item.image, ...item._doc} : item
                })
                patchState(store, {
                    loading: false, 
                    users: [ ...arr]
                });
            }).catch(err => {
                console.log('GetALL error : ', err)
                patchState(store, {loading: false, users: []});
            })
        },
        
        async delete(id:string): Promise<void> {
            patchState(store, {loading: true });
            Api.delete(id).then(resp => {
                const {_id: deleted_id} = resp.data
                patchState(store, {
                    loading: false, 
                    users:  [ ...store.users().filter((item:IUser) => item._id !== deleted_id ) ]
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
                    const localStore = _storageService.getItem<UserStoreType>('userStore');
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


