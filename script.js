let fields = Array(9).fill(null); // Set all fields to null initially
let turn = 'circle'; // Start with 'circle'
let players = {
    circle: '', // Name for circle will be set by the player
    cross: ''   // Name for cross will be set by the player
};
let gameOver = false; // Track if the game is over

// Winning combinations (index positions in fields array)
const winningCombos = [
    [0, 1, 2], // Top row
    [3, 4, 5], // Middle row
    [6, 7, 8], // Bottom row
    [0, 3, 6], // Left column
    [1, 4, 7], // Middle column
    [2, 5, 8], // Right column
    [0, 4, 8], // Diagonal top-left to bottom-right
    [2, 4, 6]  // Diagonal top-right to bottom-left
];

// Initialize the game on page load
function init() {
    promptPlayerNames(); // Ask for player names at the start
    resetGame(); // Start a new game
    renderPlayerNames(); // Display the player names
    render();
}

// Prompt players to input their names
function promptPlayerNames() {
    players.circle = prompt("Enter the name for the Circle player (O):", "Player 1");
    players.cross = prompt("Enter the name for the Cross player (X):", "Player 2");
}

// Reset the game state
function resetGame() {
    fields = Array(9).fill(null); // Reset all fields to null
    turn = 'circle'; // Start with 'circle'
    gameOver = false; // Reset game over status
    document.getElementById('content').innerHTML = ''; // Clear the board
    document.querySelectorAll('td').forEach(cell => {
        cell.style.textDecoration = ''; // Remove any strike-through effects
    });
    render(); // Render the new board
}

// Display the player names under the h1 tag
function renderPlayerNames() {
    const playerNamesHTML = `<p>Circle: ${players.circle} (O)</p><p>Cross: ${players.cross} (X)</p>`;
    document.getElementById('playerNames').innerHTML = playerNamesHTML;
}

function render() {
    let tableHTML = '<table>';

    for (let i = 0; i < 3; i++) {
        tableHTML += '<tr>';

        for (let j = 0; j < 3; j++) {
            const fieldIndex = i * 3 + j;
            const fieldValue = fields[fieldIndex];

            let content = '<div>';

            if (fieldValue === 'circle') {
                content = createAnimatedCircle();
            } else if (fieldValue === 'cross') {
                content = createYellowCross();
            }

            // Add onclick event to each <td> if the game is not over and if it's not already filled
            if (!gameOver && !fieldValue) {
                tableHTML += `<td onclick="handleClick(${fieldIndex}, this)">${content}</td>`;
            } else {
                tableHTML += `<td>${content}</td>`;
            }
        }

        tableHTML += '</tr>';
    }

    tableHTML += '</table>';

    document.getElementById('content').innerHTML = tableHTML;
}

function handleClick(index, element) {
    if (gameOver || fields[index]) return; // Prevent further clicks if game is over or field is filled

    // Set the field based on whose turn it is
    fields[index] = turn;

    // Update the innerHTML of the clicked <td> with the respective SVG
    if (turn === 'circle') {
        element.innerHTML = createAnimatedCircle();
        turn = 'cross'; // Next turn is for 'cross'
    } else {
        element.innerHTML = createYellowCross();
        turn = 'circle'; // Next turn is for 'circle'
    }

    element.removeAttribute('onclick'); // Remove click event after selection

    // Check if someone has won
    checkWin();
}

function checkWin() {
    for (const combo of winningCombos) {
        const [a, b, c] = combo;

        if (fields[a] && fields[a] === fields[b] && fields[a] === fields[c]) {
            gameOver = true;
            highlightWinningCombo(combo);
            showWinner(fields[a]);
            break;
        }
    }

    // If no winner but all fields are filled, it's a draw
    if (!gameOver && fields.every(field => field !== null)) {
        showDraw();
    }
}

function highlightWinningCombo(combo) {
    const tableCells = document.querySelectorAll('td');

    combo.forEach(index => {
        tableCells[index].style.textDecoration = "line-through";
    });
}

function showWinner(winner) {
    const winnerName = winner === 'circle' ? players.circle : players.cross;
    const message = `Congratulations, ${winnerName}! You won!`;
    showEndMessage(message);
}

function showDraw() {
    const message = "It's a draw! No one wins.";
    showEndMessage(message);
}

function showEndMessage(message) {
    const winnerDiv = document.createElement('div');
    winnerDiv.innerHTML = `<h2>${message}</h2>`;
    winnerDiv.style.position = 'absolute';
    winnerDiv.style.top = '50%';
    winnerDiv.style.left = '50%';
    winnerDiv.style.transform = 'translate(-50%, -50%)';
    winnerDiv.style.backgroundColor = '#FFD700';
    winnerDiv.style.padding = '20px';
    winnerDiv.style.borderRadius = '10px';
    winnerDiv.style.boxShadow = '0px 4px 10px rgba(0,0,0,0.2)';
    winnerDiv.style.fontSize = '2em';
    winnerDiv.style.color = 'black';

    document.body.appendChild(winnerDiv);

    setTimeout(() => {
        winnerDiv.remove();
        promptPlayerNames(); // Restart and prompt for new player names
        resetGame(); // Reset the game for a new round
    }, 3000); // After 3 seconds, restart the game
}

function createAnimatedCircle() {
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("width", "70");
    svg.setAttribute("height", "70");
    svg.setAttribute("viewBox", "0 0 100 100");

    const circle = document.createElementNS(svgNS, "circle");
    circle.setAttribute("cx", "50");
    circle.setAttribute("cy", "50");
    circle.setAttribute("r", "45");
    circle.setAttribute("fill", "none");
    circle.setAttribute("stroke", "#00B0EF");
    circle.setAttribute("stroke-width", "10");
    circle.setAttribute("stroke-dasharray", "283");
    circle.setAttribute("stroke-dashoffset", "283");

    const animate = document.createElementNS(svgNS, "animate");
    animate.setAttribute("attributeName", "stroke-dashoffset");
    animate.setAttribute("from", "283");
    animate.setAttribute("to", "0");
    animate.setAttribute("dur", "2s");
    animate.setAttribute("fill", "freeze");
    animate.setAttribute("repeatCount", "1");

    circle.appendChild(animate);
    svg.appendChild(circle);

    return svg.outerHTML;
}

function createYellowCross() {
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("width", "70");
    svg.setAttribute("height", "70");
    svg.setAttribute("viewBox", "0 0 100 100");

    const line1 = document.createElementNS(svgNS, "line");
    line1.setAttribute("x1", "20");
    line1.setAttribute("y1", "20");
    line1.setAttribute("x2", "80");
    line1.setAttribute("y2", "80");
    line1.setAttribute("stroke", "yellow");
    line1.setAttribute("stroke-width", "10");

    const line2 = document.createElementNS(svgNS, "line");
    line2.setAttribute("x1", "80");
    line2.setAttribute("y1", "20");
    line2.setAttribute("x2", "20");
    line2.setAttribute("y2", "80");
    line2.setAttribute("stroke", "yellow");
    line2.setAttribute("stroke-width", "10");

    svg.appendChild(line1);
    svg.appendChild(line2);

    return svg.outerHTML;
}

// Initialize the game when the page loads
window.onload = init;
