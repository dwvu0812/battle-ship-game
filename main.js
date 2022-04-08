// var location1 = Math.floor(Math.random() * 5);
// var location2 = location1 + 1;
// var location3 = location1 + 2;

// var guess;
// var hits = 0;
// var guesses = 0;

// var isSunk = false;

// while (isSunk ==false) {

//     guess = prompt("Ready, aim, fire! (enter a number 0-6):")

//     if (guess < 0 || guess > 6) {
//         alert("Please enter a valid cell number!");
//     } else {
//         guesses += 1;

//         if (guess == location1 || guess == location2 || guess == location3) {
//             hits += 1;
//             alert("HITS");
//             if (hits == 3) {
//                 isSunk = true;
//                 alert("You sank my battleship!");
//             }
//         } else {
//             alert("MISS");
//         }
//     }
// }

// var stats = "You took " + guesses + " guesses to sink the battleship, "
//             + "which means yours shooting accuracy was " + (3/guesses);

// alert(stats);

var view = {
    displayMessage: function(msg) {
        var messageAre = document.getElementById("messageAre");
        messageAre.innerHTML = msg;
    },

    displayHit: function(location) {
        var cell = document.getElementById(location);
        cell.setAttribute("class", "hit");
    },

    displayMiss: function(location) {
        var cell = document.getElementById(location);
        cell.setAttribute("class", "miss");
    }
};


var model = {
    boardSize: 7,
    numShips: 3,
    shipLength: 3,
    shipSunks: 0,
    ships: [{locations: [0, 0, 0], hits: ["", "", ""]},
            {locations: [0, 0, 0], hits: ["", "", ""]},
            {locations: [0, 0, 0], hits: ["", "", ""]}],
    fire: function(guess) {

        for (var i = 0; i < this.numShips; i++) {
            let ship = this.ships[i];
            let index = ship.locations.indexOf(guess);

            if (index >= 0) {
                ship.hits[index] = "hit";
                
                view.displayHit(guess);
                view.displayMessage("HIT!");

                if (this.isSunk(ship)) {
                    
                    view.displayMessage("You sank my battleship!");

                    this.shipSunks++;
                }

                return true;
            }
        }

        view.displayMiss(guess);

        return false;
    },
    isSunk: function(ship) {
        for (let i = 0; i < this.shipLength; i++) {
            if (ship.hits[i] !== "hit") {
                return false;
            }
        }
        return true;
    },

    generateShipLocation: function() {
        let locations;

        for (let i = 0; i < this.numShips; i++) {
            do {
                locations = this.generateShip(); 
            }
            while (this.collision(locations));
            this.ships[i].locations = locations;
        }
    },

    generateShip: function() {

        let direction = Math.floor(Math.random() * 2);

        let row, col;

        if (direction === 1) {
            row = Math.floor(Math.random() * this.boardSize);
            col = Math.floor(Math.random() * (this.boardSize - this.shipLength));
        } else {
            col = Math.floor(Math.random() * this.boardSize);
            row = Math.floor(Math.random() * (this.boardSize - this.shipLength));
        }

        let newShipLocation = [];

        for (let i = 0; i < this.shipLength; i++) {
            if (direction === 1) {

                newShipLocation.push(row + "" + (col + i));
            } else {
                newShipLocation.push((row + i) + "" + col);

            }
        }
        return newShipLocation;
    },

    collision: function (locations) {

        for (let i = 0; i < this.numShips; i++) {
            let ship = model.ships[i];

            for (j = 0; j < locations.length; j++) {
                if (ship.locations.indexOf(locations[j]) > 0) {
                    return true;
                }
            }
        }
        return false;
    }

};

var controller = {
    guesses: 0,

    processGuess: function(guess) {
        let location = parseGuess(guess);
        if (location) {
            this.guesses++;
            let hit = model.fire(location);

            if (hit && model.shipSunks === model.numShips) {
                view.displayMessage("You sank my all battleship in " + this.guesses + " guesses");
            }
        }
    }
}

function parseGuess(guess) {

    let alphabet = ["A", "B", "C", "D", "E", "F", "G"];

    if (guess === null || guess.length !== 2) {
        alert("Oops, please enter a letter and a number on the board.");
    }
    else {
        let firstChar = guess.charAt(0);
        let row = alphabet.indexOf(firstChar);
        let column = guess.charAt(1);

        if (isNaN(row) || isNaN(column)) {
            alert("Oops, that isnt on the board.");
        }
        else if (row < 0 || row >= model.boardSize || column < 0 || column >= model.boardSize) {
            alert("Oops, that is off the board.");
        }
        else {
            return row + column;
        }
        
    }
    return null;

}

function init() {
    let fireButton = document.getElementById("fireButton");
    fireButton.onclick = handleFireButton;

    let guessInput = document.getElementById("guessInput");
    guessInput.onkeydown = handleKeyDown;

    model.generateShipLocation();
}

function handleFireButton() {
    let guessInput = document.getElementById("guessInput");
    let guess = guessInput.value;
    controller.processGuess(guess);

    guessInput.value = "";
}

function handleKeyDown(e) {
    let fireButton = document.getElementById("fireButton");
    if (e.keyCode === 13) {
        fireButton.click();
        return false;
    }
}


window.onload = init;

