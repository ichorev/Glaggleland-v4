class ThemePark {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.context = this.canvas.getContext('2d');
        this.gridSize = 40;
        this.frameIndex = 0;
        this.tickCount = 0;
        this.ticksPerFrame = 4; // Adjust for animation speed
        this.numberOfFrames = 4; // Number of frames in the sprite animation

        this.player = {
            x: 0,
            y: 0,
            score: 0,
            img: new Image(),
            width: 72, // Width of a single frame in the sprite sheet
            height: 97, // Height of a single frame in the sprite sheet
            frameX: 0,
            frameY: 0,
        };
        this.player.img.src = 'images/character_maleAdventurer_sheet.png'; // Set the source of the player sprite sheet

        this.attractions = [
            { x: 5, y: 5, img: new Image(), name: 'Roller Coaster', visited: false },
            { x: 10, y: 8, img: new Image(), name: 'Ferris Wheel', visited: false },
            { x: 15, y: 12, img: new Image(), name: 'Carousel', visited: false }
        ];
        this.attractions[0].img.src = 'images/roller_coaster.png'; // Use the new image for the roller coaster
        this.attractions[1].img.src = 'images/ferris_wheel.png';
        this.attractions[2].img.src = 'images/carousel.png';

        this.setupKeyboardListeners();
        this.player.img.onload = () => this.draw(); // Ensure the player image is loaded before drawing
    }

    setupKeyboardListeners() {
        window.addEventListener('keydown', (e) => {
            switch (e.key) {
                case 'ArrowUp':
                    this.player.y = Math.max(0, this.player.y - 1);
                    this.player.frameY = 3; // Change to the appropriate row in the sprite sheet
                    break;
                case 'ArrowDown':
                    this.player.y = Math.min(this.canvas.height / this.gridSize - 1, this.player.y + 1);
                    this.player.frameY = 0; // Change to the appropriate row in the sprite sheet
                    break;
                case 'ArrowLeft':
                    this.player.x = Math.max(0, this.player.x - 1);
                    this.player.frameY = 1; // Change to the appropriate row in the sprite sheet
                    break;
                case 'ArrowRight':
                    this.player.x = Math.min(this.canvas.width / this.gridSize - 1, this.player.x + 1);
                    this.player.frameY = 2; // Change to the appropriate row in the sprite sheet
                    break;
            }
            this.checkInteractions();
            this.update();
        });
    }

    checkInteractions() {
        this.attractions.forEach(attraction => {
            if (this.player.x === attraction.x && this.player.y === attraction.y && !attraction.visited) {
                alert(`You have reached the ${attraction.name}!`);
                attraction.visited = true;
                this.player.score += 10;
                this.updateGameStatus();
            }
        });
    }

    updateGameStatus() {
        const status = document.getElementById('gameStatus');
        status.textContent = `Score: ${this.player.score}`;
    }

    drawGrid() {
        for (let x = 0; x < this.canvas.width; x += this.gridSize) {
            for (let y = 0; y < this.canvas.height; y += this.gridSize) {
                this.context.strokeStyle = '#ccc';
                this.context.strokeRect(x, y, this.gridSize, this.gridSize);
            }
        }
    }

    update() {
        this.tickCount += 1;

        if (this.tickCount > this.ticksPerFrame) {
            this.tickCount = 0;
            this.frameIndex = (this.frameIndex + 1) % this.numberOfFrames;
        }

        this.draw();
    }

    draw() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawGrid();

        // Draw player with sprite animation
        this.context.drawImage(
            this.player.img,
            this.frameIndex * this.player.width, // Source X
            this.player.frameY * this.player.height, // Source Y
            this.player.width, // Source Width
            this.player.height, // Source Height
            this.player.x * this.gridSize, // Destination X
            this.player.y * this.gridSize, // Destination Y
            this.gridSize, // Destination Width
            this.gridSize // Destination Height
        );

        // Draw attractions
        this.attractions.forEach(attraction => {
            this.context.drawImage(attraction.img, attraction.x * this.gridSize, attraction.y * this.gridSize, this.gridSize, this.gridSize);
        });

        requestAnimationFrame(() => this.update());
    }
}

const park = new ThemePark();
