import { ReactNode, useMemo, useState } from "react";
import { useDispatch } from 'react-redux';
import { useFiles, useHavaSameName } from "../hook";
import { FileItem, setFiles, handleActive } from '../store/files';
import { Arrow } from "./Arrow";

export const Files = ({ file, tabSize, path }: { file: FileItem, tabSize: number, path: number[] }) => {
  const dispatch = useDispatch();
  const { selectID } = useFiles();
  const isFolder = useMemo(() => file?.type === "folder", [file.type]);
  const [value, setValue] = useState(file.name || "");
  const haveSameName = useHavaSameName();
  const isSame = useMemo(() => haveSameName(path, value, file.id), [path, value, file.id, haveSameName]);

  const setName = () => {
    if (!value || isSame) return
    dispatch(setFiles({ path, prop: "name", val: value }));
    dispatch(setFiles({ path, prop: "edit", val: false }));
  }

  const title = useMemo(() => `${file.type}-${path.join("-")}`, [file.type, path]);

  const select = () => {
    !isFolder && dispatch(handleActive({ path, id: file.id }));
    dispatch(setFiles({ path, prop: "active", val: isFolder ? !file.active : true }));
    dispatch(setFiles({ path, prop: "path", val: path }));
  }

  return (
    <div
      title={title}
      onClick={select}
      style={{
        marginLeft: tabSize * 5,
        background: selectID === file.id ? "rgb(65, 67, 57)" : "none"
      }}>
      <div
        className="file-item"
        title={title}
        style={{ border: `1px solid ${isSame || !value ? "red" : "transparent"}` }}
      >
        {isFolder && <div title={title} className="arrow"><Arrow down={file.active} /></div>}

        {file.edit
          ? <input
            value={value}
            className="input"
            onKeyDown={(e) => {
              if (e.code === "Enter") {
                setName();
                !isFolder && select();
              }
            }}
            autoFocus
            onBlur={setName}
            onChange={(val) => setValue(val.target.value)} />
          : <div title={title}>{file?.name}</div>}
      </div >
    </div >
  )
}

// 侧边栏
export const Sidebar = ({ filesList }: { filesList: ReactNode }) => {

  return (
    <div id="sidebar">
      <div id="sidebar-main">
        <div className="sidebar-item" id="file-manager">
          {filesList}
        </div >
      </div >
    </div >
  )
}