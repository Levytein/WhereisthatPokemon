import { useState, useRef, useEffect } from "react";
import "../styles/level.scss";
import chimecho from "../assets/chimecho.png";
import poliwag from "../assets/poliwag.png";
import wingull from "../assets/wingull.png";
import CustomCursor from "../components/CustomCursor";
import MessageBar from "../components/MessageBar";
import LeaderboardForm from "../components/LeaderboardForm";
import {startGameSession,completeLevel , handleClick } from "../queries/checkSubmission";
import level1 from "../assets/level1.jpg";
function LevelOne() {
	const [visible, setVisible] = useState(false);
	const [popupStyle, setPopupStyle] = useState<React.CSSProperties>({
		display: "none",
		left: "0px",
		top: "0px",
		position: "absolute",
	});
	const containerRef = useRef<HTMLDivElement>(null);
	const [clickedPosition, setClickedPosition] = useState({ x: 0, y: 0 });
	const [userAnswer, setUserAnswer] = useState("");
	const [alreadyAnswered, setAlreadyAnswered] = useState<string[]>([]);
	const [feedBack, setFeedBackMsg] = useState("");
	const [messageStyle, setMessageStyle] = useState<React.CSSProperties>({
		display: "none",
	});
	const [animationKey, setAnimationKey] = useState(0);
  	const [showPokemonLeft, setShowPokemonLeft] = useState(true);
	const [session, setSession] = useState<number | null>(null);
	const [time,setTime] = useState(0);
	const [isOver,setIsOver] = useState(false);
	
	useEffect(() => {
		async function manageSession() {
		  try {
	  
			const sessionData = await startGameSession(1);
			if (sessionData?.id) {
			  setSession(sessionData.id);
			}
		  } catch (err) {
			console.error("Session management failed:", err);
			localStorage.removeItem("gameSession");
			setSession(null);
		  }
		}
	  
		manageSession();
	  }, []);
	//timer
	useEffect(() => {
		let interval: ReturnType<typeof setInterval>;
	  
		if (!isOver) {
		  const startTime = Date.now() - time;
		  interval = setInterval(() => {
			setTime(Date.now() - startTime);
		  }, 10);
		}
		
		return () => {
		  if (interval) clearInterval(interval);
		};
	  }, [isOver, time]);
	
  function userClick(event: React.MouseEvent<HTMLDivElement>) {
	if (visible) {
	  setVisible(false);
	  return;
	}
	if (alreadyAnswered.length >= 3) {
	  console.log("User Won");
	  return;
	}
  
	const rect = containerRef.current?.getBoundingClientRect();
	if (!rect) return;
  
	// calculate click coordinates relative to the container
	const x = event.clientX - rect.left;
	const y = event.clientY - rect.top;
	const dropdownHeight = 198; //height of drop down
  

	let topPosition;
	if (rect.height - y < dropdownHeight) {
	  topPosition = y - dropdownHeight;
	} else {
	  topPosition = y;
	}
  
	setClickedPosition({ x, y });
	setPopupStyle({
	  left: `${x}px`,
	  top: `${topPosition}px`,
	  position: "absolute",
	  display: "block",
	});
	setVisible(true);
	console.log(`Clicked at X:${x}, Y:${y}`);
  }
  
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
	e.preventDefault();
	console.log("Form submitted with coordinates:", clickedPosition);
  
	try {
	  const result = await handleClick(
		clickedPosition.x.toString(),
		clickedPosition.y.toString(),
		1,
		userAnswer
	  );
  
	  if (result === true) {
		if (!alreadyAnswered.includes(userAnswer)) {
		  // Create a new array with the updated answers
		  const updatedAnswers = [...alreadyAnswered, userAnswer];
		  
		  setMessageStyle({
			backgroundColor: `green`,
			display: "flex",
		  });
  
		  setFeedBackMsg("You got it right!");
		  setAlreadyAnswered(updatedAnswers);
		  setAnimationKey((prevKey) => prevKey + 1);
		  
		  // Check if game is completed with the new array
		  if (updatedAnswers.length >= 3) {
			console.log("User Won");
			setIsOver(true);
			if (session !== null) {
			  await completeLevel(session.toString());
			}
		  }
		}
	  } else {
		setMessageStyle({
		  backgroundColor: `red`,
		  display: "flex",
		});
  
		setFeedBackMsg("Try again!");
		setAnimationKey((prevKey) => prevKey + 1);
	  }
	  
	  setVisible(false);
	} catch (error) {
	  console.error("Error submitting form:", error);
	}
  }
  function togglePokemonLeft()
  {
    setShowPokemonLeft(!showPokemonLeft);
    console.log(showPokemonLeft);
  }
  const formatTime = (ms: number): string => {
	const minutes = Math.floor(ms / 60000);
	const seconds = Math.floor((ms % 60000) / 1000);
	const hundredths = Math.floor((ms % 1000) / 10); 
	return `${minutes.toString().padStart(2, "0")}:${seconds
	  .toString()
	  .padStart(2, "0")}:${hundredths.toString().padStart(2, "0")}`;
  };
	return (
		<>
			{isOver && <div className='overlay' ></div>}
			{session !== null && isOver && <LeaderboardForm session={session} />}
			<div className="levelContainer">
			
				<MessageBar
					key={animationKey}
					style={messageStyle}
					feedBackMsg={feedBack}
				/>

				<div className="levelOneImageContainer">
					<div className="findablePokemon">
            <div className='leftToFindContainer' style={{display:'flex'}}>
						<h2 style={{ textAlign: "center" }}>Left to find: {formatTime(time)}</h2>
			<button onClick={togglePokemonLeft} className='dropDownButton'>{showPokemonLeft ? "▲" : "▼"}</button>


            {showPokemonLeft && (
		  <div className="findablePokemonImages">
			<div>
			  <img src={chimecho} style={alreadyAnswered.includes("chimecho") ? {opacity: .3} : {opacity: 1}} />
			  <p>Chimecho</p>
			</div>

			<div>
			  <img src={poliwag} style={alreadyAnswered.includes("poliwag") ? {opacity: .3} : {opacity: 1}} /> 
			  <p>Poliwag</p>
			</div>
			<div>
			  <img src={wingull} style={alreadyAnswered.includes("wingull") ? {opacity: .3} : {opacity: 1}}/>
			  <p>Wingull</p>
			</div>
		  </div>
		)}
            </div>
	
          </div> 
					<div className="levelOne" onClick={userClick} ref={containerRef}>
						<img className='level1Image' src={level1}></img>
						{visible && (
							<form
								className="imagesForm"
								method="POST"
								onSubmit={handleSubmit}
								onClick={(e) => e.stopPropagation()}
								style={popupStyle}
							>
								<div className="levelFormSubmission">
									{!alreadyAnswered.includes("chimecho") && (
										<button
											onClick={() => setUserAnswer("chimecho")}
											type="submit"
										>
											<img src={chimecho} />
											<p>Chimecho</p>
										</button>
									)}
									{!alreadyAnswered.includes("poliwag") && (
										<button
											onClick={() => setUserAnswer("poliwag")}
											type="submit"
										>
											<img src={poliwag} />
											<p>Poliwag</p>
										</button>
									)}
									{!alreadyAnswered.includes("wingull") && (
										<button
											onClick={() => setUserAnswer("wingull")}
											type="submit"
										>
											<img src={wingull} />
											<p>Wingull</p>
										</button>
									)}
								</div>
							</form>
						)}
					</div>
				</div>
				<CustomCursor />
			</div>
		</>
	);
}

export default LevelOne;
