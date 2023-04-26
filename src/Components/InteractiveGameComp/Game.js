import { gsap } from "gsap";
import Background1 from "../../assets-portfolio/Assets-Interactive/assets/backgroundLevel1.png"
import Background2 from "../../assets-portfolio/Assets-Interactive/assets/backgroundLevel2.png"
import Background3 from "../../assets-portfolio/Assets-Interactive/assets/backgroundLevel3.png"

import idle from "../../assets-portfolio/Assets-Interactive/assets/king/idle.png"
import idleLeft from "../../assets-portfolio/Assets-Interactive/assets/king/idleLeft.png"
import runLeft from "../../assets-portfolio/Assets-Interactive/assets/king/runLeft.png"
import runRight from "../../assets-portfolio/Assets-Interactive/assets/king/runRight.png"
import enterDoor from "../../assets-portfolio/Assets-Interactive/assets/king/enterDoor.png"
import doorOpen from "../../assets-portfolio/Assets-Interactive/assets/doorOpen.png"
import goThroughDoorWithW from "../../assets-portfolio/Assets-Interactive/assets/SignPaintBlur.png"
import HangingSign from "../../assets-portfolio/Assets-Interactive/assets/Controls2Edit.png"
import Banner from "../../assets-portfolio/Assets-Interactive/assets/Banner.png"
import AboutMe from "../../assets-portfolio/Assets-Interactive/assets/AboutPaint.png"
import Projects from "../../assets-portfolio/Assets-Interactive/assets/Projects.png"
import Lever from "../../assets-portfolio/Assets-Interactive/assets/LeverBrown.png"
import FlipLever from "../../assets-portfolio/Assets-Interactive/assets/leverAnimation.png"
import ProjectsBelow from "../../assets-portfolio/Assets-Interactive/assets/ProjectsBelow.png"
import Chest2 from "../../assets-portfolio/Assets-Interactive/assets/Chest2.png"



let game = {
    over: false,
    active: true
};

game.mount = (canvas) => {
    const c = canvas.getContext('2d')

    canvas.width = 64 * 16 // 1024
    canvas.height = 64 * 9 // 576
    // function resizeCanvas() {
    //     canvas.width = window.innerWidth;
    //     canvas.height = window.innerHeight;
    // }

    // resizeCanvas();
    // window.addEventListener('resize', resizeCanvas);

    class Sprite {
        constructor({ position, imageSrc, frameRate = 1, animations, frameBuffer = 2, loop = true, autoplay = true, scale = 1, }) {
            this.position = position;
            this.image = new Image();
            this.image.onload = () => {
                this.loaded = true;
                this.width = this.image.width / this.frameRate;
                this.height = this.image.height;
            };

            this.image.src = imageSrc;
            this.loaded = false;
            this.frameRate = frameRate;
            this.currentFrame = 0;
            this.elapsedFrames = 0;
            this.frameBuffer = frameBuffer;
            this.animations = animations;
            this.loop = loop;
            this.autoplay = autoplay;
            this.scale = scale;

            if (this.animations) {
                for (let key in this.animations) {
                    const image = new Image();
                    image.src = this.animations[key].imageSrc;
                    this.animations[key].image = image;
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
        imageSrc: idle,
        frameRate: 11,
        animations: {
            idleRight: {
                frameRate: 11,
                frameBuffer: 7,
                loop: true,
                imageSrc: idle,

            },
            idleLeft: {
                frameRate: 11,
                frameBuffer: 7,
                loop: true,
                imageSrc: idleLeft,

            },
            runRight: {
                frameRate: 8,
                frameBuffer: 4,
                loop: true,
                imageSrc: runRight,

            },
            runLeft: {
                frameRate: 8,
                frameBuffer: 4,
                loop: true,
                imageSrc: runLeft,

            },
            enterDoor: {
                frameRate: 8,
                frameBuffer: 4,
                loop: false,
                imageSrc: enterDoor,
                onComplete: () => {
                    gsap.to(overlay, {
                        opacity: 1,
                        onComplete: () => {
                            level++

                            if (level === 5) level = 1
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
            flipLever: {
                frameRate: 2,
                frameBuffer: 2,
                loop: false,
                imageSrc: FlipLever,
                scale: 0.0001,
                onComplete: () => {
                    player.preventInput = false;
                }
            },
        },
    })

    let level = 4
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
                    imageSrc: Background1,
                })
                console.log(background)
                doors = [

                    new Sprite({
                        position: {
                            x: 767,
                            y: 270
                        },
                        imageSrc: doorOpen,
                        frameRate: 5,
                        frameBuffer: 10,
                        loop: false,
                        autoplay: false

                    })

                ]
                signs.push(
                    new Sprite({
                        position: {
                            x: 725,
                            y: 150
                        },
                        imageSrc: goThroughDoorWithW,
                        scale: 0.35,
                    })
                )
                signs.push(
                    new Sprite({
                        position: {
                            x: 205,
                            y: 380
                        },
                        imageSrc: HangingSign,
                        scale: 0.35,
                    })
                )
                signs.push(
                    new Sprite({
                        position: {
                            x: 140,
                            y: 70
                        },
                        imageSrc: Banner,
                        scale: 0.5,
                        opacity: 0, // Set initial opacity to 0
                    })
                )
                signs.push(
                    new Sprite({
                        position: {
                            x: 595,
                            y: 290
                        },
                        imageSrc: AboutMe,
                        scale: 0.18,
                    })
                )
            },
        },
        2: {
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
                    imageSrc: Background1,
                })
                console.log(background)
                doors = [

                    new Sprite({
                        position: {
                            x: 767,
                            y: 270
                        },
                        imageSrc: doorOpen,
                        frameRate: 5,
                        frameBuffer: 10,
                        loop: false,
                        autoplay: false

                    })

                ]
                levers = [
                    new Sprite({
                        position: {
                            x: 567,
                            y: 320
                        },
                        imageSrc: FlipLever, // Replace FlipLever with your lever animation spritesheet
                        frameRate: 2, // Set the frame rate for the lever animation
                        frameBuffer: 2, // Set the frame buffer for the lever animation
                        loop: false,
                        autoplay: false,
                        scale: 0.1
                    })
                ];
                // signs.push(
                //     new Sprite({
                //         position: {
                //             x: 394,
                //             y: 300
                //         },
                //         imageSrc: Lever,
                //         scale: 0.15,
                //     })
                // )
                signs.push(
                    new Sprite({
                        position: {
                            x: 354,
                            y: 400
                        },
                        imageSrc: HangingSign,
                        scale: 0.35,
                    })
                )
                const banner = new Sprite({
                    position: {
                        x: 140,
                        y: 70
                    },
                    imageSrc: Banner,
                    scale: 0.5,
                    opacity: 0, // Set initial opacity to 0
                });

                signs.push(banner);

                gsap.to(banner, {
                    opacity: 1, // Target opacity value
                    duration: 2, // Duration of the animation in seconds
                    ease: 'power2.out', // Easing function for smooth animation
                });
            },
        },
        3: {
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
                    imageSrc: Background2
                })

                doors = [

                    new Sprite({
                        position: {
                            x: 772,
                            y: 336
                        },
                        imageSrc: doorOpen,
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
                signs.push(
                    new Sprite({
                        position: {
                            x: 695,
                            y: 355
                        },
                        imageSrc: Projects,
                        scale: 0.15,
                    })
                )
            },
        },
        4: {
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
                    imageSrc: Background3
                })

                doors = [

                    new Sprite({
                        position: {
                            x: 176,
                            y: 335
                        },
                        imageSrc: doorOpen,
                        frameRate: 5,
                        frameBuffer: 10,
                        loop: false,
                        autoplay: false

                    })

                ]
                signs.push(
                    new Sprite({
                        position: {
                            x: 285,
                            y: 245
                        },
                        imageSrc: ProjectsBelow,
                        scale: 0.3,
                    })
                )
                signs.push(
                    new Sprite({
                        position: {
                            x: 285,
                            y: 385
                        },
                        imageSrc: Chest2,
                        scale: 0.3,
                    })
                )
                signs.push(
                    new Sprite({
                        position: {
                            x: 385,
                            y: 385
                        },
                        imageSrc: Chest2,
                        scale: 0.3,
                    })
                )
                signs.push(
                    new Sprite({
                        position: {
                            x: 485,
                            y: 385
                        },
                        imageSrc: Chest2,
                        scale: 0.3,
                    })
                )
                signs.push(
                    new Sprite({
                        position: {
                            x: 585,
                            y: 385
                        },
                        imageSrc: Chest2,
                        scale: 0.3,
                    })
                )
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
    let levers



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
        let isLeverAnimationPlaying = false;

        if (player.preventInput) return;
        switch (event.key) {
            case 'w':
                try {
                    for (let i = 0; i < doors.length; i++) {
                        const door = doors[i];
                        if (
                            player.hitbox.position.x < door.position.x + door.width &&
                            player.hitbox.position.x + player.hitbox.width > door.position.x &&
                            player.hitbox.position.y < door.position.y + door.height &&
                            player.hitbox.position.y + player.hitbox.height > door.position.y
                        ) {
                            player.velocity.x = 0;
                            player.velocity.y = 0;
                            player.preventInput = true;
                            player.switchSprite('enterDoor');
                            door.play();
                            return;
                        }
                    }
                    // for (let i = 0; i < levers.length; i++) {
                    //     if (isLeverAnimationPlaying) break; // Skip the loop if the lever animation is already playing

                    //     const lever = levers[i];
                    //     const hitbox = player.hitbox;

                    //     const isWithinXRange = hitbox.position.x + hitbox.width >= lever.position.x &&
                    //         hitbox.position.x <= lever.position.x + lever.width;

                    //     const isAboveLeverTop = hitbox.position.y + hitbox.height <= lever.position.y;
                    //     const isWithinHeightRange = hitbox.position.y + hitbox.height >= lever.position.y - 20;

                    //     if (isWithinXRange && isAboveLeverTop && isWithinHeightRange) {
                    //         player.velocity.x = 0;
                    //         player.velocity.y = 0;
                    //         player.preventInput = true;
                    //         player.switchSprite('flipLever');
                    //         lever.play(); // Play the lever animation
                    //         isLeverAnimationPlaying = true; // Set the flag to true
                    //         lever.onComplete = () => {
                    //             player.preventInput = false;
                    //             isLeverAnimationPlaying = false; // Set the flag back to false when the animation completes
                    //         }
                    //         return;
                    //     }
                    // }
                    if (player.velocity.y === 0) player.velocity.y = -15;
                } catch (error) {
                    console.clear(); // Clear console log to disable error message
                }
                break;
            case 'a':
                keys.a.pressed = true;
                break;
            case 'd':
                keys.d.pressed = true;
                break;
            default:
                break;
        }
    });


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
        // levers.forEach(chest => {
        //     chest.draw()
        // })
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
