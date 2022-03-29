import { useState, useEffect } from "react";
import axios from "axios";
import Board from "./Board";
import { backendURL } from "./config";

const Game = ({ word }) => {
  const [gameData, setGameData] = useState(undefined);
  const [rootWord, setRootWord] = useState(word);
  
  useEffect(() => {
    function fetchWord() {
      axios.get(backendURL + "/words/random")
        .then(async result => {
          setRootWord(result);
          await fetchBoard(result);
        });
    }

    async function fetchBoard(root) {
      const { data } = await axios.get(backendURL + `/boards/${root}`);
      setGameData(data);
    }

    if (!rootWord) {
      fetchWord();
    }
    else fetchBoard(rootWord);
  }, []);

  return <>
    {gameData ? 
      <Board
        rows={gameData.crossword}
        words={gameData.words}
      />
      :
      <h1>Loading...</h1>
    }
    
  </>
};

export default Game;