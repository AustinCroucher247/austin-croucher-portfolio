import { gsap } from "gsap";
// import { ReactDOM } from "react";

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
import FlipLever from "../../assets-portfolio/Assets-Interactive/assets/leverAnimation.png"
import ProjectsBelow from "../../assets-portfolio/Assets-Interactive/assets/ProjectsBelowSun.png"
import LinkedInSign from "../../assets-portfolio/Assets-Interactive/assets/LinkedInSign.png"
import GutHubSign from "../../assets-portfolio/Assets-Interactive/assets/GitHubSign.png"
import SkillSet from "../../assets-portfolio/Assets-Interactive/assets/Skillset.png"
import LeverW from "../../assets-portfolio/Assets-Interactive/assets/useW.png"
import HTML from '../../assets-portfolio/html-5.png'
import CSS from '../../assets-portfolio/css-3.png'
import JavaScript from '../../assets-portfolio/js.png'
import Node from '../../assets-portfolio/nodejs.png'
import ReactImg from '../../assets-portfolio/react.png'
import SASS from '../../assets-portfolio/sass.png'
import MySQL from '../../assets-portfolio/mysql.png'
import Git from '../../assets-portfolio/git.png'
import ChestAnimationFinal from '../../assets-portfolio/Assets-Interactive/assets/ChestAnimationFinal.png'


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
            this.position.x += this.velocity.x
            this.updateHitBox()
            this.checkForHorizontalCollisions()
            this.applyGravity()
            this.updateHitBox()
            this.checkForVerticalCollisions()
        }
        handleInput(keys) {
            if (this.preventInput) return
            player.velocity.x = 0
            if (keys.d.pressed) {
                this.switchSprite('runRight')
                this.velocity.x = 3;
                this.lastDirection = 'right'
            } else if (keys.a.pressed) {
                this.switchSprite('runLeft')
                this.velocity.x = -3;
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
        leverActivated: false, // Add this property
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
                frameBuffer: 6,
                loop: false,
                imageSrc: ChestAnimationFinal,
                onComplete: () => {
                    player.preventInput = false;
                    const retroRumbleUrl = 'https://retrorumble.netlify.app/';
                    const newWindow = window.open(retroRumbleUrl, '_blank', 'noopener,noreferrer');
                    setTimeout(() => {
                        if (!newWindow.closed) {
                            newWindow.close(); // Close the LinkedIn profile window if it's still open
                        }
                    }, 3000);

                    window.location.reload(); // Refresh the page
                }
            },
            openChest1: {
                frameRate: 6,
                frameBuffer: 6,
                loop: false,
                imageSrc: ChestAnimationFinal,
                onComplete: () => {
                    player.preventInput = false;
                    const retroRumbleUrl = 'https://planetjumper.netlify.app/';
                    const newWindow = window.open(retroRumbleUrl, '_blank', 'noopener,noreferrer');
                    setTimeout(() => {
                        if (!newWindow.closed) {
                            newWindow.close(); // Close the LinkedIn profile window if it's still open
                        }
                    }, 3000);

                    window.location.reload(); // Refresh the page
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

                    // Open LinkedIn profile in a new window or tab
                    const linkedInProfileUrl = 'https://www.linkedin.com/in/austincroucher/';
                    const newWindow = window.open(linkedInProfileUrl, '_blank', 'noopener,noreferrer');

                    setTimeout(() => {
                        if (!newWindow.closed) {
                            newWindow.close(); // Close the LinkedIn profile window if it's still open
                        }
                    }, 3000);

                    window.location.reload(); // Refresh the page
                }
            },
            flipLeverGit: {
                frameRate: 2,
                frameBuffer: 2,
                loop: false,
                imageSrc: FlipLever,
                scale: 0.0001,
                onComplete: () => {
                    player.preventInput = false;

                    // Open LinkedIn profile in a new window or tab
                    const linkedInProfileUrl = 'https://github.com/AustinCroucher247';
                    const newWindow = window.open(linkedInProfileUrl, '_blank', 'noopener,noreferrer');

                    // Refresh the page after 5 seconds
                    setTimeout(() => {
                        if (!newWindow.closed) {
                            newWindow.close(); // Close the LinkedIn profile window if it's still open
                        }
                    }, 3000);

                    window.location.reload(); // Refresh the page
                }
            },
            skillSet: {
                frameRate: 2,
                frameBuffer: 2,
                loop: false,
                imageSrc: FlipLever,
                scale: 0.0001,
                onComplete: () => {
                    player.preventInput = false;
                    const levers2 = document.querySelectorAll('.lever2');

                    for (let i = 0; i < levers2.length; i++) {
                        const lever = levers2[i];
                        if (
                            !player.leverActivated && // Add this condition
                            player.hitbox.position.x < lever.position.x + 20 &&
                            player.hitbox.position.x + player.hitbox.width > lever.position.x &&
                            player.hitbox.position.y < lever.position.y + lever.height &&
                            player.hitbox.position.y + player.hitbox.height > lever.position.y
                        ) {
                            lever.flipped = true;
                            player.velocity.x = 0;
                            player.velocity.y = 0;
                            player.preventInput = true;
                            player.leverActivated = true; // Set the leverActivated property to true
                            player.switchSprite('skillSet');
                            lever.play();

                            // Create the modal after the lever is flipped and the animation is complete
                            const modal = document.createElement('div');
                            modal.style.display = 'block';
                            modal.style.position = 'fixed';
                            modal.style.zIndex = '1';
                            modal.style.left = '0';
                            modal.style.top = '0';
                            modal.style.width = '100%';
                            modal.style.height = '100%';
                            modal.style.overflow = 'auto';
                            modal.style.backgroundColor = 'rgba(0,0,0,0.4)';

                            const modalContent = document.createElement('div');
                            modalContent.style.backgroundColor = '#fefefe';
                            modalContent.style.margin = '15% auto';
                            modalContent.style.padding = '20px';
                            modalContent.style.border = '1px solid #888';
                            modalContent.style.width = '80%';

                            const modalText = document.createElement('p');
                            modalText.innerHTML = 'The lever has been flipped!';
                            modalContent.appendChild(modalText);

                            const closeModalButton = document.createElement('button');
                            closeModalButton.innerHTML = 'Close';
                            closeModalButton.style.display = 'block';
                            closeModalButton.style.margin = '0 auto';
                            closeModalButton.style.padding = '10px';
                            closeModalButton.style.cursor = 'pointer';
                            closeModalButton.onclick = () => {
                                modal.style.display = 'none';
                            };
                            modalContent.appendChild(closeModalButton);

                            modal.appendChild(modalContent);
                            document.body.appendChild(modal);

                            return;
                        }
                    }
                }
            }
        },
    })

    let level = 1
    let levels = {
        1: {
            init: () => {
                chests = [];
                chests1 = [];
                signs = [];
                levers = []
                levers1 = []
                levers2 = []

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
                chests1 = [];


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
                        autoplay: false,
                        type: 'door' // Add this property
                    }),
                ];
                signs.push(
                    new Sprite({
                        position: {
                            x: 250,
                            y: 370
                        },
                        imageSrc: LinkedInSign,
                        scale: 0.32,
                    })
                )
                signs.push(
                    new Sprite({
                        position: {
                            x: 410,
                            y: 370
                        },
                        imageSrc: GutHubSign,
                        scale: 0.32,
                    })
                )
                signs.push(
                    new Sprite({
                        position: {
                            x: 570,
                            y: 370
                        },
                        imageSrc: SkillSet,
                        scale: 0.32,
                    })
                )
                signs.push(
                    new Sprite({
                        position: {
                            x: 125,
                            y: 380
                        },
                        imageSrc: LeverW,
                        scale: 0.32,
                    })
                )
                const banner = new Sprite({
                    position: {
                        x: 140,
                        y: 70
                    },
                    imageSrc: Banner,
                    scale: 0.5,
                    opacity: 0,
                });

                signs.push(banner);

                gsap.to(banner, {
                    opacity: 1, // Target opacity value
                    duration: 2, // Duration of the animation in seconds
                    ease: 'power2.out', // Easing function for smooth animation
                });
                levers = [
                    new Sprite({
                        position: {
                            x: 310,
                            y: 320
                        },
                        imageSrc: FlipLever,
                        flipped: false,
                        frameRate: 2,
                        frameBuffer: 2,
                        loop: false,
                        autoplay: false,
                        scale: 0.1
                    }),
                ];
                levers1 = [
                    new Sprite({
                        position: {
                            x: 470,
                            y: 320
                        },
                        imageSrc: FlipLever,
                        flipped: false,
                        frameRate: 2,
                        frameBuffer: 2,
                        loop: false,
                        autoplay: false,
                        scale: 0.1
                    }),
                ];
                levers2 = [
                    new Sprite({
                        position: {
                            x: 632,
                            y: 320
                        },
                        imageSrc: FlipLever,
                        flipped: false,
                        frameRate: 2,
                        frameBuffer: 2,
                        loop: false,
                        autoplay: false,
                        scale: 0.1
                    }),
                ];

            },
        },
        3: {
            init: () => {
                chests = [];
                levers = []
                levers1 = []
                levers2 = []
                chests1 = [];

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
                levers = []
                levers1 = []
                levers2 = []
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
                chests = [
                    new Sprite({
                        position: {
                            x: 355,
                            y: 385
                        },
                        imageSrc: ChestAnimationFinal,
                        frameRate: 6,
                        frameBuffer: 6,
                        loop: false,
                        autoplay: false,
                        scale: 0.30,
                        opacity: 0.

                    })

                ]
                chests1 = [
                    new Sprite({
                        position: {
                            x: 455,
                            y: 385
                        },
                        imageSrc: ChestAnimationFinal,
                        frameRate: 6,
                        frameBuffer: 6,
                        loop: false,
                        autoplay: false,
                        scale: 0.30,
                        opacity: 0.

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
    let chests1
    let signs
    // eslint-disable-next-line
    let levers
    let levers1
    let levers2


    // eslint-disable-next-line
    Array.prototype.parse2D = function () {
        const rows = []
        for (let i = 0; i < this.length; i += 16) {
            rows.push(this.slice(i, i + 16))
        }

        return rows
    }

    // eslint-disable-next-line
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


    function displaySkillSetModal() {
        const modal = document.createElement('div');
        modal.style.display = 'block';
        modal.style.position = 'fixed';
        modal.style.zIndex = '1000';
        modal.style.left = '0';
        modal.style.top = '0';
        modal.style.width = '100%';
        modal.style.height = '100%';
        modal.style.borderRadius = '10px';
        modal.style.overflow = 'auto';
        modal.style.backgroundColor = 'rgba(0,0,0,0.4)';

        const modalContent = document.createElement('div');
        modalContent.style.background = 'linear-gradient(to right, #090d31, #1B435E)';
        modalContent.style.margin = '15% auto';
        modalContent.style.padding = '20px';
        modalContent.style.border = '1px solid #888';
        modalContent.style.width = '80%';
        modalContent.style.borderRadius = '10px'
        const skillIconContainer = document.createElement('div');
        skillIconContainer.className = 'skill--icon--container';
        modalContent.appendChild(skillIconContainer);

        const skills = [
            { src: HTML, alt: 'HTML' },
            { src: CSS, alt: 'CSS' },
            { src: JavaScript, alt: 'Javascript' },
            { src: ReactImg, alt: 'React' },
            { src: Node, alt: 'Node' },
            { src: SASS, alt: 'SASS' },
            { src: Git, alt: 'Git' },
            { src: MySQL, alt: 'MySQL' },
        ];

        // Create image elements for each skill
        skills.forEach((skill) => {
            const skillImage = document.createElement('img');
            skillImage.src = skill.src;
            skillImage.className = 'skill--image';
            skillImage.alt = skill.alt;
            skillImage.style.marginRight = '3rem'; // Add 3rem space between images
            skillIconContainer.appendChild(skillImage);
        });

        // Add close button
        const closeModalButton = document.createElement('button');
        closeModalButton.innerHTML = 'Close';
        closeModalButton.style.display = 'block';
        closeModalButton.style.margin = '2rem auto'; // Add 3rem space above the close button
        closeModalButton.style.padding = '10px';
        closeModalButton.style.cursor = 'pointer';
        closeModalButton.onclick = () => {
            modal.style.display = 'none';
            window.location.reload(); // Reload the page
        };
        modalContent.appendChild(closeModalButton);

        modal.appendChild(modalContent);
        document.body.appendChild(modal);
    }

    window.addEventListener('keydown', (event) => {
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
                    for (let i = 0; i < chests.length; i++) {
                        const chest = chests[i];
                        if (
                            !player.chestActivated && // Add this condition
                            player.hitbox.position.x < chest.position.x + 20 &&
                            player.hitbox.position.x + player.hitbox.width > chest.position.x &&
                            player.hitbox.position.y < chest.position.y + chest.height &&
                            player.hitbox.position.y + player.hitbox.height > chest.position.y
                        ) {
                            player.velocity.x = 0;
                            player.velocity.y = 0;
                            player.preventInput = true;
                            player.chestActivated = true; // Set the chestActivated property to true
                            player.switchSprite('openChest');
                            chest.play(); // Play the chest animation
                            return;
                        }
                    }
                    for (let i = 0; i < chests1.length; i++) {
                        const chest = chests1[i];
                        if (
                            !player.chestActivated && // Add this condition
                            player.hitbox.position.x < chest.position.x + 20 &&
                            player.hitbox.position.x + player.hitbox.width > chest.position.x &&
                            player.hitbox.position.y < chest.position.y + chest.height &&
                            player.hitbox.position.y + player.hitbox.height > chest.position.y
                        ) {
                            player.velocity.x = 0;
                            player.velocity.y = 0;
                            player.preventInput = true;
                            player.chestActivated = true; // Set the chestActivated property to true
                            player.switchSprite('openChest1');
                            chest.play(); // Play the chest animation
                            return;
                        }
                    }
                    for (let i = 0; i < levers.length; i++) {
                        const lever = levers[i];
                        if (
                            !player.leverActivated && // Add this condition
                            player.hitbox.position.x < lever.position.x + 20 &&
                            player.hitbox.position.x + player.hitbox.width > lever.position.x &&
                            player.hitbox.position.y < lever.position.y + lever.height &&
                            player.hitbox.position.y + player.hitbox.height > lever.position.y
                        ) {
                            // lever.flipped = true;
                            player.velocity.x = 0;
                            player.velocity.y = 0;
                            player.preventInput = true;
                            player.leverActivated = true; // Set the leverActivated property to true
                            player.switchSprite('flipLever');
                            lever.play();
                            return;
                        }
                    }
                    for (let i = 0; i < levers.length; i++) {
                        const lever = levers[i];
                        if (
                            !player.leverActivated && // Add this condition
                            player.hitbox.position.x < lever.position.x + 20 &&
                            player.hitbox.position.x + player.hitbox.width > lever.position.x &&
                            player.hitbox.position.y < lever.position.y + lever.height &&
                            player.hitbox.position.y + player.hitbox.height > lever.position.y
                        ) {
                            // lever.flipped = true;
                            player.velocity.x = 0;
                            player.velocity.y = 0;
                            player.preventInput = true;
                            player.leverActivated = true; // Set the leverActivated property to true
                            player.switchSprite('flipLever');
                            lever.play();
                            return;
                        }
                    }
                    for (let i = 0; i < levers1.length; i++) {
                        const lever = levers1[i];
                        if (
                            !player.leverActivated && // Add this condition
                            player.hitbox.position.x < lever.position.x + 20 &&
                            player.hitbox.position.x + player.hitbox.width > lever.position.x &&
                            player.hitbox.position.y < lever.position.y + lever.height &&
                            player.hitbox.position.y + player.hitbox.height > lever.position.y
                        ) {
                            // lever.flipped = true;
                            player.velocity.x = 0;
                            player.velocity.y = 0;
                            player.preventInput = true;
                            player.leverActivated = true; // Set the leverActivated property to true
                            player.switchSprite('flipLeverGit');
                            lever.play();
                            return;
                        }
                    }
                    for (let i = 0; i < levers2.length; i++) {
                        const lever = levers2[i];
                        if (
                            !player.leverActivated &&
                            player.hitbox.position.x < lever.position.x + 20 &&
                            player.hitbox.position.x + player.hitbox.width > lever.position.x &&
                            player.hitbox.position.y < lever.position.y + lever.height &&
                            player.hitbox.position.y + player.hitbox.height > lever.position.y
                        ) {
                            lever.flipped = true;
                            player.velocity.x = 0;
                            player.velocity.y = 0;
                            player.preventInput = true;
                            player.leverActivated = true;
                            player.switchSprite('skillSet');
                            lever.play();

                            // Call the function to display the modal after the lever is flipped and the animation is complete
                            setTimeout(() => {
                                displaySkillSetModal();
                            }, 1000); // Adjust the delay as needed

                            return;
                        }
                    }
                    ;

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
        doors.forEach(door => {
            door.draw()
        })

        levers.forEach(lever => {
            lever.draw()
        })

        levers1.forEach(lever => {
            lever.draw()
        })
        levers2.forEach(lever => {
            lever.draw()
        })
        chests.forEach(chest => {
            chest.draw()
        })
        chests1.forEach(chest => {
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

// Code to see collision blocks of map. needs to be moved into animate function
// collisionBlocks.forEach(collisionBlock => {
//     collisionBlock.draw()
// })

export default game;
