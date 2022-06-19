import React from 'react';
import Phaser from "phaser";

// Textures
import GrassGround from "../../assets/ground/grass_block.svg";
import StoneGround from "../../assets/ground/stone_block.svg";
import SandGround from "../../assets/ground/sand_block.svg";
import WaterGround from "../../assets/ground/water_block.svg";

const Game = () => {

    const config = {
        type: Phaser.AUTO,
        parent: "game-window",
        width: window.innerWidth,
        height: window.innerHeight,
        scene: {
            preload: preload,
            create: create,
            update: update
        },
        transparent: true
    };

    var hexes,
        groundBlockSize;

    let game = new Phaser.Game(config);

    const textures = {
        ground: {
            '1': {
                name: 'grass-ground',
                sprite: GrassGround
            },
            '2': {
                name: 'stone-ground',
                sprite: StoneGround
            },
            '3': {
                name: 'sand-ground',
                sprite: SandGround
            },
            '4': {
                name: 'water-ground',
                sprite: WaterGround
            }
        }
    }

    function preload() {
        Object.keys(textures.ground).forEach((item) => {
            this.load.image(String(textures.ground[item].name), textures.ground[item].sprite);
        });
    }

    function create() {

        // Init game map
        const map = [
            '44444444444444444444444444444444444444444444444444',
            '44444444444444444444444444444444444444444444444444',
            '44444444444444444444444444444444444444444444444444',
            '44444444444444444444444444444444444444444444444444',
            '44441111444444444122221111111111111122224444444444',
            '44441111111134444331444443333314444433333144444444',
            '44441111111111111122221111111111111122224444444444',
            '44441111111133333331444443333314444433333144444444',
            '44441111111111111122221111111111111122224444444444',
            '44441111111133333331444443333314444433333144444444',
            '44441111111111111122221111111111111122224444444444',
            '44441111111133333331444443333314444433333144444444',
            '44441111111111111122221111111111111122224444444444',
            '44441111111133333331444443333314444433333144444444',
            '44441111111111111122221111111111111122224444444444',
            '44441111111133333331444443333314444433333144444444',
            '44441111111111111122221111111111111122224444444444',
            '44441111111133333331444443333314444433333144444444',
            '44441111111111111122221111111111111122224444444444',
            '44441111111133333331444443333314444433333144444444',
            '44441111111111111122221111111111111122224444444444',
            '44441111111133333331444443333314444433333144444444',
            '44441111111111111122221111111111111122224444444444',
            '44441111111133333331444443333314444433333144444444',
            '44441111111111111122221111111111111122224444444444',
            '44441111111133333331444443333314444433333144444444',
            '44441111111111111122221111111111111122224444444444',
            '44441111111133333331444443333314444433333144444444',
            '44441111111111111122221111111111111122224444444444',
            '44441111111133333331444443333314444433333144444444',
            '44441111111111111122221111111111111122224444444444',
            '44441111111133333331444443333314444433333144444444',
            '44441111111111111122221111111111111122224444444444',
            '44441111111133333331444443333314444433333144444444',
            '44441111111111111122221111111111111122224444444444',
            '44441111111133333331444443333314444433333144444444',
            '44441111111111111122221111111111111122224444444444',
            '44441111111133333331444443333314444433333144444444',
            '44441111111111111122221111111111111122224444444444',
            '44441111111133333331444443333314444433333144444444',
            '44441111111111111122221111111111111122224444444444',
            '44441111111133333331444443333314444433333144444444',
            '44441111111111111122221111111111111122224444444444',
            '44441111111133333331444443333314444433333144444444',
            '44441111111111111122221111111111111122224444444444',
            '44441111111133333331444443333314444433333144444444',
            '44441111111111111122221111111111111122224444444444',
            '44441111111133333331444443333314444433333144444444',
            '44444444444444444444444444444444444444444444444444',
            '44444444444444444444444444444444444444444444444444',
            '44444444444444444444444444444444444444444444444444',
            '44444444444444444444444444444444444444444444444444'
        ].map(row => row.split(''));

        groundBlockSize = window.innerWidth / map[1].length;

        hexes = this.add.group();
        hexes.enableBody = true;
        hexes.physicsBodyType = Phaser.Physics.ARCADE;

        let grass;

        map.forEach((row, y) => {

            //filled the holes on the right
            if (y % 2 == 0) {
                row.push('4');
            }

            row.forEach((char, x) => {
                let offset = () => {
                    if (char !== '4') {
                        return 0.15;
                    }
                    else {
                        return 0;
                    }
                }

                if (char !== '4') {
                    grass = hexes.create(
                        (y % 2 == 0 ? x : x + 0.5) * groundBlockSize,
                        (y - offset()) * (groundBlockSize - 4.5),
                        textures.ground[char].name
                    );
                    
                    grass.setInteractive();
                    grass.inputEnabled = true;
                    grass.input.gameObject.name = x + '-' + y;
                }
                else {
                    grass = this.add.sprite(
                        (y % 2 == 0 ? x : x + 0.5) * groundBlockSize,
                        (y - offset()) * (groundBlockSize - 4.5),
                        textures.ground[char].name,
                    );
                }

                grass.displayWidth = groundBlockSize;
                grass.scaleY = grass.scaleX;
            });
        });

        this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
            let direction = pointer.deltaY > 0 ? 'down' : 'up'; 
            var pos = game.input.activePointer.position;

            if (pointer.isDown) return;

            if (direction == 'down') {

                if (this.cameras.main.zoom - .1 < 1) {
                    return;
                }
                this.cameras.main.zoom -= .1;
            }
            else {
                if (this.cameras.main.zoom + .1 > 6.4) {
                    return;
                }
                this.cameras.main.zoom += .1;
            }

            // console.log(this.cameras.main.worldView.x)
            // if (this.cameras.main.worldView.x >= 0) {
                this.cameras.main.pan(pos.x, pos.y, 500, "Power2");
            // }
        });

        this.input.on('gameobjectover', (pointer, target) => {
            // Color current item
            // target.setTint(0xfff000);
            // console.log(target)

            // let mapChildrens = hexes.children.entries,
            //     indexOfTarget = hexes.children.entries.indexOf(target);
            // if (mapChildrens[indexOfTarget - 1)
            
            // Color neighbours items
            // mapChildrens[indexOfTarget - 1].setTint(0xfff000);
        });

        this.input.on('gameobjectdown', (pointer, target) => {
            target.setTint(0xf57120)
        })

        // this.input.on('gameobjectout', function (pointer, target) {
            // target.clearTint();
        // });

        function dragAndDrop() {
           this.input.on('pointerdown', startDrag, this);
       
           function startDrag(pointer, target) {
               this.input.off('pointerdown', startDrag, this)
               if (target[0]) {
                   this.dragObj = target[0];
                   this.input.on('pointermove', dragMove, this);
               }
               this.input.on('pointerup', stopDrag, this);
           }
           
           function dragMove(pointer) {
               this.dragObj.x = pointer.x;
               this.dragObj.y = pointer.y;
           }
       
           function stopDrag() {
               this.input.on('pointerdown', startDrag, this)
               this.input.off('pointermove', dragMove, this);
               this.input.off('pointerup', stopDrag, this);
           }
        }
        // dragAndDrop.apply(this);
    }

    function update (time, delta)
    {
    }
    
    // function findHexTile(){
    //     var pos=game.input.activePointer.position;
    //     pos.x-=hexes.x;
    //     pos.y-=hexes.y;
    //     var xVal = Math.floor((pos.x)/groundBlockSize);
    //     var yVal = Math.floor((pos.y)/(groundBlockSize*3/4));
    //     var dX = (pos.x)%groundBlockSize;
    //     var dY = (pos.y)%(groundBlockSize*3/4); 
    //     var slope = (groundBlockSize/4)/(groundBlockSize/2);
    //     var caldY=dX*slope;
    //     var delta=groundBlockSize/4-caldY;
         
    //     if(yVal%2===0){
    //        //correction needs to happen in triangular portions & the offset rows
    //        if(Math.abs(delta)>dY){
    //            if(delta>0){//odd row bottom right half
    //                 xVal--;
    //                 yVal--;
    //            }else{//odd row bottom left half
    //                 yVal--;
    //            }
    //        }
    //     }else{
    //         if(dX>groundBlockSize/2){// available values don't work for even row bottom right half
    //             if(dY<((groundBlockSize/2)-caldY)){//even row bottom right half
    //                 yVal--;
    //             }
    //         }else{
    //            if(dY>caldY){//odd row top right & mid right halves
    //                xVal--;
    //            }else{//even row bottom left half
    //                yVal--;
    //            }
    //         }
    //     }
    //    pos.x=yVal;
    //    pos.y=xVal;
    //    return pos;
    // }

    return (
        <div className='game-window' id="game-window">
        </div>
    );
}

export default Game;