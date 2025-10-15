export const Line = ({ guess, isFinal, solution, wordLength, isCurrent }) => {
    const tiles = []
    let lineClass = "line"

    for (let i = 0; i < wordLength; i++) {
    const char = guess[i];
    let tileClass = "tile";
    if (char && isCurrent) tileClass += " filled";

    if (isFinal) {
        if (char === solution[i]) {
            tileClass += " correct";
        } else if (solution.includes(char)) {
            tileClass += " close";
        } else {
            tileClass += " incorrect"
        }
    }

    tiles.push(<div key={i} className={tileClass}>{char}</div>)
    }

    return (
    <div className={lineClass}>
        {tiles}
    </div>)
    }