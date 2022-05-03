export const Arrow = ({ down }: { down?: boolean }) => {
    return (
      <svg className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1437" width="16" height="16" style={{ transform: `rotate(${down ? "0" : "-90"}deg) scale(0.7)` }}>
        <path d="M966.4 323.2c-9.6-9.6-25.6-9.6-35.2 0l-416 416-425.6-416c-9.6-9.6-25.6-9.6-35.2 0-9.6 9.6-9.6 25.6 0 35.2l441.6 432c9.6 9.6 25.6 9.6 35.2 0l435.2-432C976 345.6 976 332.8 966.4 323.2z" p-id="1438" fill="#ffffff"></path>
      </svg>
    )
  }