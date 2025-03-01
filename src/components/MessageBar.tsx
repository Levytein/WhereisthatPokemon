import '../styles/MessageBar.scss' // Import the CSS for your custom cursor

const MessageBar = ({ feedBackMsg, style }: { feedBackMsg: string; style: React.CSSProperties }) => {
  

  return (
    <div style={style} className='messageBar'><p className='messageText'>{feedBackMsg}</p></div>
  )
};

export default MessageBar;
