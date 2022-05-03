import { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useAddFileOrFolder, useDelete, useFiles, useStick } from '../hook';
import { setFiles, handleCopyAndCut } from '../store/files';

const Line = () => <div style={{ borderTop: "1px solid gray", height: 5, marginTop: 5 }}></div>

export const ContextMenu = () => {
  const [visible, setVisible] = useState<boolean>(false);
  const contextMenu = useRef<any>(null);
  const { stick } = useFiles()
  const [{ type, path }, setValue] = useState({ type: null, path: [] });
  const dispatch = useDispatch();
  const addFileOrFolder = useAddFileOrFolder();
  const remove = useDelete();
  const toStick = useStick()

  // 右键事件监听
  const _handleContextMenu = (event: any) => {
    event.preventDefault();
    const clickX = event.clientX;
    const clickY = event.clientY;

    if (clickX >= 210 || event?.target?.path === "sidebar-main") {
      setVisible(false);
      return
    }
    const ids = event?.target?.title?.split("-");

    setValue({ type: ids.shift(), path: ids?.map((item: string) => Number(item)) });

    setVisible(true);

    const screenW = window.innerWidth;
    const screenH = window.innerHeight;
    const rootW = contextMenu.current.offsetWidth;
    const rootH = contextMenu.current.offsetHeight;
    const right = screenW - clickX > rootW;
    const left = !right;
    const top = screenH - clickY > rootH;
    const bottom = !top;

    if (right) contextMenu.current.style.left = `${clickX + 2}px`;
    if (left) contextMenu.current.style.left = `${clickX - rootW - 2}px`;
    if (top) contextMenu.current.style.top = `${clickY + 2}px`;
    if (bottom) contextMenu.current.style.top = `${clickY - rootH - 2}px`;
  };

  const _handleClick = (event: any) => {
    const wasOutside = !(event.target.contains === contextMenu);
    // 点击其他位置需要隐藏菜单
    if (wasOutside) setVisible(false);
  };

  const _handleScroll = () => {
    if (visible) setVisible(false);
  };

  useEffect(() => {
    // 事件监听
    document.addEventListener('contextmenu', _handleContextMenu);
    document.addEventListener('click', _handleClick);
    document.addEventListener('scroll', _handleScroll);
    return () => {
      // 组件卸载移除事件监听
      document.removeEventListener('contextmenu', _handleContextMenu);
      document.removeEventListener('click', _handleClick);
      document.removeEventListener('scroll', _handleScroll);
    };
  // eslint-disable-next-line
  }, []);

  return (
    <div ref={contextMenu} className="context-menu" style={{ display: visible && type ? "block" : "none" }}>
      {type === "folder" && <>
        <div className="file-item" onClick={() => { addFileOrFolder(path, "folder") }}>新建文件夹</div>
        <div className="file-item" onClick={() => { addFileOrFolder(path, "file"); }}>新建文件</div>
        <Line />
      </>}

      {type === "folder" && JSON.stringify(stick?.content) !== "{}" && <div className="file-item" onClick={() => { toStick(path) }}>粘贴</div>}

      {JSON.stringify(path) !== '[0]' && <>
        <div className="file-item" onClick={() => { dispatch(handleCopyAndCut({ path, action: "copy" })) }}>复制</div>
        <div className="file-item" onClick={() => { dispatch(handleCopyAndCut({ path, action: "cut" })) }}>剪切</div>
        <Line />
        <div className="file-item" onClick={() => { remove(path) }}>删除</div>
        <Line />
      </>}

      <div className="file-item" onClick={() => { dispatch(setFiles({ path, prop: "edit", val: true })) }}>重命名</div>
    </div>
  );
};
