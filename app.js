document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('grid');
    const scoreDisplay = document.getElementById('score');
    const levelDisplay = document.getElementById('level');
    const enemyDisplay = document.getElementById('enemies');

    const width = 10;
    const tileSize = 48;

    const squares = [];
    let score = 0;
    let level = 0;
    let playerPosition = 40;
    let enemies = [];
    let playerDirection = 'right';
    let gameRunning = true;

    
        // y,w,x,z = corner walls | a,b = side walls | c,d = top/bottom walls
        // ) = lanterns | ( = fire pots | % = left door | ^ = top door | $ = stairs
        // } = skeletor enemy | (space = empty walkable area | * slicer enemy
    

    const maps = [
        // Level 1 layout
        [
            'ycc)cc^ccw',
            'a        b',
            'a      * b',
            'a    (   b',
            '%        b',
            'a    (   b',
            'a  *     b',
            'a        b',
            'xdd)dd)ddz',
        ],
        // Level 2 layout
        [
            'yccccccccw',
            'a        b',
            ')        )',
            'a        b',
            'a        b',
            'a    $   b',
            'a  }     b',
            'a        b',
            'xdd)dd)ddz',
        ]
    ]

    function createBoard() {
        const currentMap = maps[level]
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 10; j++) {
                const square = document.createElement('div');
                square.setAttribute('id', i * width + j);
                const char = currentMap[i][j];
                addMapElement(square, char, j, i);
                grid.appendChild(square);
                squares.push(square);
            }
        }
        createPlayer()
    }
    createBoard()

    console.log(squares)

    function addMapElement(square, char, x, y) {
        switch(char) {
            case 'a':
                square.classList.add('left-wall')
                break
            case 'b':
                square.classList.add('right-wall')
                break
            case 'c':
                square.classList.add('top-wall')
                break
            case 'd':
                square.classList.add('bottom-wall')
                break
            case 'w':
                square.classList.add('top-right-wall')
                break
            case 'x':
                square.classList.add('bottom-left-wall')
                break
            case 'y':
                square.classList.add('top-left-wall')
                break
            case 'z':
                square.classList.add('bottom-right-wall')
                break
            case '%':
                square.classList.add('left-door')
                break
            case '^':
                square.classList.add('top-door')
                break
            case '$':
                square.classList.add('stairs')
                break
            case ')':
                square.classList.add('torches')
                break
            case '(':
                square.classList.add('fire-pot')
                break
            case '*':
                createBladeTrap(x,y)
                break
            case '}':
                createStalfos(x,y)
                break
        }
    }

    function createPlayer() {
        const playerElement = document.createElement('div')
        playerElement.classList.add('link-right') // or...
        // playerElement.className = 'link-right'
        playerElement.id = 'player'
        playerElement.style.left = `${(playerPosition % width) * tileSize}px`
        playerElement.style.top = `${Math.floor(playerPosition / width) * tileSize}px`
        grid.appendChild(playerElement)
    }

    function createBladeTrap(x,y) {
        const bladeTrapElement = document.createElement('div')
        bladeTrapElement.classList.add('blade-trap')
        bladeTrapElement.style.left = `${x * tileSize}px`
        bladeTrapElement.style.top = `${y * tileSize}px`

        const bladeTrap = {
            x, y,
            direction: -1,
            type: 'blade-trap',
            element: bladeTrapElement
        }

        enemies.push(bladeTrap)
        grid.appendChild(bladeTrapElement)
    }

    function createStalfos(x,y) {
        const stalfosElement = document.createElement('div')
        stalfosElement.classList.add('stalfos')
        stalfosElement.style.left = `${x * tileSize}px`
        stalfosElement.style.top = `${y * tileSize}px`

        const stalfos = {
            x, y,
            direction: -1,
            timer: Math.random() * 5,
            type: 'stalfos',
            element: stalfosElement
        }

        enemies.push(stalfos)
        grid.appendChild(stalfosElement)
    }

    function movePlayer(direction) {
        const playerElement = document.getElementById('player')
        let newPosition = playerPosition

        switch(direction) {
            case 'left':
                if (playerPosition % width !== 0) newPosition = playerPosition -1
                playerElement.className = 'link-left'
                playerDirection = 'left'
                break
            case 'right':
                if (playerPosition % width !== width -1) newPosition = playerPosition +1
                playerElement.className = 'link-right'
                playerDirection = 'right'
                break
            case 'up':
                if (playerPosition - width >= 0) newPosition = playerPosition - width
                playerElement.className = 'link-up'
                playerDirection = 'up'
                break
            case 'down':
                if (playerPosition + width < width * 9) newPosition = playerPosition + width
                playerElement.className = 'link-down'
                playerDirection = 'down'
                break
        }

        if (canMoveTo(newPosition)) {
            const square = squares[newPosition]
            if (square.classList.contains('left-door')) {
                square.classList.remove('left-door')
            }

            if (square.classList.contains('top-door') || square.classList.contains('stairs')) {
                if (enemies.length === 0) {
                    nextLevel()
                } else {
                    showEnemiesRemainingMessage()
                }
                return 
            }
            playerPosition = newPosition
            playerElement.style.left = `${(playerPosition % width) * tileSize}px`
            playerElement.style.top = `${Math.floor(playerPosition / width) * tileSize}px`
        }

    }

    function canMoveTo(position) {
        if (position < 0 || position >= squares.length) return false
        const square = squares[position]
        return !square.classList.contains('left-wall') &&
               !square.classList.contains('right-wall')&&
               !square.classList.contains('top-wall')&&
               !square.classList.contains('bottom-wall')&&
               !square.classList.contains('top-left-wall')&&
               !square.classList.contains('top-right-wall')&&
               !square.classList.contains('bottom-left-wall')&&
               !square.classList.contains('bottom-right-wall')&&
               !square.classList.contains('torches')&&
               !square.classList.contains('fire-pot')
    }

    document.addEventListener('keydown', (e) => {
        if(!gameRunning) return

        switch(e.code) {
            case 'ArrowLeft':
                e.preventDefault()
                movePlayer('left')
                break
            case 'ArrowRight':
                e.preventDefault()
                movePlayer('right')
                break
            case 'ArrowUp':
                e.preventDefault()
                movePlayer('up')
                break
            case 'ArrowDown':
                e.preventDefault()
                movePlayer('down')
                break
            case 'Space':
                e.preventDefault()
                // SpawnBoom()
                break
        }
    })

})