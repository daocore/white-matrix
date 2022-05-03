import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FileItem, handleCut, setFiles, TFileState, TPath } from "../store/files";
import { createID, getFileItem, modifyID, setFileItem } from "../utils";

export const useFiles = () => useSelector((state: { files: TFileState }) => state.files);

export const useHavaSameName = () => {
  const { files } = useFiles();
  return useCallback((path: (string | number)[], name: string, id: string) => {
    const childrens = getFileItem(files, path.slice(0, -1), "children")
    const items = childrens?.filter((item: FileItem) => item.name === name);
    return items?.length > 1
  }, [files])
}

export const useAddFileOrFolder = () => {
  const { files } = useFiles();
  const dispatch = useDispatch();

  return useCallback((path: TPath, type: 'folder' | 'file') => {
    const currentItem = getFileItem(files, path, "self");

    const value = {
      name: "",
      active: false,
      edit: true,
      type,
      path: [...path, currentItem?.children?.length],
      id: createID(),
      children: []
    }

    dispatch(setFiles({ path, val: [...currentItem?.children, value], prop: "children" }));
    dispatch(setFiles({ path, val: true, prop: "active" }));
  }, [files, dispatch])
}

export const useDelete = () => {
  const { files } = useFiles();
  const dispatch = useDispatch();

  return useCallback((path: TPath) => {
    const arr = [...path];
    const index = arr.pop();
    const father = getFileItem(files, arr, "self");
    father?.children.splice(index, 1);
    dispatch(setFiles({ path: arr, val: father?.children, prop: "children" }));
  }, [files, dispatch])
}

export const useStick = () => {
  const { files, stick } = useFiles();
  const dispatch = useDispatch();

  return useCallback((path: TPath) => {
    let deleteAfter = files;
    const pathStr = path?.join("-");
    const stickPath = stick.content.path.join("-")

    //剪切后删除相关资源
    if (stick.type === "cut") {
      if (pathStr?.includes(stickPath)) return alert("剪切后该路径已不存在！");

      const arr = [...stick.content.path];
      const index = arr.pop();
      const father = getFileItem(files, arr, "self");
      father?.children.splice(index, 1);
      deleteAfter = setFileItem(files, arr, "children", father.children);
      dispatch(handleCut());
    }

    //当剪切的资源处于粘贴资源的前面时，要对路径进行向上偏移
    const index = pathStr?.indexOf(stickPath?.slice(0, -1)) + stickPath?.length - 1;
    const isOffset = Number(pathStr[index]) - Number(stickPath[stickPath?.length - 1]) > 0;
    if (isOffset) path[path?.length - 1] = Number(path[path?.length - 1]) - 1;

    const currentItem = getFileItem(deleteAfter, path, "self");
    currentItem?.children.push({ ...modifyID(stick.content), path: [...path, currentItem?.children?.length] });

    const stickAfter = setFileItem(deleteAfter, path, "children", currentItem.children);
    const activeAfter = setFileItem(stickAfter, path, "active", true);

    dispatch(setFiles({ path: [0], val: activeAfter[0].children, prop: "children" }));
  }, [files, stick, dispatch])
}