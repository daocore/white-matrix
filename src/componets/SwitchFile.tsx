import { FileItem, handleActive, setFiles } from "../store/files";
import { useDispatch } from "react-redux";
import { useMemo } from "react";
import { useFiles } from "../hook";

// 文件切换
export const SwitchFile = ({ showList }: { showList: FileItem[] }) => {
  const { selectID } = useFiles();
  const dispatch = useDispatch();
  const selectConnet = useMemo(() => showList.find(item => item?.id === selectID), [selectID, showList]);
  if (!selectConnet && showList?.length === 0) return null

  return (
    <div className="editor-tabs">
      {showList?.map((item: any, i: number) => <div key={i} className={`editor-tab`} style={{
        background: selectID === item?.id ? "rgba(0, 0, 0, 1)" : "none",
        borderRight: "1px solid rgba(0, 0, 0, 1)"
      }}
        onClick={() => {
          dispatch(handleActive({ path: item.path, id: item.id }));
          dispatch(setFiles({ path: item.path, prop: "active", val: true }));
        }}
      >
        <div>{item.name}</div>
        &emsp;
        <div onClick={(e) => {
          e.stopPropagation();
          selectID === item?.id && dispatch(handleActive({ path: item.path, id: "" }));
          dispatch(setFiles({ path: item.path, prop: "active", val: false }));
        }}>❌</div>
      </div>
      )}
    </div>
  );
}