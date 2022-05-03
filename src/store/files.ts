import { createSlice } from '@reduxjs/toolkit';
import { createID, getFileItem, setFileItem } from '../utils';

export type TPath = (string | number)[]

export interface FileItem {
  name: string;
  active: boolean;
  id: string;
  path: TPath;
  edit: boolean;
  type: "folder" | "file";
  children: FileItem[];
  select?: boolean;
  content?: string;
}

export type TFileState = {
  files: FileItem[];
  stick: {
    type: "copy" | "cut";
    content: FileItem;
  },
  selectID: string
}


export const filesSlice = createSlice({
  name: 'files', // 命名空间，在调用action的时候会默认的设置为action的前缀
  // 初始值
  initialState: {
    files: [{
      name: "root",
      active: true,
      edit: false,
      type: "folder",
      id: createID(),
      path: [0],
      children: []
    }],
    stick: {
      type: "copy",
      content: {} as FileItem
    },
    selectID: "00000"
  } as TFileState,
  // 这里的属性会自动的导出为actions，在组件中可以直接通过dispatch进行触发
  reducers: {
    handleCopyAndCut(state, { payload }) {
      const data = getFileItem(state.files, payload.path, "self");

      state.stick = {
        type: payload.action,
        content: {
          ...data,
          path: payload.path
        }
      }
    },

    handleCut(state) {
      state.stick = {
        type: "cut",
        content: {} as FileItem
      }
    },

    handleActive(state, { payload }) {
      state.selectID = payload.id;
    },

    setFiles(state, { payload }) {
      const data = setFileItem(state.files, payload.path, payload.prop, payload.val);
      state.files = data
    }
  },
});

// 导出actions
export const { setFiles, handleCopyAndCut, handleActive, handleCut } = filesSlice.actions;

export default filesSlice.reducer; // 导出reducer，在创建store时使用到