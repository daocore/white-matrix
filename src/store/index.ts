import { configureStore } from '@reduxjs/toolkit';
import { filesSlice } from './files';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';

const persistConfig = {
  key: 'files',
  storage: storage,
  stateReconciler: autoMergeLevel2
};

const myPersistReducer = persistReducer(persistConfig, filesSlice.reducer as unknown as any)

export const store = configureStore({
  reducer: {
    files: myPersistReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    })
})
export const persistor = persistStore(store)