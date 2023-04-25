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
    }
})