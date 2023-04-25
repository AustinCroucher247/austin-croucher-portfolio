import { gsap } from "gsap";
let game = {
    over: false,
    active: true
};

game.mount = (canvas) => {
    const c = canvas.getContext('2d')

    canvas.width = 64 * 16 // 1024
    canvas.height = 64 * 9 // 576


    class Sprite {
        constructor({ position, imageSrc, frameRate = 1, animations, frameBuffer = 2, loop = true, autoplay = true, scale = 1, }) {
            this.position = position
            this.image = new Image()
            this.image.onload = () => {
                console.log("Image loaded");

                this.loaded = true
                this.width = this.image.width / this.frameRate
                this.height = this.image.height
            }
            this.image.src = imageSrc
            this.loaded = false
            this.frameRate = frameRate
            this.currentFrame = 0
            this.elapsedFrames = 0
            this.frameBuffer = frameBuffer
            this.animations = animations
            this.loop = loop
            this.autoplay = autoplay
            this.scale = scale

            if (this.animations) {
                for (let key in this.animations) {
                    const image = new Image()
                    image.src = this.animations[key].imageSrc
                    this.animations[key].image = image
                }
            }
        };
        draw() {
            if (!this.loaded) return
            const cropbox = {
                position: {
                    x: this.width * this.currentFrame,
                    y: 0
                },
                width: this.width,
                height: this.height
            }

            c.drawImage(
                this.image,
                cropbox.position.x,
                cropbox.position.y,
                cropbox.width, cropbox.height,
                this.position.x,
                this.position.y,

                this.width * this.scale,
                this.height * this.scale

            )
            this.updateFrames()
        }


        play() {
            this.autoplay = true
        }


        updateFrames() {
            if (!this.autoplay) return
            this.elapsedFrames++;


            if (this.elapsedFrames % this.frameBuffer === 0) {
                if (this.currentFrame < this.frameRate - 1) this.currentFrame++
                else if (this.loop) this.currentFrame = 0
            }
            if (this.currentAnimation?.onComplete) {
                if (this.currentFrame === this.frameRate - 1 && !this.currentAnimation.isActive) {
                    this.currentAnimation.onComplete()
                    this.currentAnimation.isActive = true
                }
            }
        }
    }


    class Player extends Sprite {
        constructor({ collisionBlocks = [], imageSrc, frameRate, animations, loop }) {
            super({ imageSrc, frameRate, animations, loop })
            this.position = {
                x: 200,
                y: 200
            }

            this.velocity = {
                x: 0,
                y: 0
            }



            this.sides = {
                bottom: this.position.y + this.height
            }
            this.gravity = .7
            this.collisionBlocks = collisionBlocks
        }

        update() {
            //this is the blue box
            // c.fillStyle = 'rgba (0, 0, 255, 0.5)'
            // c.fillRect(this.position.x, this.position.y, this.width, this.height)
            this.position.x += this.velocity.x
            this.updateHitBox()

            this.checkForHorizontalCollisions()
            this.applyGravity()

            this.updateHitBox()
            // c.fillRect(this.hitbox.position.x, this.hitbox.position.y, this.hitbox.width, this.hitbox.height)
            this.checkForVerticalCollisions()

        }

        handleInput(keys) {
            if (this.preventInput) return
            player.velocity.x = 0
            if (keys.d.pressed) {
                this.switchSprite('runRight')
                this.velocity.x = 5;
                this.lastDirection = 'right'
            } else if (keys.a.pressed) {
                this.switchSprite('runLeft')
                this.velocity.x = -5;
                this.lastDirection = 'left'
            }
            else {
                if (this.lastDirection === 'left')
                    this.switchSprite('idleLeft')
                else
                    this.switchSprite('idleRight')
            }
        }


        switchSprite(name) {
            if (this.image === this.animations[name].image) return
            this.currentFrame = 0
            this.image = this.animations[name].image
            this.frameRate = this.animations[name].frameRate
            this.frameBuffer = this.animations[name].frameBuffer
            this.loop = this.animations[name].loop
            this.currentAnimation = this.animations[name]

        }

        updateHitBox() {
            this.hitbox = {
                position: {
                    x: this.position.x + 58,
                    y: this.position.y + 34
                },
                width: 50,
                height: 53
            }
        }
        checkForHorizontalCollisions() {
            for (let i = 0; i < this.collisionBlocks.length; i++) {
                const collisionBlock = this.collisionBlocks[i]

                //if a collision exists
                if (this.hitbox.position.x <= collisionBlock.position.x + collisionBlock.width &&
                    this.hitbox.position.x + this.hitbox.width >= collisionBlock.position.x &&
                    this.hitbox.position.y + this.hitbox.height >= collisionBlock.position.y &&
                    this.hitbox.position.y <= collisionBlock.position.y + collisionBlock.height
                ) {
                    //collision on x axis going to the left
                    if (this.velocity.x < 0) {
                        const offset = this.hitbox.position.x - this.position.x
                        this.position.x = collisionBlock.position.x + collisionBlock.width - offset + 0.01
                        break
                    }
                    if (this.velocity.x > 0) {
                        const offset = this.hitbox.position.x - this.position.x + this.hitbox.width

                        this.position.x = collisionBlock.position.x - offset - 0.01
                        break
                    }
                }
            }
        }
        applyGravity() {
            this.velocity.y += this.gravity
            this.position.y += this.velocity.y
        }
        checkForVerticalCollisions() {
            for (let i = 0; i < this.collisionBlocks.length; i++) {
                const collisionBlock = this.collisionBlocks[i]

                //if a collision exists
                if (this.hitbox.position.x <= collisionBlock.position.x + collisionBlock.width &&
                    this.hitbox.position.x + this.hitbox.width >= collisionBlock.position.x &&
                    this.hitbox.position.y + this.hitbox.height >= collisionBlock.position.y &&
                    this.hitbox.position.y <= collisionBlock.position.y + collisionBlock.height
                ) {
                    if (this.velocity.y < 0) {
                        this.velocity.y = 0
                        const offset = this.hitbox.position.y - this.position.y
                        this.position.y = collisionBlock.position.y + collisionBlock.height - offset + 0.01
                        break
                    }
                    if (this.velocity.y > 0) {
                        this.velocity.y = 0
                        const offset = this.hitbox.position.y - this.position.y + this.hitbox.height
                        this.position.y = collisionBlock.position.y - offset - 0.01
                        break
                    }
                }
            }
        }
    }
    const player = new Player({
        imageSrc: './assets/king/idle.png',
        frameRate: 11,
        animations: {
            idleRight: {
                frameRate: 11,
                frameBuffer: 7,
                loop: true,
                imageSrc: './assets/king/idle.png',

            },
            idleLeft: {
                frameRate: 11,
                frameBuffer: 7,
                loop: true,
                imageSrc: './assets/king/idleLeft.png',

            },
            runRight: {
                frameRate: 8,
                frameBuffer: 4,
                loop: true,
                imageSrc: './assets/king/runRight.png',

            },
            runLeft: {
                frameRate: 8,
                frameBuffer: 4,
                loop: true,
                imageSrc: './assets/king/runLeft.png',

            },
            enterDoor: {
                frameRate: 8,
                frameBuffer: 4,
                loop: false,
                imageSrc: './assets/king/enterDoor.png',
                onComplete: () => {
                    gsap.to(overlay, {
                        opacity: 1,
                        onComplete: () => {
                            level++

                            if (level === 4) level = 1
                            levels[level].init()
                            player.switchSprite('idleRight')
                            player.preventInput = false
                            gsap.to(overlay, {
                                opacity: 0
                            })
                        }
                    })

                }

            },
            openChest: {
                frameRate: 6,
                frameBuffer: 10,
                loop: false,
                imageSrc: './assets/FrontFacingChestsSmall.png',
                scale: 0.28,
                onComplete: () => {
                    gsap.to(overlay, {
                        onComplete: () => {

                            if (level === 4) level = 1
                            levels[level].init()
                            player.switchSprite('idleRight')
                            player.preventInput = false
                            gsap.to(overlay, {
                                opacity: 0
                            })
                        }
                    })

                }

            },
        },
    })

    let level = 1
    let levels = {
        1: {
            init: () => {
                chests = [];
                signs = [];
                parsedCollisions = collisionsLevel1.parse2D();
                collisionBlocks = parsedCollisions.createObjectsFrom2D()
                player.collisionBlocks = collisionBlocks
                if (player.currentAnimation) player.currentAnimation.isActive = false

                background = new Sprite({
                    position: {
                        x: 0,
                        y: 0
                    },
                    imageSrc: '../../assets-portfolio/Assets-Interactive/assets/backgroundLevel1.png',
                })
                console.log(background)
                doors = [

                    new Sprite({
                        position: {
                            x: 767,
                            y: 270
                        },
                        imageSrc: './assets/doorOpen.png',
                        frameRate: 5,
                        frameBuffer: 10,
                        loop: false,
                        autoplay: false

                    })

                ]
                // signs.push(
                //     new Sprite({
                //         position: {
                //             x: 210,
                //             y: 240
                //         },
                //         imageSrc: './assets/WelcomeTo.png',
                //         scale: 0.3,
                //     })
                // )

                // Push the second sign to the signs array
                // signs.push(
                //     new Sprite({
                //         position: {
                //             x: 335,
                //             y: 220
                //         },
                //         imageSrc: './assets/AustinCrouchers.png',
                //         scale: 0.4,
                //     })
                // )
                // signs.push(
                //     new Sprite({
                //         position: {
                //             x: 510,
                //             y: 240
                //         },
                //         imageSrc: './assets/Portfolio.png',
                //         scale: 0.3,
                //     })
                // )
                signs.push(
                    new Sprite({
                        position: {
                            x: 725,
                            y: 150
                        },
                        imageSrc: './assets/GoThroughDoorWithW.png',
                        scale: 0.35,
                    })
                )
                signs.push(
                    new Sprite({
                        position: {
                            x: 200,
                            y: 380
                        },
                        imageSrc: './assets/Controls2.png',
                        scale: 0.35,
                    })
                )
            },
        },
        2: {
            init: () => {
                chests = [];
                signs = [];

                parsedCollisions = collisionsLevel2.parse2D();
                collisionBlocks = parsedCollisions.createObjectsFrom2D()
                player.collisionBlocks = collisionBlocks
                player.position.x = 96
                player.position.y = 140

                if (player.currentAnimation) player.currentAnimation.isActive = false

                background = new Sprite({
                    position: {
                        x: 0,
                        y: 0
                    },
                    imageSrc: '../../assets-portfolio/Assets-Interactive/assets/backgroundLevel2.png'
                })

                doors = [

                    new Sprite({
                        position: {
                            x: 772,
                            y: 336
                        },
                        imageSrc: './assets/doorOpen.png',
                        frameRate: 5,
                        frameBuffer: 10,
                        loop: false,
                        autoplay: false

                    })

                ]

                chests = [
                    new Sprite({
                        position: {
                            x: 150,
                            y: 454
                        },
                        imageSrc: './assets/FrontFacingChestsSmall.png',
                        frameRate: 6,
                        frameBuffer: 50,
                        loop: false,
                        autoplay: false,
                        scale: 0.28,
                        opacity: 0.

                    })

                ]
            },
        },
        3: {
            init: () => {
                chests = [];
                signs = [];

                parsedCollisions = collisionsLevel3.parse2D();
                collisionBlocks = parsedCollisions.createObjectsFrom2D()
                if (player.currentAnimation) player.currentAnimation.isActive = false

                player.collisionBlocks = collisionBlocks
                player.position.x = 750
                player.position.y = 230

                background = new Sprite({
                    position: {
                        x: 0,
                        y: 0
                    },
                    imageSrc: '../../assets-portfolio/Assets-Interactive/assets/backgroundLevel1.png'
                })

                doors = [

                    new Sprite({
                        position: {
                            x: 176,
                            y: 335
                        },
                        imageSrc: './assets/doorOpen.png',
                        frameRate: 5,
                        frameBuffer: 10,
                        loop: false,
                        autoplay: false

                    })

                ]
            },
        },

    }


    const keys = {
        w: {
            pressed: false
        },
        a: {
            pressed: false
        },
        d: {
            pressed: false
        }


    }

    const overlay = {
        opacity: 0,
    }
    let parsedCollisions
    let collisionBlocks
    let background
    let doors
    let chests
    let signs


    Array.prototype.parse2D = function () {
        const rows = []
        for (let i = 0; i < this.length; i += 16) {
            rows.push(this.slice(i, i + 16))
        }

        return rows
    }


    Array.prototype.createObjectsFrom2D = function () {
        const objects = []
        this.forEach((row, y) => {
            row.forEach((symbol, x) => {
                if (symbol === 292 || symbol === 250) {
                    //push new collision into collision blocks array
                    objects.push(new CollisionBlock({
                        position: {
                            x: x * 64,
                            y: y * 64,
                        }
                    }));
                }
            });
        });
        return objects
    }

    const collisionsLevel1 = [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 292, 292, 292, 292, 292, 292, 292, 292, 292, 292, 292, 292, 292, 292, 0,
        0, 292, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 292, 0,
        0, 292, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 292, 0,
        0, 292, 292, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 292, 0,
        0, 292, 292, 292, 292, 292, 292, 292, 292, 292, 292, 292, 292, 292, 292, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ]

    const collisionsLevel2 = [292, 292, 292, 292, 292, 292, 292, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        292, 0, 0, 0, 0, 0, 292, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        292, 0, 0, 0, 0, 0, 292, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        292, 292, 292, 292, 0, 0, 292, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 292, 0, 0, 292, 0, 0, 292, 292, 292, 292, 292, 292, 0,
        0, 292, 292, 292, 0, 0, 292, 292, 292, 292, 0, 0, 0, 0, 292, 0,
        0, 292, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 292, 0,
        0, 292, 0, 0, 0, 0, 0, 0, 0, 0, 292, 292, 292, 292, 292, 0,
        0, 292, 292, 292, 292, 292, 292, 292, 292, 292, 292, 292, 0, 0, 0, 0]

    const collisionsLevel3 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 0,
        0, 250, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 250, 0,
        0, 250, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 250, 0,
        0, 250, 0, 0, 0, 0, 0, 0, 0, 0, 250, 250, 250, 250, 250, 0,
        0, 250, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 250, 0, 0,
        0, 250, 250, 0, 0, 0, 0, 0, 0, 0, 0, 0, 250, 250, 0, 0,
        0, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]


    class CollisionBlock {
        constructor({ position }) {
            this.position = position
            this.width = 64
            this.height = 64
        }
        draw() {
            c.fillStyle = 'rgba(255,0,0, 0.5)'
            c.fillRect(this.position.x, this.position.y, this.width, this.height)

        }
    }

    window.addEventListener('keydown', (event) => {
        if (player.preventInput) return
        switch (event.key) {
            case 'w':

                for (let i = 0; i < doors.length; i++) {
                    const door = doors[i]

                    if (player.hitbox.position.x < door.position.x + door.width &&
                        player.hitbox.position.x + player.hitbox.width > door.position.x &&
                        player.hitbox.position.y < door.position.y + door.height &&
                        player.hitbox.position.y + player.hitbox.height > door.position.y
                    ) {
                        player.velocity.x = 0
                        player.velocity.y = 0
                        player.preventInput = true
                        player.switchSprite('enterDoor')
                        door.play()
                        return
                    }

                }
                for (let i = 0; i < chests.length; i++) {
                    const chest = chests[i];

                    // Check if the player is in front of the chest
                    if (
                        player.hitbox.position.x + player.hitbox.width >= chest.position.x &&
                        player.hitbox.position.x <= chest.position.x + chest.width &&
                        player.hitbox.position.y + player.hitbox.height <= chest.position.y &&
                        player.hitbox.position.y + player.hitbox.height >= chest.position.y - 10
                    ) {
                        player.velocity.x = 0;
                        player.velocity.y = 0;
                        player.preventInput = true;
                        player.switchSprite('openChest');
                        chest.play();
                        return;
                    }
                }

                if (player.velocity.y === 0)
                    player.velocity.y = -15

                break
            case 'a':
                keys.a.pressed = true
                break
            case 'd':
                keys.d.pressed = true
                break
            default:
                break;
        }
    })


    window.addEventListener('keyup', (event) => {
        switch (event.key) {
            case 'a':
                keys.a.pressed = false
                break
            case 'd':
                keys.d.pressed = false
                break
            default:
                break;
        }
    })


    function animate() {
        window.requestAnimationFrame(animate);
        background.draw()

        // collisionBlocks.forEach(collisionBlock => {
        //     collisionBlock.draw()
        // })

        doors.forEach(door => {
            door.draw()
        })
        chests.forEach(chest => {
            chest.draw()
        })
        signs.forEach(sign => {
            sign.draw()
        })
        player.draw();
        player.handleInput(keys)
        player.update();




        c.save()
        c.globalAlpha = overlay.opacity
        c.fillStyle = 'black'
        c.fillRect(0, 0, canvas.width, canvas.height)
        c.restore()
    }

    window.onload = () => {
        levels[level].init();
        animate();
    };

}

export default game;
